package route

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"campuscash-backend/internal/controller"
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/middleware"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"campuscash-backend/internal/service"
	"campuscash-backend/pkg/mail"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	// instantiate repositories and services
	studentRepo := repository.NewStudentRepository(db)
	profRepo := repository.NewProfessorRepository(db)
	rewardRepo := repository.NewRewardRepository(db)
	couponRepo := repository.NewCouponRepository(db)
	companyRepo := repository.NewCompanyRepository(db)

	studentSvc := service.NewStudentService(studentRepo)
	profSvc := service.NewProfessorService(profRepo, studentRepo, db)
	rewardSvc := service.NewRewardService(rewardRepo)
	couponSvc := service.NewCouponService(couponRepo)
	companySvc := service.NewCompanyService(companyRepo)

	// Auth and registration
	r.POST("/api/auth/login", controller.Login(db))
	r.POST("/api/auth/signup/student", controller.SignupAluno(db))

	// signup company: implemented inline (no controller yet)
	r.POST("/api/auth/signup/company", func(c *gin.Context) {
		var in dto.CompanyRegisterDTO
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		pwHash, _ := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
		user := model.User{
			Name:         in.Name,
			Email:        in.Email,
			PasswordHash: string(pwHash),
			Role:         model.CompanyRole,
			CompanyName:  &in.Name,
			CPF:          &in.CNPJ,
			Address:      in.Address,
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"id": user.ID})
	})

	// institutions list
	r.GET("/api/institutions", func(c *gin.Context) {
		var insts []model.Institution
		db.Find(&insts)
		c.JSON(http.StatusOK, insts)
	})

	// Student routes
	student := r.Group("/api/student", middleware.Auth("student"))
	{
		student.GET("/profile", controller.StudentProfile(studentSvc))
		student.GET("/balance", controller.StudentBalance(studentSvc))

		// transactions (inline)
		student.GET("/transactions", func(c *gin.Context) {
			id := c.GetUint("userID")
			var txs []model.Transaction
			db.Where("from_user_id = ? OR to_user_id = ?", id, id).Order("created_at desc").Find(&txs)
			c.JSON(http.StatusOK, txs)
		})

		// list rewards available
		student.GET("/rewards", func(c *gin.Context) {
			var rewards []model.Reward
			db.Where("active = ?", true).Find(&rewards)
			c.JSON(http.StatusOK, rewards)
		})

		// redeem reward (inline)
		student.POST("/redeem", func(c *gin.Context) {
			id := c.GetUint("userID")
			var in struct {
				RewardID uint `json:"reward_id" binding:"required"`
			}
			if err := c.ShouldBindJSON(&in); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			// load reward
			var rew model.Reward
			if err := db.First(&rew, in.RewardID).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "reward not found"})
				return
			}
			// load student
			var studentUser model.User
			if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).First(&studentUser, id).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
				return
			}
			if studentUser.Balance < rew.Cost {
				c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient balance"})
				return
			}
			// debit and create coupon/transaction
			code := fmt.Sprintf("CC-%d-%d", time.Now().UnixNano(), id)
			t := model.Transaction{FromUserID: &studentUser.ID, ToUserID: &rew.CompanyID, Amount: rew.Cost, Type: model.RedeemCoins, RewardID: &rew.ID, CreatedAt: time.Now(), Code: &code}
			coupon := model.Coupon{RewardID: rew.ID, StudentID: studentUser.ID, Code: code, Redeemed: false, CreatedAt: time.Now()}
			err := db.Transaction(func(tx *gorm.DB) error {
				studentUser.Balance -= rew.Cost
				if err := tx.Save(&studentUser).Error; err != nil {
					return err
				}
				if err := tx.Create(&t).Error; err != nil {
					return err
				}
				if err := tx.Create(&coupon).Error; err != nil {
					return err
				}
				return nil
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			// async emails
			go func(studentEmail string, companyID uint, code string) {
				var company model.User
				if err := db.First(&company, companyID).Error; err == nil {
					_ = mail.SendMail(studentEmail, "Seu cupom CampusCash", "Código: "+code+" - Vantagem: "+rew.Title)
					_ = mail.SendMail(company.Email, "Novo resgate CampusCash", "Código: "+code+" - Aluno ID: "+strconv.FormatUint(uint64(id), 10))
				}
			}(studentUser.Email, rew.CompanyID, code)
			c.JSON(http.StatusOK, gin.H{"coupon": code})
		})

		student.GET("/coupons", controller.StudentCoupons(couponSvc))
	}

	// Professor routes
	professor := r.Group("/api/professor", middleware.Auth("professor"))
	{
		professor.GET("/profile", controller.ProfessorProfile(profSvc))
		professor.GET("/balance", controller.ProfessorBalance(profSvc))

		professor.GET("/transactions", func(c *gin.Context) {
			id := c.GetUint("userID")
			var txs []model.Transaction
			db.Where("from_user_id = ? OR to_user_id = ?", id, id).Order("created_at desc").Find(&txs)
			c.JSON(http.StatusOK, txs)
		})

		professor.GET("/students", controller.ProfessorStudents(profSvc))
		professor.POST("/transfer", controller.ProfessorTransferCoins(profSvc))
		professor.POST("/give-coins", controller.GiveCoins(db))
	}

	// Company routes
	company := r.Group("/api/company", middleware.Auth("company"))
	{
		company.GET("/profile", controller.CompanyProfile(companySvc))
		company.GET("/rewards", controller.CompanyRewards(rewardSvc))
		company.POST("/rewards", controller.CompanyCreateReward(rewardSvc))

		company.PATCH("/rewards/:id", func(c *gin.Context) {
			companyID := c.GetUint("userID")
			idStr := c.Param("id")
			id, _ := strconv.Atoi(idStr)
			var in dto.RewardCreateDTO
			if err := c.ShouldBindJSON(&in); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			var rew model.Reward
			if err := db.First(&rew, uint(id)).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "reward not found"})
				return
			}
			if rew.CompanyID != companyID {
				c.JSON(http.StatusForbidden, gin.H{"error": "not owner"})
				return
			}
			rew.Title = in.Title
			rew.Description = in.Description
			rew.Cost = in.Cost
			rew.ImageURL = in.ImageURL
			rew.Category = in.Category
			rew.Active = true
			db.Save(&rew)
			c.JSON(http.StatusOK, rew)
		})

		company.DELETE("/rewards/:id", func(c *gin.Context) {
			companyID := c.GetUint("userID")
			idStr := c.Param("id")
			id, _ := strconv.Atoi(idStr)
			var rew model.Reward
			if err := db.First(&rew, uint(id)).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "reward not found"})
				return
			}
			if rew.CompanyID != companyID {
				c.JSON(http.StatusForbidden, gin.H{"error": "not owner"})
				return
			}
			db.Delete(&rew)
			c.JSON(http.StatusOK, gin.H{"deleted": true})
		})

		company.GET("/history", func(c *gin.Context) {
			companyID := c.GetUint("userID")
			var txs []model.Transaction
			db.Where("to_user_id = ?", companyID).Order("created_at desc").Find(&txs)
			c.JSON(http.StatusOK, txs)
		})

		company.POST("/validate-coupon", controller.CompanyValidateCoupon(couponSvc))
	}

	r.GET("/", func(c *gin.Context) { c.String(200, "CampusCash Backend is running") })
}

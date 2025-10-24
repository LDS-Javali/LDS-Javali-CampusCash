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
	imgSvc := service.NewImageService()
	cronSvc := service.NewCronService(db)

	r.POST("/api/auth/login", controller.Login(db))
	r.POST("/api/auth/signup/student", controller.SignupAluno(db))
	r.GET("/api/auth/me", middleware.Auth(), controller.GetMe(db))

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
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"id": user.ID})
	})


	r.GET("/api/institutions", func(c *gin.Context) {
		var insts []model.Institution
		db.Find(&insts)
		c.JSON(http.StatusOK, insts)
	})


	r.GET("/api/rewards", func(c *gin.Context) {
		var rewards []model.Reward
		query := db.Where("active = ?", true)
		

		if categoria := c.Query("categoria"); categoria != "" && categoria != "todas" {
			query = query.Where("category = ?", categoria)
		}
		if empresa := c.Query("empresa"); empresa != "" && empresa != "todas" {
			query = query.Where("company_id = ?", empresa)
		}
		if precoMin := c.Query("precoMin"); precoMin != "" {
			query = query.Where("cost >= ?", precoMin)
		}
		if precoMax := c.Query("precoMax"); precoMax != "" {
			query = query.Where("cost <= ?", precoMax)
		}
		if busca := c.Query("busca"); busca != "" {
			query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+busca+"%", "%"+busca+"%")
		}
		

		ordenacao := c.Query("ordenacao")
		switch ordenacao {
		case "preco_menor":
			query = query.Order("cost ASC")
		case "preco_maior":
			query = query.Order("cost DESC")
		case "nome":
			query = query.Order("title ASC")
		default: // relevancia
			query = query.Order("created_at DESC")
		}
		
		query.Find(&rewards)
		c.JSON(http.StatusOK, rewards)
	})


	student := r.Group("/api/student", middleware.Auth("student"))
	{
		student.GET("/profile", controller.StudentProfile(studentSvc))
		student.PUT("/profile", controller.UpdateStudentProfile(studentSvc))
		student.POST("/profile/avatar", controller.UploadStudentAvatar(db, imgSvc))
		student.GET("/balance", controller.StudentBalance(studentSvc))
		student.GET("/statistics", controller.StudentStatistics(studentSvc))


		student.GET("/transactions", func(c *gin.Context) {
			id := c.GetUint("userID")
			var txs []model.Transaction
			db.Where("from_user_id = ? OR to_user_id = ?", id, id).Order("created_at desc").Find(&txs)
			c.JSON(http.StatusOK, txs)
		})


		student.GET("/rewards", func(c *gin.Context) {
			var rewards []model.Reward
			db.Where("active = ?", true).Find(&rewards)
			c.JSON(http.StatusOK, rewards)
		})


		student.POST("/redeem", func(c *gin.Context) {
			id := c.GetUint("userID")
			var in struct {
				RewardID uint `json:"reward_id" binding:"required"`
			}
			if err := c.ShouldBindJSON(&in); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var rew model.Reward
			if err := db.First(&rew, in.RewardID).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "reward not found"})
				return
			}

			var studentUser model.User
			if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).First(&studentUser, id).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
				return
			}
			if studentUser.Balance < rew.Cost {
				c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient balance"})
				return
			}

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


	professor := r.Group("/api/professor", middleware.Auth("professor"))
	{
		professor.GET("/profile", controller.ProfessorProfile(profSvc))
		professor.PUT("/profile", controller.UpdateProfessorProfile(profSvc))
		professor.GET("/balance", controller.ProfessorBalance(profSvc))
		professor.GET("/statistics", controller.ProfessorStatistics(profSvc))

		professor.GET("/transactions", func(c *gin.Context) {
			id := c.GetUint("userID")
			var txs []model.Transaction
			db.Where("from_user_id = ? OR to_user_id = ?", id, id).Order("created_at desc").Find(&txs)
			c.JSON(http.StatusOK, txs)
		})

		professor.GET("/students", controller.ProfessorStudents(profSvc))
		professor.GET("/students/search", controller.SearchStudents(studentSvc))
		professor.POST("/transfer", controller.ProfessorTransferCoins(profSvc))
		professor.POST("/give-coins", controller.GiveCoins(db))
	}


	company := r.Group("/api/company", middleware.Auth("company"))
	{
		company.GET("/profile", controller.CompanyProfile(companySvc))
		company.PUT("/profile", controller.UpdateCompanyProfile(companySvc))
		company.POST("/profile/logo", controller.UploadCompanyLogo(db, imgSvc))
		company.GET("/statistics", controller.CompanyStatistics(companySvc))
		company.GET("/validations", controller.CompanyValidations(companySvc))
		company.GET("/rewards", controller.CompanyRewards(rewardSvc))
		company.POST("/rewards", controller.CompanyCreateReward(rewardSvc))
		company.POST("/rewards/:id/image", controller.UploadRewardImage(db, imgSvc))

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
			rew.Category = in.Category
			rew.Active = true
			db.Save(&rew)
			c.JSON(http.StatusOK, rew)
		})

		company.PATCH("/rewards/:id/status", func(c *gin.Context) {
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
			rew.Active = !rew.Active
			db.Save(&rew)
			c.JSON(http.StatusOK, gin.H{"active": rew.Active})
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


	r.GET("/api/images/:type/:id", controller.GetImage(db))


	r.POST("/api/internal/cron/distribute-coins", controller.DistributeCoins(cronSvc))





	cronSvc.StartCronJob()

	r.GET("/", func(c *gin.Context) { c.String(200, "CampusCash Backend is running") })
}

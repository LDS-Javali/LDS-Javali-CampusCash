package controller

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"campuscash-backend/pkg/mail"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CouponResponse struct {
	model.Coupon
	Reward *model.Reward `json:"Reward,omitempty"`
}

func StudentCoupons(svc service.CouponService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		coupons, err := svc.ListStudentCoupons(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "não encontrado"})
			return
		}

		// Buscar detalhes das rewards
		rewardIDs := make(map[uint]bool)
		for _, coupon := range coupons {
			rewardIDs[coupon.RewardID] = true
		}

		rewards := make(map[uint]model.Reward)
		if len(rewardIDs) > 0 {
			var ids []uint
			for id := range rewardIDs {
				ids = append(ids, id)
			}
			var rewardList []model.Reward
			db.Where("id IN ?", ids).Find(&rewardList)
			for _, r := range rewardList {
				rewards[r.ID] = r
			}
		}

		// Montar resposta com dados completos
		response := make([]CouponResponse, len(coupons))
		for i, coupon := range coupons {
			resp := CouponResponse{Coupon: coupon}
			if r, ok := rewards[coupon.RewardID]; ok {
				resp.Reward = &r
			}
			response[i] = resp
		}

		c.JSON(http.StatusOK, response)
	}
}

func StudentRedeem(db *gorm.DB, notificationSvc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
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
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}

		var studentUser model.User
		if err := db.Clauses(clause.Locking{Strength: "UPDATE"}).First(&studentUser, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "aluno não encontrado"})
			return
		}
		if studentUser.Balance < rew.Cost {
			c.JSON(http.StatusBadRequest, gin.H{"error": "saldo insuficiente"})
			return
		}

		code := fmt.Sprintf("CC-%d-%d", time.Now().UnixNano(), id)
		
		// Gerar hash único para o cupom
		hashInput := fmt.Sprintf("%s-%d-%d-%d", code, rew.ID, studentUser.ID, time.Now().UnixNano())
		hashBytes := sha256.Sum256([]byte(hashInput))
		hash := hex.EncodeToString(hashBytes[:])
		
		t := model.Transaction{
			FromUserID: &studentUser.ID,
			ToUserID:   &rew.CompanyID,
			Amount:     rew.Cost,
			Type:       model.RedeemCoins,
			RewardID:   &rew.ID,
			CreatedAt:  time.Now(),
			Code:       &code,
		}
		coupon := model.Coupon{
			RewardID:  rew.ID,
			StudentID: studentUser.ID,
			Code:      code,
			Hash:      hash,
			Redeemed:  false,
			CreatedAt: time.Now(),
		}
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

		// Buscar o cupom criado para retornar completo
		var createdCoupon model.Coupon
		db.Where("code = ?", code).First(&createdCoupon)

		// Criar notificação para o aluno
		go func() {
			_ = notificationSvc.CreateNotification(
				studentUser.ID,
				model.NotificationTypeRedeem,
				"Vantagem Resgatada",
				"Você resgatou a vantagem: "+rew.Title,
			)
		}()

		// Criar notificação para a empresa
		go func() {
			_ = notificationSvc.CreateNotification(
				rew.CompanyID,
				model.NotificationTypeRedeem,
				"Novo Resgate",
				fmt.Sprintf("Aluno %s resgatou a vantagem: %s", studentUser.Name, rew.Title),
			)
		}()

		// Enviar emails
		go func(studentEmail string, companyID uint, code string) {
			var company model.User
			if err := db.First(&company, companyID).Error; err == nil {
				_ = mail.SendMail(studentEmail, "Seu cupom CampusCash", "Código: "+code+" - Vantagem: "+rew.Title)
				_ = mail.SendMail(company.Email, "Novo resgate CampusCash", "Código: "+code+" - Aluno ID: "+strconv.FormatUint(uint64(id), 10))
			}
		}(studentUser.Email, rew.CompanyID, code)

		c.JSON(http.StatusOK, createdCoupon)
	}
}

func CompanyValidateCoupon(svc service.CouponService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Code string `json:"codigo"`
			Hash string `json:"hash"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		var coupon *model.Coupon
		var err error
		
		// Buscar por hash ou código
		if input.Hash != "" {
			coupon, err = svc.ValidateCouponByHash(input.Hash)
		} else if input.Code != "" {
			coupon, err = svc.ValidateCoupon(input.Code)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "código ou hash é obrigatório"})
			return
		}
		
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "cupom não encontrado"})
			return
		}
		
		// Se já foi usado, retornar erro
		if coupon.Redeemed {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cupom já foi utilizado"})
			return
		}
		
		// Marcar como usado
		if input.Hash != "" {
			err = svc.UseCouponByHash(input.Hash)
		} else {
			err = svc.UseCoupon(input.Code)
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		// Buscar dados relacionados para resposta completa
		var reward model.Reward
		var student model.User
		db.First(&reward, coupon.RewardID)
		db.First(&student, coupon.StudentID)
		
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"coupon": CouponResponse{
				Coupon: *coupon,
				Reward: &reward,
			},
			"student": gin.H{
				"id":   student.ID,
				"name": student.Name,
			},
		})
	}
}

// Endpoint para buscar cupom por hash (sem marcar como usado)
func GetCouponByHash(svc service.CouponService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		hash := c.Param("hash")
		if hash == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "hash é obrigatório"})
			return
		}
		
		coupon, err := svc.ValidateCouponByHash(hash)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "cupom não encontrado"})
			return
		}
		
		// Buscar dados relacionados
		var reward model.Reward
		var student model.User
		db.First(&reward, coupon.RewardID)
		db.First(&student, coupon.StudentID)
		
		c.JSON(http.StatusOK, gin.H{
			"coupon": CouponResponse{
				Coupon: *coupon,
				Reward: &reward,
			},
			"student": gin.H{
				"id":   student.ID,
				"name": student.Name,
			},
		})
	}
}

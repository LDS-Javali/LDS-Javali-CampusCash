package controller

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"campuscash-backend/pkg/mail"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CouponResponse struct {
	model.Coupon
	Reward *model.Reward `json:"Reward,omitempty"`
}

func StudentCoupons(svc service.CouponService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		coupons, err := svc.ListStudentCoupons(c.GetUint("userID"))
		if err != nil {
			RespondWithNotFound(c, "não encontrado")
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

		RespondWithSuccess(c, response)
	}
}

func StudentRedeem(redeemSvc service.RedeemService, db *gorm.DB, notificationSvc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		studentID := c.GetUint("userID")
		var in struct {
			RewardID uint `json:"reward_id" binding:"required"`
		}
		if err := c.ShouldBindJSON(&in); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}

		// Processar resgate através do service
		coupon, transaction, err := redeemSvc.RedeemReward(studentID, in.RewardID)
		if err != nil {
			statusCode := MapErrorToStatusCode(err)
			c.JSON(statusCode, gin.H{"error": err.Error()})
			return
		}

		// Buscar dados para notificações e emails (assíncrono)
		var reward model.Reward
		var studentUser model.User
		if err := db.First(&reward, in.RewardID).Error; err == nil {
			if err := db.First(&studentUser, studentID).Error; err == nil {
				// Criar notificação para o aluno
				go func() {
					_ = notificationSvc.CreateNotification(
						studentUser.ID,
						model.NotificationTypeRedeem,
						"Vantagem Resgatada",
						"Você resgatou a vantagem: "+reward.Title,
					)
				}()

				// Criar notificação para a empresa
				go func() {
					_ = notificationSvc.CreateNotification(
						reward.CompanyID,
						model.NotificationTypeRedeem,
						"Novo Resgate",
						fmt.Sprintf("Aluno %s resgatou a vantagem: %s", studentUser.Name, reward.Title),
					)
				}()

				// Enviar emails formatados (dois emails independentes com tratamento de erro)
				// Email 1: Para o Aluno
				go func(studentEmail string, rewardTitle string, code string, companyID uint) {
					var company model.User
					companyName := "Empresa Parceira"
					if err := db.First(&company, companyID).Error; err == nil {
						if company.CompanyName != nil && *company.CompanyName != "" {
							companyName = *company.CompanyName
						} else {
							companyName = company.Name
						}
					}
					subject := fmt.Sprintf("Cupom de Resgate: %s", rewardTitle)
					htmlBody := mail.TemplateEmailRedeemStudent(rewardTitle, code, companyName)
					mail.SendHTMLMailSafe(studentEmail, subject, htmlBody)
				}(studentUser.Email, reward.Title, coupon.Code, reward.CompanyID)

				// Email 2: Para a Empresa
				go func(companyID uint, studentName string, studentID uint, rewardTitle string, code string) {
					var company model.User
					if err := db.First(&company, companyID).Error; err == nil {
						subject := "Nova troca efetuada!"
						htmlBody := mail.TemplateEmailRedeemCompany(studentName, rewardTitle, code, studentID)
						mail.SendHTMLMailSafe(company.Email, subject, htmlBody)
					}
				}(reward.CompanyID, studentUser.Name, studentUser.ID, reward.Title, coupon.Code)
			}
		}

		RespondWithSuccess(c, coupon)
	}
}

func CompanyValidateCoupon(svc service.CouponService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Code string `json:"codigo"`
			Hash string `json:"hash"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
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
			RespondWithBadRequest(c, "código ou hash é obrigatório")
			return
		}
		
		if err != nil {
			RespondWithNotFound(c, "cupom não encontrado")
			return
		}
		
		// Se já foi usado, retornar erro
		if coupon.Redeemed {
			RespondWithBadRequest(c, "cupom já foi utilizado")
			return
		}
		
		// Marcar como usado
		if input.Hash != "" {
			err = svc.UseCouponByHash(input.Hash)
		} else {
			err = svc.UseCoupon(input.Code)
		}
		if err != nil {
			RespondWithError(c, err)
			return
		}
		
		// Buscar dados relacionados para resposta completa
		var reward model.Reward
		var student model.User
		db.First(&reward, coupon.RewardID)
		db.First(&student, coupon.StudentID)
		
		RespondWithSuccess(c, gin.H{
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
			RespondWithBadRequest(c, "hash é obrigatório")
			return
		}
		
		coupon, err := svc.ValidateCouponByHash(hash)
		if err != nil {
			RespondWithNotFound(c, "cupom não encontrado")
			return
		}
		
		// Buscar dados relacionados
		var reward model.Reward
		var student model.User
		db.First(&reward, coupon.RewardID)
		db.First(&student, coupon.StudentID)
		
		RespondWithSuccess(c, gin.H{
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

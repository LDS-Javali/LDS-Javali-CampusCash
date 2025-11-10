package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CompanyProfile(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		profile, err := svc.GetProfile(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "empresa não encontrada"})
			return
		}
		c.JSON(http.StatusOK, profile)
	}
}

func UpdateCompanyProfile(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		var input dto.CompanyUpdateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		company, err := svc.UpdateProfile(id, input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, company)
	}
}

func CompanyStatistics(svc service.CompanyService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		stats, err := svc.GetStatistics(id, db)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "empresa não encontrada"})
			return
		}
		c.JSON(http.StatusOK, stats)
	}
}

func CompanyValidations(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		validations, err := svc.GetValidations(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, validations)
	}
}

func CompanyHistory(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID := c.GetUint("userID")
		var txs []model.Transaction
		db.Where("to_user_id = ? AND type = ?", companyID, model.RedeemCoins).
			Order("created_at desc").
			Find(&txs)

		// Buscar dados relacionados
		type HistoryResponse struct {
			model.Transaction
			FromUserName string `json:"FromUserName,omitempty"`
			FromUserEmail string `json:"FromUserEmail,omitempty"`
			RewardTitle  string `json:"RewardTitle,omitempty"`
		}

		response := make([]HistoryResponse, len(txs))
		for i, tx := range txs {
			resp := HistoryResponse{Transaction: tx}

			// Buscar nome e email do aluno
			if tx.FromUserID != nil {
				var student model.User
				if err := db.First(&student, *tx.FromUserID).Error; err == nil {
					resp.FromUserName = student.Name
					resp.FromUserEmail = student.Email
				}
			}

			// Buscar título da vantagem
			if tx.RewardID != nil {
				var reward model.Reward
				if err := db.First(&reward, *tx.RewardID).Error; err == nil {
					resp.RewardTitle = reward.Title
				}
			}

			response[i] = resp
		}

		c.JSON(http.StatusOK, response)
	}
}

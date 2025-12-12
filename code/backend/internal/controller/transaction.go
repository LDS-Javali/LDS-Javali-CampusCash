package controller

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"campuscash-backend/pkg/mail"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GiveCoinsInput struct {
	ToStudentID uint   `json:"to_student_id" binding:"required"`
	Amount      uint   `json:"amount" binding:"required"`
	Message     string `json:"message" binding:"required"`
}

func GiveCoins(db *gorm.DB, notificationSvc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input GiveCoinsInput
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		professorID := c.GetUint("userID")
		
		// Buscar dados do professor e aluno para o email
		var professor, student model.User
		if err := db.First(&professor, professorID).Error; err != nil {
			RespondWithNotFound(c, "professor não encontrado")
			return
		}
		if err := db.First(&student, input.ToStudentID).Error; err != nil {
			RespondWithNotFound(c, "aluno não encontrado")
			return
		}
		
		// Usar SendCoins do service para evitar duplicação de lógica
		if err := service.SendCoins(db, professorID, input.ToStudentID, input.Amount, input.Message); err != nil {
			statusCode := MapErrorToStatusCode(err)
			c.JSON(statusCode, gin.H{"error": err.Error()})
			return
		}
		
		// Criar notificação para o aluno
		go func() {
			_ = notificationSvc.CreateNotification(
				input.ToStudentID,
				model.NotificationTypeReceiveCoins,
				"Moedas Recebidas",
				fmt.Sprintf("Você recebeu %d moedas: %s", input.Amount, input.Message),
			)
		}()
		
		// Enviar email formatado para o aluno
		go func(profName string, studentEmail string, amount uint, message string) {
			subject := "Você recebeu moedas!"
			htmlBody := mail.TemplateEmailCoinsReceived(profName, amount, message)
			mail.SendHTMLMailSafe(studentEmail, subject, htmlBody)
		}(professor.Name, student.Email, input.Amount, input.Message)
		
		RespondWithSuccess(c, gin.H{"message": "moedas enviadas"})
	}
}

type TransactionResponse struct {
	ID          uint            `json:"ID"`
	FromUserID  *uint           `json:"FromUserID"`
	ToUserID    *uint           `json:"ToUserID"`
	Amount      uint            `json:"Amount"`
	Message     string          `json:"Message"`
	Type        model.TransactionType `json:"Type"`
	RewardID    *uint           `json:"RewardID"`
	CreatedAt   time.Time       `json:"CreatedAt"`
	Code        *string         `json:"Code"`
	FromUserName *string        `json:"FromUserName,omitempty"`
	ToUserName   *string        `json:"ToUserName,omitempty"`
	RewardTitle  *string        `json:"RewardTitle,omitempty"`
}

func StudentTransactions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		
		// Paginação
		limit := 20
		offset := 0
		if limitStr := c.Query("limit"); limitStr != "" {
			if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
				limit = l
			}
		}
		if offsetStr := c.Query("offset"); offsetStr != "" {
			if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
				offset = o
			}
		}

		// Filtros
		query := db.Model(&model.Transaction{}).
			Where("from_user_id = ? OR to_user_id = ?", id, id)

		if typeFilter := c.Query("type"); typeFilter != "" {
			query = query.Where("type = ?", typeFilter)
		}

		if fromDate := c.Query("from_date"); fromDate != "" {
			if t, err := time.Parse("2006-01-02", fromDate); err == nil {
				query = query.Where("created_at >= ?", t)
			}
		}

		if toDate := c.Query("to_date"); toDate != "" {
			if t, err := time.Parse("2006-01-02", toDate); err == nil {
				// Adiciona um dia para incluir o dia inteiro
				t = t.Add(24 * time.Hour)
				query = query.Where("created_at <= ?", t)
			}
		}

		var total int64
		query.Count(&total)

		var txs []model.Transaction
		query.Order("created_at desc").
			Limit(limit).
			Offset(offset).
			Find(&txs)

		// Buscar dados relacionados usando DataEnricher
		enricher := NewDataEnricher(db)
		
		userIDs := ExtractUserIDsFromTransactions(txs)
		users, err := enricher.FetchRelatedUsers(userIDs)
		if err != nil {
			RespondWithInternalError(c, "erro ao buscar usuários relacionados")
			return
		}

		rewardIDs := ExtractRewardIDsFromTransactions(txs)
		rewards, err := enricher.FetchRelatedRewards(rewardIDs)
		if err != nil {
			RespondWithInternalError(c, "erro ao buscar vantagens relacionadas")
			return
		}

		// Montar resposta
		response := make([]TransactionResponse, len(txs))
		for i, tx := range txs {
			resp := TransactionResponse{
				ID:        tx.ID,
				FromUserID: tx.FromUserID,
				ToUserID:   tx.ToUserID,
				Amount:     tx.Amount,
				Message:    tx.Message,
				Type:       tx.Type,
				RewardID:   tx.RewardID,
				CreatedAt:  tx.CreatedAt,
				Code:       tx.Code,
			}
			if tx.FromUserID != nil {
				if u, ok := users[*tx.FromUserID]; ok {
					name := u.Name
					resp.FromUserName = &name
				}
			}
			if tx.ToUserID != nil {
				if u, ok := users[*tx.ToUserID]; ok {
					name := u.Name
					resp.ToUserName = &name
				}
			}
			if tx.RewardID != nil {
				if r, ok := rewards[*tx.RewardID]; ok {
					resp.RewardTitle = &r.Title
				}
			}
			response[i] = resp
		}

		RespondWithSuccess(c, gin.H{
			"transactions": response,
			"total":        total,
			"limit":        limit,
			"offset":       offset,
		})
	}
}

func ProfessorTransactions(db *gorm.DB) gin.HandlerFunc {
	return StudentTransactions(db) // Mesma lógica
}

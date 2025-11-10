package controller

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		professorID := c.GetUint("userID")
		
		// Usar SendCoins do service para evitar duplicação de lógica
		if err := service.SendCoins(db, professorID, input.ToStudentID, input.Amount, input.Message); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		
		c.JSON(http.StatusOK, gin.H{"message": "moedas enviadas"})
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

		// Buscar dados relacionados
		userIDs := make(map[uint]bool)
		rewardIDs := make(map[uint]bool)
		for _, tx := range txs {
			if tx.FromUserID != nil {
				userIDs[*tx.FromUserID] = true
			}
			if tx.ToUserID != nil {
				userIDs[*tx.ToUserID] = true
			}
			if tx.RewardID != nil {
				rewardIDs[*tx.RewardID] = true
			}
		}

		users := make(map[uint]model.User)
		if len(userIDs) > 0 {
			var ids []uint
			for id := range userIDs {
				ids = append(ids, id)
			}
			var userList []model.User
			db.Where("id IN ?", ids).Find(&userList)
			for _, u := range userList {
				users[u.ID] = u
			}
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

		c.JSON(http.StatusOK, gin.H{
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

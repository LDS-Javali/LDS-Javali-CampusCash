package controller

import (
	"campuscash-backend/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GiveCoinsInput struct {
	ToStudentID uint   `json:"to_student_id" binding:"required"`
	Amount      uint   `json:"amount" binding:"required"`
	Message     string `json:"message" binding:"required"`
}

func GiveCoins(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input GiveCoinsInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		professorID := c.GetUint("userID")
		var prof model.User
		if err := db.First(&prof, professorID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "professor not found"})
			return
		}
		if prof.Balance < input.Amount {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not enough coins"})
			return
		}
		var student model.User
		if err := db.First(&student, input.ToStudentID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		prof.Balance -= input.Amount
		student.Balance += input.Amount
		db.Save(&prof)
		db.Save(&student)
		tx := model.Transaction{
			FromUserID: &prof.ID,
			ToUserID:   &student.ID,
			Amount:     input.Amount,
			Message:    input.Message,
			Type:       model.GiveCoins,
		}
		db.Create(&tx)
		c.JSON(http.StatusOK, gin.H{"message": "coins sent"})
	}
}

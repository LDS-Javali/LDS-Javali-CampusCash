package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProfessorProfile(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		prof, err := svc.GetProfile(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "professor not found"})
			return
		}
		c.JSON(http.StatusOK, prof)
	}
}

func ProfessorBalance(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		balance, err := svc.GetBalance(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"saldoMoedas": balance})
	}
}

func ProfessorTransferCoins(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input dto.ProfessorTransferDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := svc.TransferCoins(c.GetUint("userID"), input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

func ProfessorStudents(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		students, err := svc.ListStudents(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "none found"})
			return
		}
		c.JSON(http.StatusOK, students)
	}
}

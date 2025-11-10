package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProfessorProfile(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		prof, err := svc.GetProfile(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "professor não encontrado"})
			return
		}
		c.JSON(http.StatusOK, prof)
	}
}

func ProfessorBalance(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		balance, err := svc.GetBalance(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "não encontrado"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"saldoMoedas": balance})
	}
}

func ProfessorStudents(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		students, err := svc.ListStudents(c.GetUint("userID"))
		if err != nil {
			// Se der erro, retornar array vazio em vez de 500
			c.JSON(http.StatusOK, []model.User{})
			return
		}
		if students == nil {
			students = []model.User{}
		}
		c.JSON(http.StatusOK, students)
	}
}

func UpdateProfessorProfile(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		var input dto.ProfessorUpdateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		professor, err := svc.UpdateProfile(id, input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, professor)
	}
}

func ProfessorStatistics(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		stats, err := svc.GetStatistics(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "professor não encontrado"})
			return
		}
		c.JSON(http.StatusOK, stats)
	}
}

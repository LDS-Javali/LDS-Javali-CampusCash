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
			RespondWithNotFound(c, "professor não encontrado")
			return
		}
		RespondWithSuccess(c, prof)
	}
}

func ProfessorBalance(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		balance, err := svc.GetBalance(c.GetUint("userID"))
		if err != nil {
			RespondWithNotFound(c, "não encontrado")
			return
		}
		RespondWithSuccess(c, gin.H{"saldoMoedas": balance})
	}
}

func ProfessorStudents(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		students, err := svc.ListStudents(c.GetUint("userID"))
		if err != nil {
			// Se der erro, retornar array vazio em vez de 500
			RespondWithSuccess(c, []model.User{})
			return
		}
		if students == nil {
			students = []model.User{}
		}
		RespondWithSuccess(c, students)
	}
}

func UpdateProfessorProfile(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		var input dto.ProfessorUpdateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		professor, err := svc.UpdateProfile(id, input)
		if err != nil {
			RespondWithError(c, err)
			return
		}
		RespondWithSuccess(c, professor)
	}
}

func ProfessorStatistics(svc service.ProfessorService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		stats, err := svc.GetStatistics(id)
		if err != nil {
			RespondWithNotFound(c, "professor não encontrado")
			return
		}
		RespondWithSuccess(c, stats)
	}
}

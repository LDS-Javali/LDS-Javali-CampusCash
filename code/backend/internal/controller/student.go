package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterStudent(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input dto.StudentRegisterDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		student, err := svc.RegisterStudent(input)
		if err != nil {
			RespondWithError(c, err)
			return
		}
		RespondWithSuccess(c, gin.H{"id": student.ID})
	}
}

func StudentProfile(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		prof, err := svc.GetProfile(id)
		if err != nil {
			RespondWithNotFound(c, "aluno não encontrado")
			return
		}
		RespondWithSuccess(c, prof)
	}
}

func StudentBalance(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		balance, err := svc.GetBalance(id)
		if err != nil {
			RespondWithNotFound(c, "aluno não encontrado")
			return
		}
		RespondWithSuccess(c, balance)
	}
}

func UpdateStudentProfile(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		var input dto.StudentUpdateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		student, err := svc.UpdateProfile(id, input)
		if err != nil {
			RespondWithError(c, err)
			return
		}
		RespondWithSuccess(c, student)
	}
}

func StudentStatistics(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		stats, err := svc.GetStatistics(id)
		if err != nil {
			RespondWithNotFound(c, "aluno não encontrado")
			return
		}
		RespondWithSuccess(c, stats)
	}
}

func SearchStudents(svc service.StudentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			RespondWithBadRequest(c, "parâmetro de consulta 'q' é obrigatório")
			return
		}
		students, err := svc.SearchStudents(query)
		if err != nil {
			RespondWithError(c, err)
			return
		}
		RespondWithSuccess(c, students)
	}
}

func ListInstitutions(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var insts []model.Institution
		db.Find(&insts)
		RespondWithSuccess(c, insts)
	}
}

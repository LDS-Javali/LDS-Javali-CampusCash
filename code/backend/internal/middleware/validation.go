package middleware

import (
	"campuscash-backend/pkg/validator"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidateStudentRegistration() gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Name         string `json:"name" binding:"required"`
			Email        string `json:"email" binding:"required,email"`
			Password     string `json:"password" binding:"required"`
			CPF          string `json:"cpf" binding:"required"`
			Registration string `json:"registration" binding:"required"`
			Institution  string `json:"institution" binding:"required"`
			Course       string `json:"course" binding:"required"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}


		if !validator.ValidateCPF(input.CPF) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CPF"})
			c.Abort()
			return
		}


		if !validator.ValidateEmail(input.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
			c.Abort()
			return
		}


		if err := validator.ValidatePassword(input.Password); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Next()
	}
}

func ValidateCompanyRegistration() gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Name        string `json:"name" binding:"required"`
			Email       string `json:"email" binding:"required,email"`
			Password    string `json:"password" binding:"required"`
			CNPJ        string `json:"cnpj" binding:"required"`
			Description string `json:"description" binding:"required"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}


		if !validator.ValidateCNPJ(input.CNPJ) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CNPJ"})
			c.Abort()
			return
		}


		if !validator.ValidateEmail(input.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
			c.Abort()
			return
		}


		if err := validator.ValidatePassword(input.Password); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Next()
	}
}


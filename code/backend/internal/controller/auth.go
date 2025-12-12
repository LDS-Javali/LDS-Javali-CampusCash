package controller

import (
	"campuscash-backend/config"
	"campuscash-backend/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type SignupStudentInput struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required"`
	CPF         string `json:"cpf" binding:"required"`
	Registration string `json:"registration" binding:"required"`
	Institution string `json:"institution" binding:"required"`
	Course      string `json:"course" binding:"required"`
	Password    string `json:"password" binding:"required"`
}

func SignupAluno(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input SignupStudentInput
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		student := model.User{
			Name:         input.Name,
			Email:        input.Email,
			PasswordHash: string(hash),
			CPF:          &input.CPF,
			Registration: &input.Registration,
			Institution:  &input.Institution,
			Course:       &input.Course,
			Role:         model.StudentRole,
			Balance:      0,
		}
		if err := db.Create(&student).Error; err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		// Remove password hash antes de retornar
		student.PasswordHash = ""
		RespondWithCreated(c, student)
	}
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input LoginInput
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		var user model.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			RespondWithUnauthorized(c, "credenciais inválidas")
			return
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
			RespondWithUnauthorized(c, "credenciais inválidas")
			return
		}
		claims := jwt.MapClaims{
			"id":   user.ID,
			"role": user.Role,
			"exp":  time.Now().Add(time.Hour * 24 * 7).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, _ := token.SignedString(config.JWTSecret)
		user.PasswordHash = ""
		RespondWithSuccess(c, gin.H{
			"token": tokenString,
			"user": gin.H{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"role":  user.Role,
			},
		})
	}
}

func GetMe(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			RespondWithNotFound(c, "usuário não encontrado")
			return
		}

		user.PasswordHash = ""

		RespondWithSuccess(c, user)
	}
}

type SignupCompanyInput struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required"`
	CNPJ        string `json:"cnpj" binding:"required"`
	Description string `json:"description"`
}

func SignupCompany(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input SignupCompanyInput
		if err := c.ShouldBindJSON(&input); err != nil {
			RespondWithBadRequest(c, err.Error())
			return
		}
		pwHash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		user := model.User{
			Name:         input.Name,
			Email:        input.Email,
			PasswordHash: string(pwHash),
			Role:         model.CompanyRole,
			CompanyName:  &input.Name,
			CPF:          &input.CNPJ,
			Balance:      0,
		}
		if err := db.Create(&user).Error; err != nil {
			RespondWithError(c, err)
			return
		}
		// Remove password hash antes de retornar
		user.PasswordHash = ""
		RespondWithCreated(c, user)
	}
}

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
	RG          string `json:"rg" binding:"required"`
	Address     string `json:"address" binding:"required"`
	Institution string `json:"institution" binding:"required"`
	Course      string `json:"course" binding:"required"`
	Password    string `json:"password" binding:"required"`
}

func SignupAluno(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input SignupStudentInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		student := model.User{
			Name:         input.Name,
			Email:        input.Email,
			PasswordHash: string(hash),
			CPF:          &input.CPF,
			RG:           &input.RG,
			Address:      input.Address,
			Institution:  &input.Institution,
			Course:       &input.Course,
			Role:         model.StudentRole,
			Balance:      0,
		}
		if err := db.Create(&student).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Student registered successfully"})
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var user model.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		claims := jwt.MapClaims{
			"id":   user.ID,
			"role": user.Role,
			"exp":  time.Now().Add(time.Hour * 24 * 7).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, _ := token.SignedString(config.JWTSecret)
		c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": user.Role})
	}
}

func GetMe(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		

		user.PasswordHash = ""
		
		c.JSON(http.StatusOK, user)
	}
}

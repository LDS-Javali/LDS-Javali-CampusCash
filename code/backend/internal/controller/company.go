package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CompanyProfile(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		profile, err := svc.GetProfile(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "company not found"})
			return
		}
		c.JSON(http.StatusOK, profile)
	}
}

func UpdateCompanyProfile(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		var input dto.CompanyUpdateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		company, err := svc.UpdateProfile(id, input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, company)
	}
}

func CompanyStatistics(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		stats, err := svc.GetStatistics(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "company not found"})
			return
		}
		c.JSON(http.StatusOK, stats)
	}
}

func CompanyValidations(svc service.CompanyService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetUint("userID")
		validations, err := svc.GetValidations(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, validations)
	}
}

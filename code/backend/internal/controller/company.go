package controller

import (
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

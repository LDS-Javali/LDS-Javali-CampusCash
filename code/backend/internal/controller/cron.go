package controller

import (
	"campuscash-backend/config"
	"campuscash-backend/internal/service"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func DistributeCoins(cronSvc *service.CronService) gin.HandlerFunc {
	return func(c *gin.Context) {

		secret := c.GetHeader("X-Cron-Secret")
		if secret != config.CronSecret {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		if err := cronSvc.ManualDistribution(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to distribute coins"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Coins distributed successfully",
			"time":    time.Now().Format(time.RFC3339),
		})
	}
}

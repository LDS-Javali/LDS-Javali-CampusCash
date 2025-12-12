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
			RespondWithUnauthorized(c, "Unauthorized")
			return
		}

		if err := cronSvc.ManualDistribution(); err != nil {
			RespondWithInternalError(c, "Failed to distribute coins")
			return
		}

		RespondWithSuccess(c, gin.H{
			"message": "Coins distributed successfully",
			"time":    time.Now().Format(time.RFC3339),
		})
	}
}

package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CompanyCreateReward(svc service.RewardService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input dto.RewardCreateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		input.CompanyID = c.GetUint("userID")
		reward, err := svc.CreateReward(input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, reward)
	}
}

func CompanyRewards(svc service.RewardService) gin.HandlerFunc {
	return func(c *gin.Context) {
		rewards, err := svc.ListCompanyRewards(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, rewards)
	}
}

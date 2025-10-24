package controller

import (
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func StudentCoupons(svc service.CouponService) gin.HandlerFunc {
	return func(c *gin.Context) {
		coupons, err := svc.ListStudentCoupons(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, coupons)
	}
}

func CompanyValidateCoupon(svc service.CouponService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Code string `json:"codigo"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := svc.UseCoupon(input.Code)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

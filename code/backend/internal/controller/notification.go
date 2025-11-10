package controller

import (
	"campuscash-backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListNotifications(svc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		notifications, err := svc.ListUserNotifications(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, notifications)
	}
}

func MarkNotificationAsRead(svc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification id"})
			return
		}
		if err := svc.MarkAsRead(uint(id), userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

func CountUnreadNotifications(svc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		count, err := svc.CountUnread(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"count": count})
	}
}

func MarkAllNotificationsAsRead(svc *service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		if err := svc.MarkAllAsRead(userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}


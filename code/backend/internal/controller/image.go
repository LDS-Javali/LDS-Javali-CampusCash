package controller

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UploadStudentAvatar(db *gorm.DB, imgSvc *service.ImageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		

		imgData, err := imgSvc.ProcessImage(c, "avatar")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to process image: " + err.Error()})
			return
		}


		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		user.AvatarData = imgData
		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save avatar"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Avatar uploaded successfully",
			"size":    len(imgData),
		})
	}
}

func UploadCompanyLogo(db *gorm.DB, imgSvc *service.ImageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		

		imgData, err := imgSvc.ProcessImage(c, "logo")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to process image: " + err.Error()})
			return
		}


		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		user.AvatarData = imgData // Using AvatarData field for company logo too
		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save logo"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Logo uploaded successfully",
			"size":    len(imgData),
		})
	}
}

func UploadRewardImage(db *gorm.DB, imgSvc *service.ImageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID := c.GetUint("userID")
		rewardID := c.Param("id")
		

		imgData, err := imgSvc.ProcessImage(c, "image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to process image: " + err.Error()})
			return
		}


		var reward model.Reward
		if err := db.First(&reward, rewardID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
			return
		}


		if reward.CompanyID != companyID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this reward"})
			return
		}

		reward.ImageData = imgData
		if err := db.Save(&reward).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Image uploaded successfully",
			"size":    len(imgData),
		})
	}
}

func GetImage(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		imageType := c.Param("type") // "avatar" or "reward"
		imageID := c.Param("id")
		
		var imgData []byte
		var contentType string
		
		switch imageType {
		case "avatar":
			var user model.User
			if err := db.First(&user, imageID).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
				return
			}
			imgData = user.AvatarData
			contentType = "image/jpeg" // Default
			
		case "reward":
			var reward model.Reward
			if err := db.First(&reward, imageID).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
				return
			}
			imgData = reward.ImageData
			contentType = "image/jpeg" // Default
			
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image type"})
			return
		}

		if len(imgData) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "No image found"})
			return
		}


		c.Header("Content-Type", contentType)
		c.Header("Cache-Control", "public, max-age=3600")
		c.Data(http.StatusOK, contentType, imgData)
	}
}


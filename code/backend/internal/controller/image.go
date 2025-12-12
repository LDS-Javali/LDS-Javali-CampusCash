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
			RespondWithBadRequest(c, "Failed to process image: "+err.Error())
			return
		}


		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			RespondWithNotFound(c, "User not found")
			return
		}

		user.AvatarData = imgData
		if err := db.Save(&user).Error; err != nil {
			RespondWithInternalError(c, "Failed to save avatar")
			return
		}

		RespondWithSuccess(c, gin.H{
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
			RespondWithBadRequest(c, "Failed to process image: "+err.Error())
			return
		}


		var user model.User
		if err := db.First(&user, userID).Error; err != nil {
			RespondWithNotFound(c, "User not found")
			return
		}

		user.AvatarData = imgData // Using AvatarData field for company logo too
		if err := db.Save(&user).Error; err != nil {
			RespondWithInternalError(c, "Failed to save logo")
			return
		}

		RespondWithSuccess(c, gin.H{
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
			RespondWithBadRequest(c, "Failed to process image: "+err.Error())
			return
		}


		var reward model.Reward
		if err := db.First(&reward, rewardID).Error; err != nil {
			RespondWithNotFound(c, "Reward not found")
			return
		}


		if reward.CompanyID != companyID {
			RespondWithForbidden(c, "Not authorized to update this reward")
			return
		}

		// Atualizar apenas o campo ImageData
		if err := db.Model(&reward).Update("ImageData", imgData).Error; err != nil {
			RespondWithInternalError(c, "Failed to save image: "+err.Error())
			return
		}

		RespondWithSuccess(c, gin.H{
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
				RespondWithNotFound(c, "User not found")
				return
			}
			imgData = user.AvatarData
			contentType = "image/jpeg" // Default
			
		case "reward":
			var reward model.Reward
			if err := db.First(&reward, imageID).Error; err != nil {
				RespondWithNotFound(c, "Reward not found")
				return
			}
			imgData = reward.ImageData
			// Detectar contentType baseado nos bytes da imagem
			imgSvc := service.NewImageService()
			contentType = imgSvc.GetImageContentType(imgData)
			
		default:
			RespondWithBadRequest(c, "Invalid image type")
			return
		}

		if len(imgData) == 0 {
			RespondWithNotFound(c, "No image found")
			return
		}


		c.Header("Content-Type", contentType)
		c.Header("Cache-Control", "public, max-age=3600")
		c.Data(http.StatusOK, contentType, imgData)
	}
}


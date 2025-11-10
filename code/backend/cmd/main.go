package main

import (
	"campuscash-backend/config"
	"campuscash-backend/internal/middleware"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"campuscash-backend/internal/route"
	"campuscash-backend/internal/service"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	config.LoadConfig()

	gin.SetMode(config.GinMode)

	db, err := gorm.Open(sqlite.Open(config.DBPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := db.AutoMigrate(&model.User{}, &model.Reward{}, &model.Transaction{}, &model.Institution{}, &model.Coupon{}, &model.Notification{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	service.SeedAll(db)

	// Inicializar serviços
	notificationRepo := repository.NewNotificationRepository(db)
	notificationSvc := service.NewNotificationService(notificationRepo)
	cronSvc := service.NewCronService(db, notificationSvc)
	
	// Iniciar cronjob para distribuir moedas aos professores
	cronSvc.StartCronJob()

	r := gin.Default()
	r.Use(middleware.Cors())
	route.RegisterRoutes(r, db)

	log.Printf("Starting server on port %s", config.Port)
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

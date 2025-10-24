package main

import (
	"campuscash-backend/internal/middleware"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/route"
	"campuscash-backend/internal/service"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "file:campuscash.db?cache=shared"
	}
	db, _ := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	_ = db.AutoMigrate(&model.User{}, &model.Reward{}, &model.Transaction{}, &model.Institution{}, &model.Coupon{})

	service.SeedInstituicoes(db)
	service.SeedProfessores(db)

	r := gin.Default()
	r.Use(middleware.Cors())
	route.RegisterRoutes(r, db)
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}

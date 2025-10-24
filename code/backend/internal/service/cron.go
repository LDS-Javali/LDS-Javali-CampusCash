package service

import (
	"campuscash-backend/internal/model"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type CronService struct {
	db *gorm.DB
}

func NewCronService(db *gorm.DB) *CronService {
	return &CronService{db: db}
}

func (s *CronService) StartCronJob() {
	ticker := time.NewTicker(60 * time.Second)
	go func() {
		for range ticker.C {
			s.distributeCoinsToProfessors()
		}
	}()
	log.Println("Cron job started - distributing coins every 60 seconds")
}

func (s *CronService) distributeCoinsToProfessors() {
	var professors []model.User
	if err := s.db.Where("role = ?", model.ProfessorRole).Find(&professors).Error; err != nil {
		log.Printf("Error fetching professors: %v", err)
		return
	}

	coinsToAdd := uint(100) // 100 coins every 60 seconds for demo
	distributedCount := 0

	for _, professor := range professors {

		professor.Balance += coinsToAdd
		if err := s.db.Save(&professor).Error; err != nil {
			log.Printf("Error updating professor %d balance: %v", professor.ID, err)
			continue
		}


		transaction := model.Transaction{
			FromUserID: nil, // System generated
			ToUserID:   &professor.ID,
			Amount:     coinsToAdd,
			Message:    fmt.Sprintf("Distribuição automática de moedas - %s", time.Now().Format("2006-01-02 15:04:05")),
			Type:       model.GiveCoins,
			CreatedAt:  time.Now(),
		}

		if err := s.db.Create(&transaction).Error; err != nil {
			log.Printf("Error creating transaction for professor %d: %v", professor.ID, err)
		}

		distributedCount++
	}

	log.Printf("Distributed %d coins to %d professors", coinsToAdd, distributedCount)
}

func (s *CronService) ManualDistribution() error {
	s.distributeCoinsToProfessors()
	return nil
}


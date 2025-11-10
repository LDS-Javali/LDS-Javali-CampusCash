package service

import (
	"campuscash-backend/config"
	"campuscash-backend/internal/model"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type CronService struct {
	db              *gorm.DB
	notificationSvc *NotificationService
}

func NewCronService(db *gorm.DB, notificationSvc *NotificationService) *CronService {
	return &CronService{db: db, notificationSvc: notificationSvc}
}

func (s *CronService) StartCronJob() {
	interval := time.Duration(config.CronIntervalSeconds) * time.Second
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			s.distributeCoinsToProfessors()
		}
	}()
	log.Printf("Cron job started - distributing %d coins every %d seconds", config.CronCoinsAmount, config.CronIntervalSeconds)
}

func (s *CronService) distributeCoinsToProfessors() {
	var professors []model.User
	if err := s.db.Where("role = ?", model.ProfessorRole).Find(&professors).Error; err != nil {
		log.Printf("Error fetching professors: %v", err)
		return
	}

	coinsToAdd := config.CronCoinsAmount
	distributedCount := 0

	for _, professor := range professors {
		newBalance := professor.Balance + coinsToAdd
		if err := s.db.Model(&professor).Update("balance", newBalance).Error; err != nil {
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
			continue
		}

		// Criar notificação para o professor
		if s.notificationSvc != nil {
			if err := s.notificationSvc.CreateNotification(
				professor.ID,
					model.NotificationTypeReceiveCoins,
					"Moedas Recebidas",
				fmt.Sprintf("Você recebeu %d moedas do sistema automaticamente", coinsToAdd),
			); err != nil {
				log.Printf("Error creating notification for professor %d: %v", professor.ID, err)
			} else {
				log.Printf("Notification sent to professor %d", professor.ID)
			}
		}

		distributedCount++
	}

	log.Printf("Distributed %d coins to %d professors", coinsToAdd, distributedCount)
}

func (s *CronService) ManualDistribution() error {
	s.distributeCoinsToProfessors()
	return nil
}


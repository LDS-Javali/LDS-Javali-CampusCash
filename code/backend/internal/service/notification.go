package service

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"time"
)

type NotificationService struct {
	repo *repository.NotificationRepository
}

func NewNotificationService(repo *repository.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) CreateNotification(userID uint, notificationType model.NotificationType, title, message string) error {
	notification := &model.Notification{
		UserID:    userID,
		Type:      notificationType,
		Title:     title,
		Message:   message,
		Read:      false,
		CreatedAt: time.Now(),
	}
	return s.repo.Create(notification)
}

func (s *NotificationService) ListUserNotifications(userID uint) ([]model.Notification, error) {
	return s.repo.ListByUserID(userID)
}

func (s *NotificationService) MarkAsRead(notificationID, userID uint) error {
	return s.repo.MarkAsRead(notificationID, userID)
}

func (s *NotificationService) CountUnread(userID uint) (int64, error) {
	return s.repo.CountUnread(userID)
}

func (s *NotificationService) MarkAllAsRead(userID uint) error {
	return s.repo.MarkAllAsRead(userID)
}


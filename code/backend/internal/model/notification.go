package model

import "time"

type NotificationType string

const (
	NotificationTypeRedeem      NotificationType = "redeem"
	NotificationTypeReceiveCoins NotificationType = "receive_coins"
	NotificationTypeDistribute   NotificationType = "distribute"
)

type Notification struct {
	ID        uint            `gorm:"primaryKey"`
	UserID    uint
	Type      NotificationType
	Title     string
	Message   string
	Read      bool
	CreatedAt time.Time
	ReadAt    *time.Time
}


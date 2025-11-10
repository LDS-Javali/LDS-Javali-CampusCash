package model

import "time"

type Coupon struct {
    ID          uint      `gorm:"primaryKey"`
    RewardID    uint
    StudentID   uint
    Code        string    `gorm:"unique"`
    Hash        string    `gorm:"unique"`
    Redeemed    bool
    UsedAt      *time.Time
    CreatedAt   time.Time
    ExpiresAt   *time.Time
}
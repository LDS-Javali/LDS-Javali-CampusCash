package model

import "time"

type TransactionType string

const (
    GiveCoins   TransactionType = "give"
    RedeemCoins TransactionType = "redeem"
)

type Transaction struct {
    ID          uint            `gorm:"primaryKey"`
    FromUserID  *uint
    ToUserID    *uint
    Amount      uint
    Message     string
    Type        TransactionType
    RewardID    *uint
    CreatedAt   time.Time
    Code        *string
}
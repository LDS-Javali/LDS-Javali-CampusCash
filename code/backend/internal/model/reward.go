package model

import "time"

type Reward struct {
    ID          uint      `gorm:"primaryKey"`
    CompanyID   uint
    Title       string
    Description string
    Cost        uint
    ImageData   []byte    `gorm:"type:blob"`
    Active      bool
    Category    string
    CreatedAt   time.Time
    UpdatedAt   time.Time
}
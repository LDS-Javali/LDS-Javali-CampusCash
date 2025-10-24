package model

type Institution struct {
    ID    uint   `gorm:"primaryKey"`
    Name  string `gorm:"unique"`
}
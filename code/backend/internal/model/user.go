package model

import (
	"time"
)

type UserRole string

const (
    StudentRole   UserRole = "student"
    ProfessorRole UserRole = "professor"
    CompanyRole   UserRole = "company"
)

type User struct {
    ID           uint      `gorm:"primaryKey"`
    Name         string
    Email        string    `gorm:"unique"`
    PasswordHash string
    CPF          *string   `gorm:"unique"`
    Role         UserRole
    RG           *string
    Address      string
    Registration *string
    Institution  *string
    Course       *string
    Department   *string
    CompanyName  *string
    Balance      uint
    AvatarData   []byte    `gorm:"type:blob"`
    CreatedAt    time.Time
    UpdatedAt    time.Time
}

package service

import (
    "campuscash-backend/internal/model"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

func SeedInstituicoes(db *gorm.DB) {
    db.FirstOrCreate(&model.Institution{Name: "PUC Minas"})
    db.FirstOrCreate(&model.Institution{Name: "UFMG"})
}

func SeedProfessores(db *gorm.DB) {
    hash, _ := bcrypt.GenerateFromPassword([]byte("professor123"), bcrypt.DefaultCost)
    db.FirstOrCreate(&model.User{
        Name:       "Demo Professor",
        Email:      "prof@demo.com",
        Role:       model.ProfessorRole,
        PasswordHash: string(hash),
        Balance:    1000,
    })
}
package service

import (
	"campuscash-backend/internal/model"
	"fmt"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func SendCoins(db *gorm.DB, professorID, studentID uint, amount uint, message string) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var prof, stud model.User
		if err := tx.First(&prof, professorID).Error; err != nil {
			return err
		}
		if prof.Balance < amount {
			return fmt.Errorf("not enough balance")
		}
		if err := tx.First(&stud, studentID).Error; err != nil {
			return err
		}
		prof.Balance -= amount
		stud.Balance += amount
		if err := tx.Save(&prof).Error; err != nil {
			return err
		}
		if err := tx.Save(&stud).Error; err != nil {
			return err
		}
		tr := model.Transaction{
			FromUserID: &prof.ID,
			ToUserID:   &stud.ID,
			Amount:     amount,
			Message:    message,
			Type:       model.GiveCoins,
		}
		if err := tx.Create(&tr).Error; err != nil {
			return err
		}
		// You can call mail.SendMail here
		return nil
	})
}

// CreditProfessors adds the given amount to all professors' balances and records a system transaction
func CreditProfessors(db *gorm.DB, amount uint) error {
	var profs []model.User
	if err := db.Where("role = ?", model.ProfessorRole).Find(&profs).Error; err != nil {
		return err
	}
	for _, p := range profs {
		err := db.Transaction(func(tx *gorm.DB) error {
			var prof model.User
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&prof, p.ID).Error; err != nil {
				return err
			}
			prof.Balance += amount
			if err := tx.Save(&prof).Error; err != nil {
				return err
			}
			tr := model.Transaction{
				FromUserID: nil,
				ToUserID:   &prof.ID,
				Amount:     amount,
				Message:    "Crédito semestral",
				Type:       model.GiveCoins,
			}
			if err := tx.Create(&tr).Error; err != nil {
				return err
			}
			return nil
		})
		if err != nil {
			return err
		}
	}
	return nil
}

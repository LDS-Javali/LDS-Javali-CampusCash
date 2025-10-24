package repository

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

type CompanyRepository interface {
	FindByID(id uint) (*model.User, error)
	Save(company *model.User) error
}

type companyRepository struct {
	db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) CompanyRepository {
	return &companyRepository{db}
}

func (r *companyRepository) FindByID(id uint) (*model.User, error) {
	var comp model.User
	if err := r.db.Where("id = ? AND role = ?", id, model.CompanyRole).First(&comp).Error; err != nil {
		return nil, err
	}
	return &comp, nil
}

func (r *companyRepository) Save(company *model.User) error {
	return r.db.Save(company).Error
}

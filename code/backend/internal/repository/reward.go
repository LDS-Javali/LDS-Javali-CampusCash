package repository

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

type RewardRepository interface {
	Create(reward *model.Reward) error
	ListByCompany(companyID uint) ([]model.Reward, error)
	FindByID(id uint) (*model.Reward, error)
}

type rewardRepository struct {
	db *gorm.DB
}

func NewRewardRepository(db *gorm.DB) RewardRepository {
	return &rewardRepository{db}
}

func (r *rewardRepository) Create(reward *model.Reward) error {
	return r.db.Create(reward).Error
}
func (r *rewardRepository) ListByCompany(companyID uint) ([]model.Reward, error) {
	var rewards []model.Reward
	err := r.db.Where("company_id = ?", companyID).Find(&rewards).Error
	return rewards, err
}
func (r *rewardRepository) FindByID(id uint) (*model.Reward, error) {
	var reward model.Reward
	err := r.db.First(&reward, id).Error
	return &reward, err
}

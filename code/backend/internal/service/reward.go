package service

import (
    "campuscash-backend/internal/dto"
    "campuscash-backend/internal/model"
    "campuscash-backend/internal/repository"
)

type RewardService interface {
    CreateReward(input dto.RewardCreateDTO) (*model.Reward, error)
    ListCompanyRewards(companyID uint) ([]model.Reward, error)
}

type rewardService struct {
    repo repository.RewardRepository
}

func NewRewardService(repo repository.RewardRepository) RewardService {
    return &rewardService{repo}
}

func (s *rewardService) CreateReward(input dto.RewardCreateDTO) (*model.Reward, error) {
    reward := &model.Reward{
        Title:       input.Title,
        Description: input.Description,
        Cost:        input.Cost,
        ImageURL:    input.ImageURL,
        Category:    input.Category,
        CompanyID:   input.CompanyID,
        Active:      true,
    }
    err := s.repo.Create(reward)
    return reward, err
}

func (s *rewardService) ListCompanyRewards(companyID uint) ([]model.Reward, error) {
    return s.repo.ListByCompany(companyID)
}
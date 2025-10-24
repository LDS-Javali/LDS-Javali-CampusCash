package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/repository"
)

type CompanyService interface {
	GetProfile(id uint) (*dto.CompanyProfileDTO, error)
}

type companyService struct {
	repo repository.CompanyRepository
}

func NewCompanyService(repo repository.CompanyRepository) CompanyService {
	return &companyService{repo}
}

func (s *companyService) GetProfile(id uint) (*dto.CompanyProfileDTO, error) {
	comp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.CompanyProfileDTO{
		ID:       comp.ID,
		Name:     *comp.CompanyName,
		Email:    comp.Email,
		Category: "TODO", // set actual if present
		Phone:    "TODO", // set actual if present
		Address:  comp.Address,
		CNPJ:     *comp.CPF,
	}, nil
}

package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/repository"
)

type CompanyService interface {
	GetProfile(id uint) (*dto.CompanyProfileDTO, error)
	UpdateProfile(id uint, input dto.CompanyUpdateDTO) (*dto.CompanyProfileDTO, error)
	GetStatistics(id uint) (*dto.CompanyStatisticsDTO, error)
	GetValidations(id uint) ([]dto.CompanyValidationDTO, error)
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

func (s *companyService) UpdateProfile(id uint, input dto.CompanyUpdateDTO) (*dto.CompanyProfileDTO, error) {
	company, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	

	if input.Name != "" {
		company.CompanyName = &input.Name
	}
	if input.Email != "" {
		company.Email = input.Email
	}
	if input.CNPJ != "" {
		company.CPF = &input.CNPJ
	}
	if input.Address != "" {
		company.Address = input.Address
	}
	
	if err := s.repo.Update(company); err != nil {
		return nil, err
	}
	
	return &dto.CompanyProfileDTO{
		ID:       company.ID,
		Name:     *company.CompanyName,
		Email:    company.Email,
		Category: "TODO", // set actual if present
		Phone:    "TODO", // set actual if present
		Address:  company.Address,
		CNPJ:     *company.CPF,
	}, nil
}

func (s *companyService) GetStatistics(id uint) (*dto.CompanyStatisticsDTO, error) {


	return &dto.CompanyStatisticsDTO{
		VantagensAtivas:   12,
		ResgatesMes:       47,
		ReceitaMoedas:     8500,
		AlunosUnicos:      156,
		TotalVantagens:    25,
		ResgatesPendentes: 3,
	}, nil
}

func (s *companyService) GetValidations(id uint) ([]dto.CompanyValidationDTO, error) {


	return []dto.CompanyValidationDTO{
		{
			ID:       1,
			Codigo:   "CC-2024-001",
			Aluno:    "João Silva Santos",
			Vantagem: "Desconto 30% Livraria Central",
			Data:     "2024-01-15T10:30:00",
			Status:   "validado",
			Valor:    200,
		},
		{
			ID:       2,
			Codigo:   "CC-2024-002",
			Aluno:    "Maria Santos Costa",
			Vantagem: "Almoço Grátis Restaurante",
			Data:     "2024-01-14T14:20:00",
			Status:   "pendente",
			Valor:    150,
		},
	}, nil
}

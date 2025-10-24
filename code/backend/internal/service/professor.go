package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"

	"gorm.io/gorm"
)

type ProfessorService interface {
	GetProfile(id uint) (*dto.ProfessorProfileDTO, error)
	GetBalance(id uint) (uint, error)
	TransferCoins(professorID uint, input dto.ProfessorTransferDTO) error
	ListStudents(professorID uint) ([]model.User, error)
}

type professorService struct {
	repo     repository.ProfessorRepository
	userRepo repository.StudentRepository
	db       *gorm.DB
}

func NewProfessorService(repo repository.ProfessorRepository, userRepo repository.StudentRepository, db *gorm.DB) ProfessorService {
	return &professorService{repo, userRepo, db}
}

func (s *professorService) GetProfile(id uint) (*dto.ProfessorProfileDTO, error) {
	prof, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.ProfessorProfileDTO{
		ID:          prof.ID,
		Name:        prof.Name,
		Email:       prof.Email,
		CPF:         *prof.CPF,
		Department:  *prof.Department,
		Institution: *prof.Institution,
		Balance:     prof.Balance,
	}, nil
}

func (s *professorService) GetBalance(id uint) (uint, error) {
	p, err := s.repo.FindByID(id)
	if err != nil {
		return 0, err
	}
	return p.Balance, nil
}

func (s *professorService) TransferCoins(professorID uint, input dto.ProfessorTransferDTO) error {
	return SendCoins(s.db, professorID, input.StudentID, input.Amount, input.Reason)
}

func (s *professorService) ListStudents(professorID uint) ([]model.User, error) {
	prof, err := s.repo.FindByID(professorID)
	if err != nil {
		return nil, err
	}
	return s.repo.FindAllStudents(*prof.Institution)
}

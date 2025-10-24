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
	UpdateProfile(id uint, input dto.ProfessorUpdateDTO) (*dto.ProfessorProfileDTO, error)
	GetStatistics(id uint) (*dto.ProfessorStatisticsDTO, error)
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

func (s *professorService) UpdateProfile(id uint, input dto.ProfessorUpdateDTO) (*dto.ProfessorProfileDTO, error) {
	professor, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	

	if input.Name != "" {
		professor.Name = input.Name
	}
	if input.Email != "" {
		professor.Email = input.Email
	}
	if input.CPF != "" {
		professor.CPF = &input.CPF
	}
	if input.Department != "" {
		professor.Department = &input.Department
	}
	if input.Institution != "" {
		professor.Institution = &input.Institution
	}
	
	if err := s.repo.Update(professor); err != nil {
		return nil, err
	}
	
	return &dto.ProfessorProfileDTO{
		ID:          professor.ID,
		Name:        professor.Name,
		Email:       professor.Email,
		CPF:         *professor.CPF,
		Department:  *professor.Department,
		Institution: *professor.Institution,
		Balance:     professor.Balance,
	}, nil
}

func (s *professorService) GetStatistics(id uint) (*dto.ProfessorStatisticsDTO, error) {


	return &dto.ProfessorStatisticsDTO{
		MoedasDistribuidas: 750,
		AlunosBeneficiados: 15,
		MediaPorAluno:      50,
		TotalMoedas:        1000,
		DistribuicoesMes:   8,
	}, nil
}

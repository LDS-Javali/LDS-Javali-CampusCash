package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type StudentService interface {
	RegisterStudent(input dto.StudentRegisterDTO) (*model.User, error)
	GetProfile(id uint) (*dto.StudentProfileDTO, error)
	GetBalance(id uint) (*dto.StudentBalanceDTO, error)
}

type studentService struct {
	repo repository.StudentRepository
}

func NewStudentService(repo repository.StudentRepository) StudentService {
	return &studentService{repo}
}

func (s *studentService) RegisterStudent(input dto.StudentRegisterDTO) (*model.User, error) {
	pwHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	student := &model.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(pwHash),
		CPF:          &input.CPF,
		RG:           &input.RG,
		Address:      input.Address,
		Institution:  &input.Institution,
		Course:       &input.Course,
		Role:         model.StudentRole,
		Balance:      0,
	}
	if err := s.repo.Create(student); err != nil {
		return nil, err
	}
	return student, nil
}

func (s *studentService) GetProfile(id uint) (*dto.StudentProfileDTO, error) {
	student, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.StudentProfileDTO{
		ID:          student.ID,
		Name:        student.Name,
		Email:       student.Email,
		CPF:         *student.CPF,
		RG:          *student.RG,
		Address:     student.Address,
		Institution: *student.Institution,
		Course:      *student.Course,
		Balance:     student.Balance,
	}, nil
}

func (s *studentService) GetBalance(id uint) (*dto.StudentBalanceDTO, error) {
	student, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.StudentBalanceDTO{Balance: student.Balance}, nil
}

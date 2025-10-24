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
	UpdateProfile(id uint, input dto.StudentUpdateDTO) (*dto.StudentProfileDTO, error)
	GetStatistics(id uint) (*dto.StudentStatisticsDTO, error)
	SearchStudents(query string) ([]dto.StudentSearchDTO, error)
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

func (s *studentService) UpdateProfile(id uint, input dto.StudentUpdateDTO) (*dto.StudentProfileDTO, error) {
	student, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	

	if input.Name != "" {
		student.Name = input.Name
	}
	if input.Email != "" {
		student.Email = input.Email
	}
	if input.CPF != "" {
		student.CPF = &input.CPF
	}
	if input.RG != "" {
		student.RG = &input.RG
	}
	if input.Address != "" {
		student.Address = input.Address
	}
	if input.Institution != "" {
		student.Institution = &input.Institution
	}
	if input.Course != "" {
		student.Course = &input.Course
	}
	
	if err := s.repo.Update(student); err != nil {
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

func (s *studentService) GetStatistics(id uint) (*dto.StudentStatisticsDTO, error) {


	return &dto.StudentStatisticsDTO{
		MoedasRecebidasMes: 150,
		ProfessoresUnicos:  3,
		Rank:               1,
		TotalMoedas:        1250,
		ResgatesRealizados: 2,
	}, nil
}

func (s *studentService) SearchStudents(query string) ([]dto.StudentSearchDTO, error) {
	students, err := s.repo.SearchByNameOrEmail(query)
	if err != nil {
		return nil, err
	}
	
	var result []dto.StudentSearchDTO
	for _, student := range students {
		result = append(result, dto.StudentSearchDTO{
			ID:    student.ID,
			Name:  student.Name,
			Email: student.Email,
		})
	}
	
	return result, nil
}

package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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
	db   *gorm.DB
}

func NewStudentService(repo repository.StudentRepository, db *gorm.DB) StudentService {
	return &studentService{repo, db}
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
	// Buscar aluno para pegar saldo atual
	student, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Calcular início do mês atual
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// Moedas recebidas este mês (transações do tipo "give" onde o aluno é o destinatário)
	var moedasRecebidasMesResult struct {
		Total uint
	}
	if err := s.db.Model(&model.Transaction{}).
		Select("COALESCE(SUM(amount), 0) as total").
		Where("to_user_id = ? AND type = ? AND created_at >= ?", id, model.GiveCoins, startOfMonth).
		Scan(&moedasRecebidasMesResult).Error; err != nil {
		moedasRecebidasMesResult.Total = 0
	}

	// Professores únicos que enviaram moedas para este aluno
	var professoresUnicosResult struct {
		Count int64
	}
	if err := s.db.Raw(`
		SELECT COUNT(DISTINCT from_user_id) as count 
		FROM transactions 
		WHERE to_user_id = ? AND type = ? AND from_user_id IS NOT NULL
	`, id, model.GiveCoins).Scan(&professoresUnicosResult).Error; err != nil {
		professoresUnicosResult.Count = 0
	}

	// Resgates realizados (transações do tipo "redeem" onde o aluno é o remetente)
	var resgatesRealizados int64
	if err := s.db.Model(&model.Transaction{}).
		Where("from_user_id = ? AND type = ?", id, model.RedeemCoins).
		Count(&resgatesRealizados).Error; err != nil {
		resgatesRealizados = 0
	}

	// Calcular rank (posição do aluno baseado no saldo total)
	// Contar quantos alunos têm saldo maior que este aluno
	var rankCount int64
	if err := s.db.Model(&model.User{}).
		Where("role = ? AND balance > ?", model.StudentRole, student.Balance).
		Count(&rankCount).Error; err != nil {
		rankCount = 0
	}
	rank := uint(rankCount) + 1

	return &dto.StudentStatisticsDTO{
		MoedasRecebidasMes: moedasRecebidasMesResult.Total,
		ProfessoresUnicos:  uint(professoresUnicosResult.Count),
		Rank:               rank,
		TotalMoedas:        student.Balance,
		ResgatesRealizados: uint(resgatesRealizados),
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

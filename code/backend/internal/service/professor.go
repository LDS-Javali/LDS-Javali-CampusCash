package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"log"

	"gorm.io/gorm"
)

type ProfessorService interface {
	GetProfile(id uint) (*dto.ProfessorProfileDTO, error)
	GetBalance(id uint) (uint, error)
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

func (s *professorService) ListStudents(professorID uint) ([]model.User, error) {
	// Sempre buscar todos os alunos, independente de instituição
	students, err := s.repo.FindAllStudents("")
	if err != nil {
		log.Printf("Error fetching students: %v", err)
		return []model.User{}, nil
	}
	log.Printf("Found %d students", len(students))
	return students, nil
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
	// Buscar todas as transações do tipo "give" onde o professor é o remetente
	// E o destinatário é um aluno (não outro professor)
	var totalMoedasDistribuidas uint
	var totalDistribuicoes uint
	var alunosUnicos = make(map[uint]bool)

	var transactions []model.Transaction
	// JOIN com users para garantir que to_user_id seja um aluno
	// Apenas contar distribuições do professor para alunos (não para outros professores)
	if err := s.db.Model(&model.Transaction{}).
		Joins("JOIN users ON transactions.to_user_id = users.id").
		Where("transactions.from_user_id = ? AND transactions.type = ? AND users.role = ?", 
			id, model.GiveCoins, model.StudentRole).
		Find(&transactions).Error; err != nil {
		return nil, err
	}

	for _, tx := range transactions {
		totalMoedasDistribuidas += tx.Amount
		totalDistribuicoes++
		if tx.ToUserID != nil {
			alunosUnicos[*tx.ToUserID] = true
		}
	}

	// Calcular média por aluno
	var mediaPorAluno uint
	if len(alunosUnicos) > 0 {
		mediaPorAluno = totalMoedasDistribuidas / uint(len(alunosUnicos))
	}

	// Buscar saldo atual do professor
	professor, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Contar distribuições deste mês (apenas para alunos)
	var count int64
	if err := s.db.Model(&model.Transaction{}).
		Joins("JOIN users ON transactions.to_user_id = users.id").
		Where("transactions.from_user_id = ? AND transactions.type = ? AND users.role = ? AND transactions.created_at >= date('now', 'start of month')", 
			id, model.GiveCoins, model.StudentRole).
		Count(&count).Error; err != nil {
		count = 0
	}
	distribuicoesMes := uint(count)

	return &dto.ProfessorStatisticsDTO{
		MoedasDistribuidas: totalMoedasDistribuidas,
		AlunosBeneficiados: uint(len(alunosUnicos)),
		MediaPorAluno:      mediaPorAluno,
		TotalMoedas:        professor.Balance,
		DistribuicoesMes:   distribuicoesMes,
	}, nil
}

package service

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"time"

	"gorm.io/gorm"
)

type CompanyService interface {
	GetProfile(id uint) (*dto.CompanyProfileDTO, error)
	UpdateProfile(id uint, input dto.CompanyUpdateDTO) (*dto.CompanyProfileDTO, error)
	GetStatistics(id uint, db *gorm.DB) (*dto.CompanyStatisticsDTO, error)
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

func (s *companyService) GetStatistics(id uint, db *gorm.DB) (*dto.CompanyStatisticsDTO, error) {
	// Calcular início do mês atual e mês anterior
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfMonth.AddDate(0, -1, 0)

	// Vantagens Ativas
	var vantagensAtivas int64
	db.Model(&model.Reward{}).
		Where("company_id = ? AND active = ?", id, true).
		Count(&vantagensAtivas)

	// Vantagens Ativas no mês anterior
	var vantagensAtivasLastMonth int64
	db.Model(&model.Reward{}).
		Where("company_id = ? AND active = ? AND created_at < ?", id, true, startOfMonth).
		Count(&vantagensAtivasLastMonth)

	// Total de Vantagens
	var totalVantagens int64
	db.Model(&model.Reward{}).
		Where("company_id = ?", id).
		Count(&totalVantagens)

	// Resgates Este Mês
	var resgatesMes int64
	db.Model(&model.Transaction{}).
		Where("to_user_id = ? AND type = ? AND created_at >= ?", id, model.RedeemCoins, startOfMonth).
		Count(&resgatesMes)

	// Resgates Mês Anterior
	var resgatesLastMonth int64
	db.Model(&model.Transaction{}).
		Where("to_user_id = ? AND type = ? AND created_at >= ? AND created_at < ?", id, model.RedeemCoins, startOfLastMonth, startOfMonth).
		Count(&resgatesLastMonth)

	// Receita em Moedas (este mês)
	var receitaMoedas uint
	var receitaResult struct {
		Total uint
	}
	db.Model(&model.Transaction{}).
		Select("COALESCE(SUM(amount), 0) as total").
		Where("to_user_id = ? AND type = ? AND created_at >= ?", id, model.RedeemCoins, startOfMonth).
		Scan(&receitaResult)
	receitaMoedas = receitaResult.Total

	// Receita Mês Anterior
	var receitaLastMonth uint
	var receitaLastMonthResult struct {
		Total uint
	}
	db.Model(&model.Transaction{}).
		Select("COALESCE(SUM(amount), 0) as total").
		Where("to_user_id = ? AND type = ? AND created_at >= ? AND created_at < ?", id, model.RedeemCoins, startOfLastMonth, startOfMonth).
		Scan(&receitaLastMonthResult)
	receitaLastMonth = receitaLastMonthResult.Total

	// Alunos Únicos (que resgataram vantagens desta empresa)
	var alunosUnicosResult struct {
		Count int64
	}
	db.Raw(`
		SELECT COUNT(DISTINCT from_user_id) as count 
		FROM transactions 
		WHERE to_user_id = ? AND type = ? AND from_user_id IS NOT NULL
	`, id, model.RedeemCoins).Scan(&alunosUnicosResult)

	// Alunos Únicos no mês anterior
	var alunosUnicosLastMonthResult struct {
		Count int64
	}
	db.Raw(`
		SELECT COUNT(DISTINCT from_user_id) as count 
		FROM transactions 
		WHERE to_user_id = ? AND type = ? AND from_user_id IS NOT NULL AND created_at < ?
	`, id, model.RedeemCoins, startOfMonth).Scan(&alunosUnicosLastMonthResult)

	// Resgates Pendentes (cupons não utilizados)
	var resgatesPendentes int64
	db.Model(&model.Coupon{}).
		Joins("JOIN rewards ON coupons.reward_id = rewards.id").
		Where("rewards.company_id = ? AND coupons.redeemed = ?", id, false).
		Count(&resgatesPendentes)

	// Calcular percentuais
	calcPercentual := func(atual, anterior int64) float64 {
		if anterior == 0 {
			if atual > 0 {
				return 100.0
			}
			return 0.0
		}
		return ((float64(atual) - float64(anterior)) / float64(anterior)) * 100.0
	}

	vantagensAtivasPercentual := calcPercentual(vantagensAtivas, vantagensAtivasLastMonth)
	resgatesMesPercentual := calcPercentual(resgatesMes, resgatesLastMonth)
	
	var receitaMoedasPercentual float64
	if receitaLastMonth == 0 {
		if receitaMoedas > 0 {
			receitaMoedasPercentual = 100.0
		} else {
			receitaMoedasPercentual = 0.0
		}
	} else {
		receitaMoedasPercentual = ((float64(receitaMoedas) - float64(receitaLastMonth)) / float64(receitaLastMonth)) * 100.0
	}

	alunosUnicosPercentual := calcPercentual(alunosUnicosResult.Count, alunosUnicosLastMonthResult.Count)

	return &dto.CompanyStatisticsDTO{
		VantagensAtivas:          uint(vantagensAtivas),
		ResgatesMes:              uint(resgatesMes),
		ReceitaMoedas:            receitaMoedas,
		AlunosUnicos:             uint(alunosUnicosResult.Count),
		TotalVantagens:          uint(totalVantagens),
		ResgatesPendentes:       uint(resgatesPendentes),
		VantagensAtivasPercentual: vantagensAtivasPercentual,
		ResgatesMesPercentual:     resgatesMesPercentual,
		ReceitaMoedasPercentual:   receitaMoedasPercentual,
		AlunosUnicosPercentual:    alunosUnicosPercentual,
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

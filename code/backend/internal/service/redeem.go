package service

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type RedeemService interface {
	RedeemReward(studentID, rewardID uint) (*model.Coupon, *model.Transaction, error)
}

type redeemService struct {
	db              *gorm.DB
	couponRepo      repository.CouponRepository
	rewardRepo      repository.RewardRepository
	studentRepo     repository.StudentRepository
	notificationSvc *NotificationService
}

func NewRedeemService(
	db *gorm.DB,
	couponRepo repository.CouponRepository,
	rewardRepo repository.RewardRepository,
	studentRepo repository.StudentRepository,
	notificationSvc *NotificationService,
) RedeemService {
	return &redeemService{
		db:              db,
		couponRepo:      couponRepo,
		rewardRepo:      rewardRepo,
		studentRepo:     studentRepo,
		notificationSvc: notificationSvc,
	}
}

// RedeemReward processa o resgate de uma vantagem por um aluno
func (s *redeemService) RedeemReward(studentID, rewardID uint) (*model.Coupon, *model.Transaction, error) {
	// Buscar a vantagem
	reward, err := s.rewardRepo.FindByID(rewardID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("vantagem não encontrada")
		}
		return nil, nil, fmt.Errorf("erro ao buscar vantagem: %w", err)
	}

	// Buscar o aluno com lock para evitar race conditions
	var studentUser model.User
	if err := s.db.Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("id = ? AND role = ?", studentID, model.StudentRole).
		First(&studentUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, fmt.Errorf("aluno não encontrado")
		}
		return nil, nil, fmt.Errorf("erro ao buscar aluno: %w", err)
	}

	// Validar saldo
	if studentUser.Balance < reward.Cost {
		return nil, nil, fmt.Errorf("saldo insuficiente")
	}

	// Gerar código único
	code := fmt.Sprintf("CC-%d-%d", time.Now().UnixNano(), studentID)

	// Gerar hash único para o cupom
	hashInput := fmt.Sprintf("%s-%d-%d-%d", code, reward.ID, studentUser.ID, time.Now().UnixNano())
	hashBytes := sha256.Sum256([]byte(hashInput))
	hash := hex.EncodeToString(hashBytes[:])

	// Preparar transação e cupom
	transaction := model.Transaction{
		FromUserID: &studentUser.ID,
		ToUserID:   &reward.CompanyID,
		Amount:     reward.Cost,
		Type:       model.RedeemCoins,
		RewardID:   &reward.ID,
		CreatedAt:  time.Now(),
		Code:       &code,
	}

	coupon := model.Coupon{
		RewardID:  reward.ID,
		StudentID: studentUser.ID,
		Code:      code,
		Hash:      hash,
		Redeemed:  false,
		CreatedAt: time.Now(),
	}

	// Executar transação atômica
	err = s.db.Transaction(func(tx *gorm.DB) error {
		// Debitar saldo do aluno
		studentUser.Balance -= reward.Cost
		if err := tx.Save(&studentUser).Error; err != nil {
			return fmt.Errorf("erro ao debitar saldo: %w", err)
		}

		// Criar transação
		if err := tx.Create(&transaction).Error; err != nil {
			return fmt.Errorf("erro ao criar transação: %w", err)
		}

		// Criar cupom
		if err := tx.Create(&coupon).Error; err != nil {
			return fmt.Errorf("erro ao criar cupom: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, nil, err
	}

	// Buscar o cupom criado para retornar completo
	var createdCoupon model.Coupon
	if err := s.db.Where("code = ?", code).First(&createdCoupon).Error; err != nil {
		return nil, nil, fmt.Errorf("erro ao buscar cupom criado: %w", err)
	}

	return &createdCoupon, &transaction, nil
}


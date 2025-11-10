package service

import (
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/repository"
	"time"
)

type CouponService interface {
	ListStudentCoupons(studentID uint) ([]model.Coupon, error)
	ValidateCoupon(code string) (*model.Coupon, error)
	ValidateCouponByHash(hash string) (*model.Coupon, error)
	UseCoupon(code string) error
	UseCouponByHash(hash string) error
}

type couponService struct {
	repo repository.CouponRepository
}

func NewCouponService(repo repository.CouponRepository) CouponService {
	return &couponService{repo}
}

func (s *couponService) ListStudentCoupons(studentID uint) ([]model.Coupon, error) {
	return s.repo.ListByStudent(studentID)
}

func (s *couponService) ValidateCoupon(code string) (*model.Coupon, error) {
	return s.repo.FindByCode(code)
}

func (s *couponService) ValidateCouponByHash(hash string) (*model.Coupon, error) {
	return s.repo.FindByHash(hash)
}

func (s *couponService) UseCoupon(code string) error {
	coupon, err := s.repo.FindByCode(code)
	if err != nil {
		return err
	}
	now := time.Now()
	coupon.UsedAt = &now
	coupon.Redeemed = true
	return s.repo.Save(coupon)
}

func (s *couponService) UseCouponByHash(hash string) error {
	coupon, err := s.repo.FindByHash(hash)
	if err != nil {
		return err
	}
	now := time.Now()
	coupon.UsedAt = &now
	coupon.Redeemed = true
	return s.repo.Save(coupon)
}

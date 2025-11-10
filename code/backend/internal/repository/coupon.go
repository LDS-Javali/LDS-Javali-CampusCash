package repository

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

type CouponRepository interface {
	ListByStudent(studentID uint) ([]model.Coupon, error)
	FindByCode(code string) (*model.Coupon, error)
	FindByHash(hash string) (*model.Coupon, error)
	Save(coupon *model.Coupon) error
}

type couponRepository struct {
	db *gorm.DB
}

func NewCouponRepository(db *gorm.DB) CouponRepository {
	return &couponRepository{db}
}

func (r *couponRepository) ListByStudent(studentID uint) ([]model.Coupon, error) {
	var coupons []model.Coupon
	err := r.db.Where("student_id = ?", studentID).
		Order("created_at desc").
		Find(&coupons).Error
	return coupons, err
}
func (r *couponRepository) FindByCode(code string) (*model.Coupon, error) {
	var coupon model.Coupon
	err := r.db.Where("code = ?", code).First(&coupon).Error
	return &coupon, err
}
func (r *couponRepository) FindByHash(hash string) (*model.Coupon, error) {
	var coupon model.Coupon
	err := r.db.Where("hash = ?", hash).First(&coupon).Error
	return &coupon, err
}
func (r *couponRepository) Save(coupon *model.Coupon) error {
	return r.db.Save(coupon).Error
}

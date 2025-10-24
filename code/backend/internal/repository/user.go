package repository

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

type StudentRepository interface {
	Create(student *model.User) error
	FindByID(id uint) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Update(student *model.User) error
	SearchByNameOrEmail(query string) ([]model.User, error)
}

type studentRepository struct {
	db *gorm.DB
}

func NewStudentRepository(db *gorm.DB) StudentRepository {
	return &studentRepository{db}
}

func (r *studentRepository) Create(student *model.User) error {
	return r.db.Create(student).Error
}

func (r *studentRepository) FindByID(id uint) (*model.User, error) {
	var student model.User
	if err := r.db.Where("id = ? AND role = ?", id, model.StudentRole).First(&student).Error; err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *studentRepository) FindByEmail(email string) (*model.User, error) {
	var student model.User
	if err := r.db.Where("email = ? AND role = ?", email, model.StudentRole).First(&student).Error; err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *studentRepository) Update(student *model.User) error {
	return r.db.Save(student).Error
}

func (r *studentRepository) SearchByNameOrEmail(query string) ([]model.User, error) {
	var students []model.User
	err := r.db.Where("role = ? AND (name ILIKE ? OR email ILIKE ?)", 
		model.StudentRole, 
		"%"+query+"%", 
		"%"+query+"%").Find(&students).Error
	return students, err
}

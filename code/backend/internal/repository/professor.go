package repository

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

type ProfessorRepository interface {
	FindByID(id uint) (*model.User, error)
	Save(prof *model.User) error
	Update(prof *model.User) error
	FindAllStudents(institution string) ([]model.User, error)
}

type professorRepository struct {
	db *gorm.DB
}

func NewProfessorRepository(db *gorm.DB) ProfessorRepository {
	return &professorRepository{db}
}

func (r *professorRepository) FindByID(id uint) (*model.User, error) {
	var prof model.User
	if err := r.db.Where("id = ? AND role = ?", id, model.ProfessorRole).First(&prof).Error; err != nil {
		return nil, err
	}
	return &prof, nil
}

func (r *professorRepository) Save(prof *model.User) error {
	return r.db.Save(prof).Error
}

func (r *professorRepository) Update(prof *model.User) error {
	return r.db.Save(prof).Error
}

func (r *professorRepository) FindAllStudents(institution string) ([]model.User, error) {
	var students []model.User
	var err error
	
	// Se institution for vazia, buscar todos os alunos
	if institution == "" {
		err = r.db.Where("role = ?", model.StudentRole).Find(&students).Error
	} else {
		err = r.db.Where("role = ? AND institution = ?", model.StudentRole, institution).Find(&students).Error
	}
	
	return students, err
}

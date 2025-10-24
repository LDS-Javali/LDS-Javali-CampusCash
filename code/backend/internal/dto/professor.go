package dto

type ProfessorRegisterDTO struct {
    Name        string `json:"name" binding:"required"`
    Email       string `json:"email" binding:"required,email"`
    Password    string `json:"password" binding:"required"`
    CPF         string `json:"cpf" binding:"required"`
    Department  string `json:"department" binding:"required"`
    Institution string `json:"institutionId" binding:"required"`
}

type ProfessorProfileDTO struct {
    ID          uint   `json:"id"`
    Name        string `json:"name"`
    Email       string `json:"email"`
    CPF         string `json:"cpf"`
    Department  string `json:"department"`
    Institution string `json:"institutionId"`
    Balance     uint   `json:"saldoMoedas"`
}

type ProfessorTransferDTO struct {
    StudentID uint   `json:"alunoId" binding:"required"`
    Amount    uint   `json:"quantidade" binding:"required"`
    Reason    string `json:"motivo" binding:"required"`
}
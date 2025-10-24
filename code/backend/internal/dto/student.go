package dto

type StudentRegisterDTO struct {
    Name        string `json:"name" binding:"required"`
    Email       string `json:"email" binding:"required,email"`
    Password    string `json:"password" binding:"required"`
    CPF         string `json:"cpf" binding:"required"`
    RG          string `json:"rg" binding:"required"`
    Address     string `json:"address" binding:"required"`
    Institution string `json:"institutionId" binding:"required"`
    Course      string `json:"course" binding:"required"`
}

type StudentProfileDTO struct {
    ID          uint   `json:"id"`
    Name        string `json:"name"`
    Email       string `json:"email"`
    CPF         string `json:"cpf"`
    RG          string `json:"rg"`
    Address     string `json:"address"`
    Institution string `json:"institutionId"`
    Course      string `json:"course"`
    Balance     uint   `json:"saldoMoedas"`
}

type StudentBalanceDTO struct {
    Balance uint `json:"saldoMoedas"`
}
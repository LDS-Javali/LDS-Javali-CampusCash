package dto

type CompanyRegisterDTO struct {
    Name        string `json:"nomeFantasia" binding:"required"`
    Email       string `json:"email" binding:"required,email"`
    Password    string `json:"password" binding:"required"`
    CNPJ        string `json:"cnpj" binding:"required"`
    Address     string `json:"endereco" binding:"required"`
    Phone       string `json:"telefone" binding:"required"`
    Category    string `json:"categoria" binding:"required"`
}

type CompanyProfileDTO struct {
    ID        uint   `json:"id"`
    Name      string `json:"nomeFantasia"`
    Email     string `json:"email"`
    CNPJ      string `json:"cnpj"`
    Address   string `json:"endereco"`
    Phone     string `json:"telefone"`
    Category  string `json:"categoria"`
}

type CompanyUpdateDTO struct {
    Name     string `json:"nomeFantasia"`
    Email    string `json:"email" binding:"email"`
    CNPJ     string `json:"cnpj"`
    Address  string `json:"endereco"`
    Phone    string `json:"telefone"`
    Category string `json:"categoria"`
}

type CompanyStatisticsDTO struct {
    VantagensAtivas      uint `json:"vantagensAtivas"`
    ResgatesMes          uint `json:"resgatesMes"`
    ReceitaMoedas        uint `json:"receitaMoedas"`
    AlunosUnicos         uint `json:"alunosUnicos"`
    TotalVantagens       uint `json:"totalVantagens"`
    ResgatesPendentes    uint `json:"resgatesPendentes"`
}

type CompanyValidationDTO struct {
    ID        uint   `json:"id"`
    Codigo    string `json:"codigo"`
    Aluno     string `json:"aluno"`
    Vantagem  string `json:"vantagem"`
    Data      string `json:"data"`
    Status    string `json:"status"`
    Valor     uint   `json:"valor"`
}
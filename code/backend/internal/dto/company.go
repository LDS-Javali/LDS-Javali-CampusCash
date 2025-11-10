package dto

type CompanyRegisterDTO struct {
    Name        string `json:"name" binding:"required"`
    Email       string `json:"email" binding:"required,email"`
    Password    string `json:"password" binding:"required"`
    CNPJ        string `json:"cnpj" binding:"required"`
    Description string `json:"description" binding:"required"`
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
    VantagensAtivas      uint    `json:"vantagensAtivas"`
    ResgatesMes          uint    `json:"resgatesMes"`
    ReceitaMoedas        uint    `json:"receitaMoedas"`
    AlunosUnicos         uint    `json:"alunosUnicos"`
    TotalVantagens       uint    `json:"totalVantagens"`
    ResgatesPendentes    uint    `json:"resgatesPendentes"`
    VantagensAtivasPercentual    float64 `json:"vantagensAtivasPercentual,omitempty"`
    ResgatesMesPercentual        float64 `json:"resgatesMesPercentual,omitempty"`
    ReceitaMoedasPercentual      float64 `json:"receitaMoedasPercentual,omitempty"`
    AlunosUnicosPercentual       float64 `json:"alunosUnicosPercentual,omitempty"`
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
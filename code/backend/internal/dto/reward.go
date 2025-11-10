package dto

type RewardCreateDTO struct {
    Title       string `json:"titulo" binding:"required"`
    Description string `json:"descricao" binding:"required"`
    Cost        uint   `json:"custoMoedas" binding:"required"`
    ImageURL    string `json:"imagem"` // Opcional, imagem pode ser enviada separadamente
    CompanyID   uint   `json:"empresaId"` // Preenchido automaticamente pelo controller
    Category    string `json:"categoria" binding:"required"`
}
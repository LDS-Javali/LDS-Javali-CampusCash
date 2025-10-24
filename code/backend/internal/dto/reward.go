package dto

type RewardCreateDTO struct {
    Title       string `json:"titulo" binding:"required"`
    Description string `json:"descricao" binding:"required"`
    Cost        uint   `json:"custoMoedas" binding:"required"`
    ImageURL    string `json:"imagem" binding:"required"`
    CompanyID   uint   `json:"empresaId" binding:"required"`
    Category    string `json:"categoria" binding:"required"`
}
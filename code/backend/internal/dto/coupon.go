package dto

type CouponDTO struct {
    Code        string `json:"codigo"`
    RewardID    string `json:"vantagemId"`
    StudentID   string `json:"alunoId"`
    Used        bool   `json:"usado"`
    RedeemedAt  string `json:"dataResgate"`
    ExpiresAt   string `json:"dataValidade"`
}
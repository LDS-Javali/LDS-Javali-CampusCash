package controller

import (
	"campuscash-backend/internal/model"

	"gorm.io/gorm"
)

// DataEnricher fornece métodos para enriquecer dados com informações relacionadas
type DataEnricher struct {
	db *gorm.DB
}

// NewDataEnricher cria uma nova instância de DataEnricher
func NewDataEnricher(db *gorm.DB) *DataEnricher {
	return &DataEnricher{db: db}
}

// FetchRelatedUsers busca usuários relacionados por IDs e retorna um mapa
func (de *DataEnricher) FetchRelatedUsers(userIDs []uint) (map[uint]model.User, error) {
	if len(userIDs) == 0 {
		return make(map[uint]model.User), nil
	}

	var users []model.User
	if err := de.db.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
		return nil, err
	}

	userMap := make(map[uint]model.User)
	for _, u := range users {
		userMap[u.ID] = u
	}

	return userMap, nil
}

// FetchRelatedRewards busca vantagens relacionadas por IDs e retorna um mapa
func (de *DataEnricher) FetchRelatedRewards(rewardIDs []uint) (map[uint]model.Reward, error) {
	if len(rewardIDs) == 0 {
		return make(map[uint]model.Reward), nil
	}

	var rewards []model.Reward
	if err := de.db.Where("id IN ?", rewardIDs).Find(&rewards).Error; err != nil {
		return nil, err
	}

	rewardMap := make(map[uint]model.Reward)
	for _, r := range rewards {
		rewardMap[r.ID] = r
	}

	return rewardMap, nil
}

// ExtractUserIDsFromTransactions extrai IDs de usuários únicos de uma lista de transações
func ExtractUserIDsFromTransactions(txs []model.Transaction) []uint {
	userIDsMap := make(map[uint]bool)
	for _, tx := range txs {
		if tx.FromUserID != nil {
			userIDsMap[*tx.FromUserID] = true
		}
		if tx.ToUserID != nil {
			userIDsMap[*tx.ToUserID] = true
		}
	}

	userIDs := make([]uint, 0, len(userIDsMap))
	for id := range userIDsMap {
		userIDs = append(userIDs, id)
	}

	return userIDs
}

// ExtractRewardIDsFromTransactions extrai IDs de vantagens únicos de uma lista de transações
func ExtractRewardIDsFromTransactions(txs []model.Transaction) []uint {
	rewardIDsMap := make(map[uint]bool)
	for _, tx := range txs {
		if tx.RewardID != nil {
			rewardIDsMap[*tx.RewardID] = true
		}
	}

	rewardIDs := make([]uint, 0, len(rewardIDsMap))
	for id := range rewardIDsMap {
		rewardIDs = append(rewardIDs, id)
	}

	return rewardIDs
}

// ExtractRewardIDsFromCoupons extrai IDs de vantagens únicos de uma lista de cupons
func ExtractRewardIDsFromCoupons(coupons []model.Coupon) []uint {
	rewardIDsMap := make(map[uint]bool)
	for _, coupon := range coupons {
		rewardIDsMap[coupon.RewardID] = true
	}

	rewardIDs := make([]uint, 0, len(rewardIDsMap))
	for id := range rewardIDsMap {
		rewardIDs = append(rewardIDs, id)
	}

	return rewardIDs
}

// FetchRelatedCompanies busca empresas relacionadas por IDs e retorna um mapa
func (de *DataEnricher) FetchRelatedCompanies(companyIDs []uint) (map[uint]model.User, error) {
	if len(companyIDs) == 0 {
		return make(map[uint]model.User), nil
	}

	var companies []model.User
	if err := de.db.Where("id IN ? AND role = ?", companyIDs, model.CompanyRole).Find(&companies).Error; err != nil {
		return nil, err
	}

	companyMap := make(map[uint]model.User)
	for _, c := range companies {
		companyMap[c.ID] = c
	}

	return companyMap, nil
}

// ExtractCompanyIDsFromRewards extrai IDs de empresas únicos de uma lista de vantagens
func ExtractCompanyIDsFromRewards(rewards []model.Reward) []uint {
	companyIDsMap := make(map[uint]bool)
	for _, reward := range rewards {
		companyIDsMap[reward.CompanyID] = true
	}

	companyIDs := make([]uint, 0, len(companyIDsMap))
	for id := range companyIDsMap {
		companyIDs = append(companyIDs, id)
	}

	return companyIDs
}


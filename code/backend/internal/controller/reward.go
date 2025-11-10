package controller

import (
	"campuscash-backend/internal/dto"
	"campuscash-backend/internal/model"
	"campuscash-backend/internal/service"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RewardResponse struct {
	model.Reward
	CompanyName  *string `json:"CompanyName,omitempty"`
	ImageURL     *string `json:"ImageURL,omitempty"`
	ResgatesCount int    `json:"ResgatesCount,omitempty"`
}

func CompanyCreateReward(svc service.RewardService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input dto.RewardCreateDTO
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		input.CompanyID = c.GetUint("userID")
		reward, err := svc.CreateReward(input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, reward)
	}
}

func CompanyRewards(svc service.RewardService, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rewards, err := svc.ListCompanyRewards(c.GetUint("userID"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		// Contar resgates por vantagem
		rewardIDs := make([]uint, len(rewards))
		for i, r := range rewards {
			rewardIDs[i] = r.ID
		}
		
		// Contar transações do tipo "redeem" por reward_id
		type CountResult struct {
			RewardID uint   `gorm:"column:reward_id"`
			Count    int64  `gorm:"column:count"`
		}
		var counts []CountResult
		if len(rewardIDs) > 0 {
			// Usar query com GORM para garantir compatibilidade
			rows, err := db.Raw(`
				SELECT reward_id, COUNT(*) as count 
				FROM transactions 
				WHERE reward_id IN ? AND type = ? AND reward_id IS NOT NULL
				GROUP BY reward_id
			`, rewardIDs, string(model.RedeemCoins)).Rows()
			if err == nil {
				defer rows.Close()
				for rows.Next() {
					var count CountResult
					rows.Scan(&count.RewardID, &count.Count)
					counts = append(counts, count)
				}
			}
		}
		
		// Criar mapa de contagens
		countMap := make(map[uint]int)
		for _, count := range counts {
			countMap[count.RewardID] = int(count.Count)
		}
		
		// Converter para RewardResponse com ImageURL e contagem
		baseURL := fmt.Sprintf("http://%s", c.Request.Host)
		response := make([]RewardResponse, len(rewards))
		for i, reward := range rewards {
			resp := RewardResponse{Reward: reward}
			if len(reward.ImageData) > 0 {
				imageURL := fmt.Sprintf("%s/api/images/reward/%d", baseURL, reward.ID)
				resp.ImageURL = &imageURL
			}
			resp.ResgatesCount = countMap[reward.ID]
			response[i] = resp
		}
		
		c.JSON(http.StatusOK, response)
	}
}

func CompanyUpdateReward(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID := c.GetUint("userID")
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID da vantagem inválido"})
			return
		}
		var in dto.RewardCreateDTO
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var rew model.Reward
		if err := db.First(&rew, uint(id)).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}
		if rew.CompanyID != companyID {
			c.JSON(http.StatusForbidden, gin.H{"error": "não é o proprietário"})
			return
		}
		rew.Title = in.Title
		rew.Description = in.Description
		rew.Cost = in.Cost
		rew.Category = in.Category
		rew.Active = true
		if err := db.Save(&rew).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, rew)
	}
}

func CompanyUpdateRewardStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID := c.GetUint("userID")
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID da vantagem inválido"})
			return
		}
		var rew model.Reward
		if err := db.First(&rew, uint(id)).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}
		if rew.CompanyID != companyID {
			c.JSON(http.StatusForbidden, gin.H{"error": "não é o proprietário"})
			return
		}
		rew.Active = !rew.Active
		if err := db.Save(&rew).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"active": rew.Active})
	}
}

func CompanyDeleteReward(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID := c.GetUint("userID")
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID da vantagem inválido"})
			return
		}
		var rew model.Reward
		if err := db.First(&rew, uint(id)).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}
		if rew.CompanyID != companyID {
			c.JSON(http.StatusForbidden, gin.H{"error": "não é o proprietário"})
			return
		}
		if err := db.Delete(&rew).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"deleted": true})
	}
}

func ListRewards(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var rewards []model.Reward
		query := db.Where("active = ?", true)

		if categoria := c.Query("categoria"); categoria != "" && categoria != "todas" {
			query = query.Where("category = ?", categoria)
		}
		if empresa := c.Query("empresa"); empresa != "" && empresa != "todas" {
			query = query.Where("company_id = ?", empresa)
		}
		if precoMin := c.Query("precoMin"); precoMin != "" {
			query = query.Where("cost >= ?", precoMin)
		}
		if precoMax := c.Query("precoMax"); precoMax != "" {
			query = query.Where("cost <= ?", precoMax)
		}
		if busca := c.Query("busca"); busca != "" {
			searchTerm := "%" + strings.ToLower(busca) + "%"
			query = query.Where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?", searchTerm, searchTerm)
		}

		ordenacao := c.Query("ordenacao")
		switch ordenacao {
		case "preco_menor":
			query = query.Order("cost ASC")
		case "preco_maior":
			query = query.Order("cost DESC")
		case "nome":
			query = query.Order("title ASC")
		default: // relevancia ou data
			query = query.Order("created_at DESC")
		}

		query.Find(&rewards)

		// Buscar dados das empresas
		companyIDs := make(map[uint]bool)
		for _, r := range rewards {
			companyIDs[r.CompanyID] = true
		}

		companies := make(map[uint]model.User)
		if len(companyIDs) > 0 {
			var ids []uint
			for id := range companyIDs {
				ids = append(ids, id)
			}
			var companyList []model.User
			db.Where("id IN ? AND role = ?", ids, model.CompanyRole).Find(&companyList)
			for _, comp := range companyList {
				companies[comp.ID] = comp
			}
		}

		// Montar resposta com dados completos
		response := make([]RewardResponse, len(rewards))
		baseURL := fmt.Sprintf("http://%s", c.Request.Host)
		for i, reward := range rewards {
			resp := RewardResponse{Reward: reward}
			if comp, ok := companies[reward.CompanyID]; ok {
				if comp.CompanyName != nil {
					resp.CompanyName = comp.CompanyName
				} else {
					name := comp.Name
					resp.CompanyName = &name
				}
			}
			if len(reward.ImageData) > 0 {
				imageURL := fmt.Sprintf("%s/api/images/reward/%d", baseURL, reward.ID)
				resp.ImageURL = &imageURL
			}
			response[i] = resp
		}

		c.JSON(http.StatusOK, response)
	}
}

func GetRewardById(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID da vantagem inválido"})
			return
		}
		var reward model.Reward
		if err := db.First(&reward, uint(id)).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}
		if !reward.Active {
			c.JSON(http.StatusNotFound, gin.H{"error": "vantagem não encontrada"})
			return
		}

		// Buscar dados da empresa
		var company model.User
		if err := db.Where("id = ? AND role = ?", reward.CompanyID, model.CompanyRole).First(&company).Error; err == nil {
			resp := RewardResponse{Reward: reward}
			if company.CompanyName != nil {
				resp.CompanyName = company.CompanyName
			} else {
				name := company.Name
				resp.CompanyName = &name
			}
			if len(reward.ImageData) > 0 {
				baseURL := fmt.Sprintf("http://%s", c.Request.Host)
				imageURL := fmt.Sprintf("%s/api/images/reward/%d", baseURL, reward.ID)
				resp.ImageURL = &imageURL
			}
			c.JSON(http.StatusOK, resp)
		} else {
			// Se não encontrar empresa, retornar reward sem dados da empresa
			resp := RewardResponse{Reward: reward}
			if len(reward.ImageData) > 0 {
				baseURL := fmt.Sprintf("http://%s", c.Request.Host)
				imageURL := fmt.Sprintf("%s/api/images/reward/%d", baseURL, reward.ID)
				resp.ImageURL = &imageURL
			}
			c.JSON(http.StatusOK, resp)
		}
	}
}

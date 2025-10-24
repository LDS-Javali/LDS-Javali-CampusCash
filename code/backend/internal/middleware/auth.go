package middleware

import (
	"campuscash-backend/config"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth header"})
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return config.JWTSecret, nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid claims"})
			return
		}
		userRole := claims["role"].(string)
		roleOk := len(roles) == 0
		for _, r := range roles {
			if userRole == r {
				roleOk = true
				break
			}
		}
		if !roleOk {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
			return
		}
		c.Set("userID", uint(claims["id"].(float64)))
		c.Set("role", userRole)
		c.Next()
	}
}

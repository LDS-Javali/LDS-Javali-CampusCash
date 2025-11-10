package middleware

import (
	"os"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	allowedOrigin := os.Getenv("CORS_ORIGIN")
	
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		
		// Se CORS_ORIGIN não estiver configurado, permite localhost:3000 em desenvolvimento
		if allowedOrigin == "" {
			if origin == "http://localhost:3000" || origin == "http://127.0.0.1:3000" {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			}
		} else if allowedOrigin == "*" {
			// Em produção, se for "*", usar a origem da requisição (mas sem credentials)
			if origin != "" {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			}
		} else if origin == allowedOrigin {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}
		
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
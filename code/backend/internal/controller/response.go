package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ResponseError representa um erro de resposta padronizado
type ResponseError struct {
	Message string `json:"error"`
	Code    int    `json:"-"`
}

// Error implementa a interface error
func (e *ResponseError) Error() string {
	return e.Message
}

// NewError cria um novo ResponseError
func NewError(message string, code int) *ResponseError {
	return &ResponseError{
		Message: message,
		Code:    code,
	}
}

// RespondWithError retorna uma resposta de erro padronizada
func RespondWithError(c *gin.Context, err error) {
	var responseErr *ResponseError
	if errors.As(err, &responseErr) {
		c.JSON(responseErr.Code, gin.H{"error": responseErr.Message})
		return
	}

	// Mapear erros comuns do GORM
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "recurso não encontrado"})
		return
	}

	// Erro genérico
	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
}

// RespondWithSuccess retorna uma resposta de sucesso padronizada
func RespondWithSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, data)
}

// RespondWithCreated retorna uma resposta de criação bem-sucedida
func RespondWithCreated(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, data)
}

// RespondWithBadRequest retorna uma resposta de requisição inválida
func RespondWithBadRequest(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, gin.H{"error": message})
}

// RespondWithNotFound retorna uma resposta de recurso não encontrado
func RespondWithNotFound(c *gin.Context, message string) {
	if message == "" {
		message = "recurso não encontrado"
	}
	c.JSON(http.StatusNotFound, gin.H{"error": message})
}

// RespondWithUnauthorized retorna uma resposta de não autorizado
func RespondWithUnauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "credenciais inválidas"
	}
	c.JSON(http.StatusUnauthorized, gin.H{"error": message})
}

// RespondWithForbidden retorna uma resposta de acesso proibido
func RespondWithForbidden(c *gin.Context, message string) {
	if message == "" {
		message = "acesso negado"
	}
	c.JSON(http.StatusForbidden, gin.H{"error": message})
}

// RespondWithInternalError retorna uma resposta de erro interno
func RespondWithInternalError(c *gin.Context, message string) {
	if message == "" {
		message = "erro interno do servidor"
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": message})
}

// MapErrorToStatusCode mapeia erros para códigos HTTP apropriados
func MapErrorToStatusCode(err error) int {
	if err == nil {
		return http.StatusOK
	}

	var responseErr *ResponseError
	if errors.As(err, &responseErr) {
		return responseErr.Code
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return http.StatusNotFound
	}

	// Verificar mensagens de erro comuns
	errMsg := err.Error()
	switch {
	case errMsg == "saldo insuficiente":
		return http.StatusBadRequest
	case errMsg == "vantagem não encontrada" || errMsg == "aluno não encontrado" ||
		errMsg == "professor não encontrado" || errMsg == "empresa não encontrada" ||
		errMsg == "usuário não encontrado" || errMsg == "cupom não encontrado":
		return http.StatusNotFound
	case errMsg == "credenciais inválidas":
		return http.StatusUnauthorized
	case errMsg == "não é o proprietário":
		return http.StatusForbidden
	default:
		return http.StatusInternalServerError
	}
}


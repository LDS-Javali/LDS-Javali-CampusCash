package validator

import (
	"regexp"
	"strings"
	"unicode"
)


func ValidateCPF(cpf string) bool {

	cpf = regexp.MustCompile(`\D`).ReplaceAllString(cpf, "")
	

	if len(cpf) != 11 {
		return false
	}
	

	if strings.Count(cpf, string(cpf[0])) == 11 {
		return false
	}
	

	sum := 0
	for i := 0; i < 9; i++ {
		digit := int(cpf[i] - '0')
		sum += digit * (10 - i)
	}
	remainder := sum % 11
	firstDigit := 0
	if remainder >= 2 {
		firstDigit = 11 - remainder
	}
	

	sum = 0
	for i := 0; i < 10; i++ {
		digit := int(cpf[i] - '0')
		sum += digit * (11 - i)
	}
	remainder = sum % 11
	secondDigit := 0
	if remainder >= 2 {
		secondDigit = 11 - remainder
	}
	

	return int(cpf[9]-'0') == firstDigit && int(cpf[10]-'0') == secondDigit
}


func ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}


func ValidatePassword(password string) error {
	if len(password) < 8 {
		return &PasswordError{Message: "Password must be at least 8 characters long"}
	}
	
	var hasUpper, hasLower, hasNumber bool
	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		}
	}
	
	if !hasUpper {
		return &PasswordError{Message: "Password must contain at least one uppercase letter"}
	}
	if !hasLower {
		return &PasswordError{Message: "Password must contain at least one lowercase letter"}
	}
	if !hasNumber {
		return &PasswordError{Message: "Password must contain at least one number"}
	}
	
	return nil
}


func ValidateCNPJ(cnpj string) bool {

	cnpj = regexp.MustCompile(`\D`).ReplaceAllString(cnpj, "")
	

	if len(cnpj) != 14 {
		return false
	}
	

	if strings.Count(cnpj, string(cnpj[0])) == 14 {
		return false
	}
	

	weights1 := []int{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
	sum := 0
	for i := 0; i < 12; i++ {
		digit := int(cnpj[i] - '0')
		sum += digit * weights1[i]
	}
	remainder := sum % 11
	firstDigit := 0
	if remainder >= 2 {
		firstDigit = 11 - remainder
	}
	

	weights2 := []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
	sum = 0
	for i := 0; i < 13; i++ {
		digit := int(cnpj[i] - '0')
		sum += digit * weights2[i]
	}
	remainder = sum % 11
	secondDigit := 0
	if remainder >= 2 {
		secondDigit = 11 - remainder
	}
	

	return int(cnpj[12]-'0') == firstDigit && int(cnpj[13]-'0') == secondDigit
}

type PasswordError struct {
	Message string
}

func (e *PasswordError) Error() string {
	return e.Message
}


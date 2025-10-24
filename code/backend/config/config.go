package config

import (
	"log"
	"os"
	"strconv"
)

var (
	JWTSecret []byte

	DBPath string

	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string

	Port    string
	GinMode string

	CronSecret string

	MaxImageSize      int64
	AllowedImageTypes []string
)

func LoadConfig() {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-super-secret-jwt-key-change-this-in-production"
		log.Println("Warning: Using default JWT secret. Set JWT_SECRET environment variable in production!")
	}
	JWTSecret = []byte(jwtSecret)

	DBPath = os.Getenv("DB_PATH")
	if DBPath == "" {
		DBPath = "file:campuscash.db?cache=shared"
	}

	SMTPHost = os.Getenv("SMTP_HOST")
	if SMTPHost == "" {
		SMTPHost = "smtp.gmail.com"
	}

	SMTPPort = 587
	if portStr := os.Getenv("SMTP_PORT"); portStr != "" {
		if port, err := strconv.Atoi(portStr); err == nil {
			SMTPPort = port
		}
	}

	SMTPUser = os.Getenv("SMTP_USER")
	SMTPPassword = os.Getenv("SMTP_PASS")

	Port = os.Getenv("PORT")
	if Port == "" {
		Port = "8080"
	}

	GinMode = os.Getenv("GIN_MODE")
	if GinMode == "" {
		GinMode = "debug"
	}

	CronSecret = os.Getenv("CRON_SECRET")
	if CronSecret == "" {
		CronSecret = "demo-secret-123"
	}

	MaxImageSize = 5242880
	if sizeStr := os.Getenv("MAX_IMAGE_SIZE"); sizeStr != "" {
		if size, err := strconv.ParseInt(sizeStr, 10, 64); err == nil {
			MaxImageSize = size
		}
	}

	allowedTypes := os.Getenv("ALLOWED_IMAGE_TYPES")
	if allowedTypes == "" {
		allowedTypes = "jpg,jpeg,png,gif"
	}
	AllowedImageTypes = []string{"jpg", "jpeg", "png", "gif"}

	log.Printf("Configuration loaded - Port: %s, GinMode: %s, DB: %s", Port, GinMode, DBPath)
}
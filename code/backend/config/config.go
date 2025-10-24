package config

import (
    "os"
)

var (
    JWTSecret    = []byte("YOUR_SECRET_KEY")
    SMTPHost     = os.Getenv("SMTP_HOST")
    SMTPPort     = 587
    SMTPUser     = os.Getenv("SMTP_USER")
    SMTPPassword = os.Getenv("SMTP_PASS")
)
package mail

import (
	"campuscash-backend/config"

	"gopkg.in/gomail.v2"
)

func SendMail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", config.SMTPUser)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	d := gomail.NewDialer(config.SMTPHost, config.SMTPPort, config.SMTPUser, config.SMTPPassword)

	return d.DialAndSend(m)
}

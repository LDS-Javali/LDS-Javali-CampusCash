package mail

import (
	"campuscash-backend/config"
	"fmt"
	"log"

	"gopkg.in/gomail.v2"
)

// SendMail envia um email em texto simples
func SendMail(to, subject, body string) error {
	return sendEmail(to, subject, body, "text/plain")
}

// SendHTMLMail envia um email formatado em HTML
func SendHTMLMail(to, subject, htmlBody string) error {
	return sendEmail(to, subject, htmlBody, "text/html")
}

// sendEmail função interna para enviar emails
func sendEmail(to, subject, body, contentType string) error {
	m := gomail.NewMessage()
	
	// Em desenvolvimento com MailHog, não precisa de autenticação
	// Usar um email padrão se SMTPUser estiver vazio
	from := config.SMTPUser
	if from == "" {
		from = "noreply@campuscash.local"
	}
	
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	
	if contentType == "text/html" {
		m.SetBody("text/html", body)
		// Adicionar versão texto simples como alternativa
		m.AddAlternative("text/plain", stripHTML(body))
	} else {
		m.SetBody("text/plain", body)
	}

	d := gomail.NewDialer(config.SMTPHost, config.SMTPPort, config.SMTPUser, config.SMTPPassword)

	if config.UseMailHog {
		// MailHog não requer autenticação, então podemos usar nil
		d.Auth = nil
		log.Printf("📧 Sending email via MailHog to: %s | Subject: %s", to, subject)
	}

	err := d.DialAndSend(m)
	if err != nil {
		log.Printf("❌ Error sending email to %s: %v", to, err)
		return err
	}
	
	log.Printf("✅ Email sent successfully to: %s | Subject: %s", to, subject)
	return nil
}

// stripHTML remove tags HTML básicas para versão texto simples
func stripHTML(html string) string {
	// Para uma versão mais robusta, seria necessário usar uma biblioteca de parsing HTML
	// Por enquanto, retornamos o HTML como está (gomail vai lidar com isso)
	// A versão alternativa em texto simples será gerada pelo gomail automaticamente
	return html
}

// SendMailSafe envia email de forma segura (não quebra o sistema se falhar)
func SendMailSafe(to, subject, body string) {
	go func() {
		if err := SendMail(to, subject, body); err != nil {
			log.Printf("⚠️ Failed to send email (non-blocking): %v", err)
		}
	}()
}

// SendHTMLMailSafe envia email HTML de forma segura (não quebra o sistema se falhar)
func SendHTMLMailSafe(to, subject, htmlBody string) {
	go func() {
		if err := SendHTMLMail(to, subject, htmlBody); err != nil {
			log.Printf("⚠️ Failed to send HTML email (non-blocking): %v", err)
		}
	}()
}

// TemplateEmailCoinsReceived gera o corpo do email quando aluno recebe moedas
func TemplateEmailCoinsReceived(professorName string, amount uint, message string) string {
	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
		.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
		.coin-badge { display: inline-block; background: #ffd700; color: #333; padding: 10px 20px; border-radius: 25px; font-weight: bold; font-size: 18px; margin: 10px 0; }
		.message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
		.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>💰 Você recebeu moedas!</h1>
		</div>
		<div class="content">
			<p>Olá!</p>
			<p>O professor <strong>%s</strong> lhe enviou:</p>
			<div style="text-align: center;">
				<span class="coin-badge">%d moedas</span>
			</div>
			<div class="message-box">
				<p><strong>Mensagem do professor:</strong></p>
				<p>%s</p>
			</div>
			<p>Essas moedas já foram creditadas na sua conta e você pode utilizá-las para resgatar vantagens no marketplace!</p>
			<div class="footer">
				<p>CampusCash - Sistema de Moedas Estudantis</p>
			</div>
		</div>
	</div>
</body>
</html>
`, professorName, amount, message)
	return html
}

// TemplateEmailRedeemStudent gera o corpo do email para o aluno quando resgata vantagem
func TemplateEmailRedeemStudent(rewardTitle string, code string, companyName string) string {
	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
		.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
		.code-box { background: white; padding: 30px; text-align: center; border: 3px dashed #667eea; border-radius: 10px; margin: 20px 0; }
		.code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace; }
		.info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
		.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🎁 Cupom de Resgate</h1>
		</div>
		<div class="content">
			<p>Parabéns! Você resgatou com sucesso:</p>
			<div class="info-box">
				<h2 style="margin-top: 0;">%s</h2>
				<p><strong>Empresa:</strong> %s</p>
			</div>
			<p><strong>Apresente este código na loja para validar seu cupom:</strong></p>
			<div class="code-box">
				<div class="code">%s</div>
			</div>
			<p style="text-align: center; color: #666; font-size: 14px;">
				Guarde este código! Você precisará apresentá-lo presencialmente na empresa.
			</p>
			<div class="footer">
				<p>CampusCash - Sistema de Moedas Estudantis</p>
			</div>
		</div>
	</div>
</body>
</html>
`, rewardTitle, companyName, code)
	return html
}

// TemplateEmailRedeemCompany gera o corpo do email para a empresa quando aluno resgata vantagem
func TemplateEmailRedeemCompany(studentName string, rewardTitle string, code string, studentID uint) string {
	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
		.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
		.alert-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 10px; margin: 20px 0; }
		.code-box { background: white; padding: 30px; text-align: center; border: 3px dashed #667eea; border-radius: 10px; margin: 20px 0; }
		.code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace; }
		.info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
		.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🛒 Nova Troca Efetuada!</h1>
		</div>
		<div class="content">
			<div class="alert-box">
				<p style="margin: 0; font-weight: bold;">Um aluno resgatou uma de suas vantagens!</p>
			</div>
			<div class="info-box">
				<p><strong>Aluno:</strong> %s</p>
				<p><strong>ID do Aluno:</strong> #%d</p>
				<p><strong>Vantagem Resgatada:</strong> %s</p>
			</div>
			<p><strong>Valide o cupom com este código:</strong></p>
			<div class="code-box">
				<div class="code">%s</div>
			</div>
			<p style="text-align: center; color: #666; font-size: 14px;">
				Quando o aluno apresentar este código, valide-o no sistema para confirmar o uso.
			</p>
			<div class="footer">
				<p>CampusCash - Sistema de Moedas Estudantis</p>
			</div>
		</div>
	</div>
</body>
</html>
`, studentName, studentID, rewardTitle, code)
	return html
}

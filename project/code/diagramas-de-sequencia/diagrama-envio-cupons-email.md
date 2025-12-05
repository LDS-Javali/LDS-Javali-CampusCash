```
@startuml
title Diagrama de Sequência: Envio de Cupons por E-mail

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

== Cenário 1: Envio de Cupom quando Aluno Resgata Vantagem ==

actor "Aluno" as Aluno
boundary "Frontend" as Frontend
control "CouponController" as Controller
database "Banco de Dados" as DB
control "EmailService\n(gomail)" as Email

Aluno -> Frontend: 1. Resgata vantagem
activate Frontend
Frontend -> Controller: 2. POST /api/student/redeem
activate Controller

Controller -> DB: 3. Processar resgate\n(criar cupom, debitar saldo)
activate DB
DB --> Controller: 4. Cupom criado
deactivate DB

Controller -> Email: 5. Enviar email ao aluno\n(goroutine assíncrona)
activate Email

    Email -> DB: 6. Buscar dados da empresa\nFirst(&company, companyID)
    activate DB
    DB --> Email: 7. Dados da empresa\n(CompanyName, Email)
    deactivate DB

    Email -> Email: 8. Gerar template HTML\nTemplateEmailRedeemStudent(\n  rewardTitle,\n  code,\n  companyName\n)

    Email -> Email: 9. Montar corpo do email HTML\ncom código do cupom formatado

    Email -> Email: 10. SendHTMLMailSafe(\n  studentEmail,\n  subject: "Cupom de Resgate: {title}",\n  htmlBody\n)

    note right: Email contém:\n- Título da vantagem\n- Nome da empresa\n- Código do cupom formatado\n- Instruções de uso

    Email -> Email: 11. Enviar via SMTP\n(gomail.DialAndSend)

    alt Erro no envio
        Email -> Email: 12. Log erro\n(não bloqueia o sistema)
    else Sucesso
        Email -> Email: 13. Log sucesso
    end

deactivate Email

Controller -> Email: 14. Enviar email à empresa\n(goroutine assíncrona)
activate Email

    Email -> Email: 15. Gerar template HTML\nTemplateEmailRedeemCompany(\n  studentName,\n  rewardTitle,\n  code,\n  studentID\n)

    Email -> Email: 16. Montar corpo do email HTML\ncom informações do resgate

    Email -> Email: 17. SendHTMLMailSafe(\n  companyEmail,\n  subject: "Nova troca efetuada!",\n  htmlBody\n)

    note right: Email contém:\n- Nome do aluno\n- Título da vantagem\n- Código do cupom\n- ID do aluno

    Email -> Email: 18. Enviar via SMTP

deactivate Email

Controller --> Frontend: 19. HTTP 200\nCupom criado
deactivate Controller
Frontend --> Aluno: 20. Sucesso
deactivate Frontend

== Cenário 2: Envio de Email quando Professor Envia Moedas ==

actor "Professor" as Prof
boundary "Frontend" as Frontend2
control "TransactionController" as Controller2
database "Banco de Dados" as DB2
control "EmailService\n(gomail)" as Email2

Prof -> Frontend2: 21. Envia moedas ao aluno
activate Frontend2
Frontend2 -> Controller2: 22. POST /api/professor/give-coins
activate Controller2

Controller2 -> DB2: 23. Processar envio de moedas\n(SendCoins service)
activate DB2
DB2 --> Controller2: 24. Moedas enviadas
deactivate DB2

Controller2 -> Email2: 25. Enviar email ao aluno\n(goroutine assíncrona)
activate Email2

    Email2 -> Email2: 26. Gerar template HTML\nTemplateEmailCoinsReceived(\n  professorName,\n  amount,\n  message\n)

    Email2 -> Email2: 27. Montar corpo do email HTML\ncom:\n- Nome do professor\n- Quantidade de moedas\n- Mensagem do professor

    Email2 -> Email2: 28. SendHTMLMailSafe(\n  studentEmail,\n  subject: "Você recebeu moedas!",\n  htmlBody\n)

    note right: Email contém:\n- Badge com quantidade de moedas\n- Mensagem do professor\n- Informações sobre uso das moedas

    Email2 -> Email2: 29. Enviar via SMTP

deactivate Email2

Controller2 --> Frontend2: 30. HTTP 200\nMoedas enviadas
deactivate Controller2
Frontend2 --> Prof: 31. Sucesso
deactivate Frontend2

== Detalhes dos Templates de Email ==

note over Email, Email2
  **TemplateEmailRedeemStudent:**
  - Header com gradiente roxo
  - Informações da vantagem resgatada
  - Código do cupom em destaque
  - Instruções de uso

  **TemplateEmailRedeemCompany:**
  - Notificação de novo resgate
  - Dados do aluno
  - Código do cupom para validação

  **TemplateEmailCoinsReceived:**
  - Header com gradiente
  - Badge com quantidade de moedas
  - Mensagem do professor em destaque
  - Informações sobre marketplace
end note

== Processamento Assíncrono ==

note over Controller, Email
  **Características do envio de email:**

  1. **Não-bloqueante:** Uso de goroutines
     permite que a resposta HTTP seja
     enviada imediatamente

  2. **Tratamento de erros:** Erros no envio
     são logados mas não interrompem o
     fluxo principal

  3. **Templates HTML:** Emails formatados
     com estilos CSS inline

  4. **Fallback:** Versão texto simples
     incluída automaticamente pelo gomail
end note

@enduml
```

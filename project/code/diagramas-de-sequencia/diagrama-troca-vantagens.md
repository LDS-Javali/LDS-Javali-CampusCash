```
@startuml
title Diagrama de Sequência: Troca de Vantagens (Aluno)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Aluno" as Aluno
boundary "Frontend\n(Next.js)" as Frontend
control "CouponController\n(Go/Gin)" as Controller
database "Banco de Dados\n(SQLite)" as DB
control "NotificationService" as Notification
control "EmailService\n(gomail)" as Email

== Fluxo Principal ==

Aluno -> Frontend: 1. Seleciona vantagem e clica "Resgatar"
activate Frontend

Frontend -> Frontend: 2. Validar saldo do aluno\n(verificação prévia)

Frontend -> Controller: 3. POST /api/student/redeem\n{reward_id: 123}
activate Controller

Controller -> Controller: 4. Extrai studentID do token JWT

Controller -> Controller: 5. Validar entrada\nShouldBindJSON(&input)

Controller -> DB: 6. Buscar vantagem\nFirst(&reward, rewardID)
activate DB
DB --> Controller: 7. Dados da vantagem
deactivate DB

alt Vantagem não encontrada
    Controller --> Frontend: 8. HTTP 404\n{error: "vantagem não encontrada"}
    deactivate Controller
    Frontend --> Aluno: 9. Exibir erro
    deactivate Frontend
end

Controller -> DB: 10. Buscar aluno com lock\nClauses(Locking{Strength: "UPDATE"})\nFirst(&studentUser, studentID)
activate DB
DB --> Controller: 11. Dados do aluno
deactivate DB

Controller -> Controller: 12. Validar saldo\nif studentUser.Balance < reward.Cost

alt Saldo insuficiente
    Controller --> Frontend: 13. HTTP 400\n{error: "saldo insuficiente"}
    deactivate Controller
    Frontend --> Aluno: 14. Exibir erro de saldo
    deactivate Frontend
end

Controller -> Controller: 15. Gerar código único\ncode = "CC-{timestamp}-{studentID}"

Controller -> Controller: 16. Gerar hash único\nhashInput = "{code}-{rewardID}-{studentID}-{timestamp}"\nhash = SHA256(hashInput)

Controller -> DB: 17. Iniciar transação atômica\nTransaction(func(tx))
activate DB

    Controller -> Controller: 18. Debitar saldo do aluno\nstudentUser.Balance -= reward.Cost

    Controller -> DB: 19. Salvar aluno\nSave(&studentUser)
    DB --> Controller: 20. OK

    Controller -> DB: 21. Criar transação\nCreate(&Transaction{\n  FromUserID: studentID,\n  ToUserID: companyID,\n  Amount: reward.Cost,\n  Type: RedeemCoins,\n  RewardID: rewardID,\n  Code: code\n})
    DB --> Controller: 22. Transação criada

    Controller -> DB: 23. Criar cupom\nCreate(&Coupon{\n  RewardID: rewardID,\n  StudentID: studentID,\n  Code: code,\n  Hash: hash,\n  Redeemed: false\n})
    DB --> Controller: 24. Cupom criado

    Controller -> DB: 25. Commit transação
    deactivate DB

Controller -> DB: 26. Buscar cupom criado\nWhere("code = ?", code).First(&createdCoupon)
activate DB
DB --> Controller: 27. Cupom completo
deactivate DB

Controller -> Notification: 28. Criar notificação para aluno\nCreateNotification(\n  studentID,\n  NotificationTypeRedeem,\n  "Vantagem Resgatada"\n)
activate Notification
Notification -> DB: 29. Salvar notificação
activate DB
DB --> Notification: 30. Notificação criada
deactivate DB
deactivate Notification

Controller -> Notification: 31. Criar notificação para empresa\nCreateNotification(\n  companyID,\n  NotificationTypeRedeem,\n  "Novo Resgate"\n)
activate Notification
Notification -> DB: 32. Salvar notificação
activate DB
DB --> Notification: 33. Notificação criada
deactivate DB
deactivate Notification

Controller -> Email: 34. Enviar email ao aluno\n(goroutine assíncrona)
activate Email
Email -> DB: 35. Buscar dados da empresa\nFirst(&company, companyID)
activate DB
DB --> Email: 36. Dados da empresa
deactivate DB
Email -> Email: 37. TemplateEmailRedeemStudent\n(rewardTitle, code, companyName)
Email -> Email: 38. SendHTMLMailSafe\n(studentEmail, subject, htmlBody)
note right: Email com código do cupom\nenviado de forma não-bloqueante
deactivate Email

Controller -> Email: 39. Enviar email à empresa\n(goroutine assíncrona)
activate Email
Email -> Email: 40. TemplateEmailRedeemCompany\n(studentName, rewardTitle, code, studentID)
Email -> Email: 41. SendHTMLMailSafe\n(companyEmail, subject, htmlBody)
note right: Email de notificação\npara a empresa
deactivate Email

Controller --> Frontend: 42. HTTP 200\nCoupon criado
deactivate Controller

Frontend -> Frontend: 43. Atualizar saldo e cache

Frontend --> Aluno: 44. Exibir mensagem de sucesso\n"Cupom enviado para seu email!"
deactivate Frontend

@enduml
```

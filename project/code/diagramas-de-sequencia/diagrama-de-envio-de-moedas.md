```
@startuml
title Diagrama de Sequência: Envio de Moedas (Professor para Aluno)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Professor" as Prof
boundary "Frontend\n(Next.js)" as Frontend
control "TransactionController\n(Go/Gin)" as Controller
control "TransactionService" as Service
database "Banco de Dados\n(SQLite)" as DB
control "NotificationService" as Notification
control "EmailService\n(gomail)" as Email

note over Prof, Frontend: Professor autenticado e com saldo suficiente

== Fluxo Principal ==

Prof -> Frontend: 1. Preenche formulário\n(aluno, quantidade, motivo)
activate Frontend

Frontend -> Frontend: 2. Valida dados do formulário

Frontend -> Controller: 3. POST /api/professor/give-coins\n{to_student_id, amount, message}
activate Controller

Controller -> Controller: 4. Extrai professorID do token JWT

Controller -> DB: 5. Buscar professor e aluno\nFirst(&professor, professorID)\nFirst(&student, toStudentID)
activate DB
DB --> Controller: 6. Retorna dados do professor e aluno
deactivate DB

Controller -> Service: 7. SendCoins(professorID, studentID, amount, message)
activate Service

    Service -> DB: 8. Iniciar transação atômica\nTransaction(func(tx))
    activate DB

    Service -> DB: 9. Buscar professor com lock\nFirst(&prof, professorID)
    DB --> Service: 10. Dados do professor

    Service -> Service: 11. Validar saldo\nif prof.Balance < amount

    Service -> Service: 12. Debitar saldo do professor\nprof.Balance -= amount

    Service -> DB: 13. Salvar professor\nSave(&prof)
    DB --> Service: 14. OK

    Service -> DB: 15. Buscar aluno\nFirst(&stud, studentID)
    DB --> Service: 16. Dados do aluno

    Service -> Service: 17. Creditar saldo do aluno\nstud.Balance += amount

    Service -> DB: 18. Salvar aluno\nSave(&stud)
    DB --> Service: 19. OK

    Service -> DB: 20. Criar transação\nCreate(&Transaction{\n  FromUserID, ToUserID,\n  Amount, Message, Type\n})
    DB --> Service: 21. Transação criada

    Service -> DB: 22. Commit transação
    deactivate DB

Service --> Controller: 23. Sucesso
deactivate Service

Controller -> Notification: 24. Criar notificação para aluno\nCreateNotification(\n  studentID,\n  NotificationTypeReceiveCoins\n)
activate Notification
Notification -> DB: 25. Salvar notificação
activate DB
DB --> Notification: 26. Notificação criada
deactivate DB
deactivate Notification

Controller -> Email: 27. Enviar email ao aluno\n(goroutine assíncrona)
activate Email
Email -> Email: 28. TemplateEmailCoinsReceived\n(professorName, amount, message)
Email -> Email: 29. SendHTMLMailSafe\n(studentEmail, subject, htmlBody)
note right: Email enviado de forma\nnão-bloqueante
deactivate Email

Controller --> Frontend: 30. HTTP 200\n{message: "moedas enviadas"}
deactivate Controller

Frontend --> Prof: 31. Exibir mensagem de sucesso
deactivate Frontend

@enduml
```

```
@startuml
title Diagrama de Comunicação: Envio de Moedas (Professor para Aluno)

skinparam monochrome false
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 10

actor Professor
participant "Frontend\n(Next.js)" as Frontend
participant "TransactionController\n(Go/Gin)" as Controller
participant "TransactionService" as Service
database "Banco de Dados\n(SQLite)" as DB
participant "NotificationService" as Notification
participant "EmailService\n(gomail)" as Email

== Fluxo Principal ==

Professor -> Frontend: 1: Preenche formulário\n(aluno, quantidade, motivo)
activate Frontend

Frontend -> Frontend: 2: Valida dados do formulário

Frontend -> Controller: 3: POST /api/professor/give-coins\n{to_student_id, amount, message}
activate Controller

Controller -> Controller: 4: Extrai professorID do token JWT

Controller -> DB: 5: Buscar professor e aluno
activate DB
DB --> Controller: 6: Retorna dados
deactivate DB

Controller -> Service: 7: SendCoins(professorID, studentID, amount, message)
activate Service

Service -> DB: 8: Iniciar transação atômica
activate DB
Service -> DB: 9: Buscar professor com lock
DB --> Service: 10: Dados do professor
Service -> Service: 11: Validar saldo
Service -> Service: 12: Debitar saldo do professor
Service -> DB: 13: Salvar professor
Service -> DB: 14: Buscar aluno
DB --> Service: 15: Dados do aluno
Service -> Service: 16: Creditar saldo do aluno
Service -> DB: 17: Salvar aluno
Service -> DB: 18: Criar transação
Service -> DB: 19: Commit transação
deactivate DB
Service --> Controller: 20: Sucesso
deactivate Service

Controller -> Notification: 21: CreateNotification(studentID, ...)
activate Notification
Notification -> DB: 22: Salvar notificação
deactivate Notification

Controller -> Email: 23: Enviar email (goroutine)
activate Email
Email -> Email: 24: TemplateEmailCoinsReceived(...)
Email -> Email: 25: SendHTMLMailSafe(...)
deactivate Email

Controller --> Frontend: 26: HTTP 200\n{message: "moedas enviadas"}
deactivate Controller

Frontend --> Professor: 27: Exibir mensagem de sucesso
deactivate Frontend

@enduml
```

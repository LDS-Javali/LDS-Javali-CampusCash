```
@startuml
title Diagrama de Comunicação: Envio de Moedas

skinparam defaultFontSize 14
skinparam objectFontSize 14
skinparam noteFontSize 12
skinparam arrowFontSize 12
skinparam roundcorner 15
skinparam shadowing false

object Professor
object "Frontend" as Frontend
object "Controller" as Controller
object "Service" as Service
object "DB" as DB
object "Notification" as Notification
object "Email" as Email

Professor - Frontend: 1: Preenche formulário
Frontend - Controller: 2: POST /give-coins
Controller - DB: 3: Buscar usuários
DB - Controller: 4: Dados
Controller - Service: 5: SendCoins()
Service - DB: 6: Transação atômica
Service - DB: 7: Buscar professor
DB - Service: 8: Dados
Service - Service: 9: Validar saldo
Service - DB: 10: Debitar professor
Service - DB: 11: Buscar aluno
DB - Service: 12: Dados
Service - DB: 13: Creditar aluno
Service - DB: 14: Criar transação
Service - DB: 15: Commit
Service - Controller: 16: Sucesso
Controller - Notification: 17: Criar notificação
Notification - DB: 18: Salvar
Controller - Email: 19: Enviar email (async)
Email - Email: 20: Template + Send
Controller - Frontend: 21: HTTP 200
Frontend - Professor: 22: Sucesso

note right of Service
**Transação Atômica:**
- Debitar professor
- Creditar aluno
- Criar registro
end note

note right of Email
**Assíncrono:**
Goroutine não bloqueia
resposta HTTP
end note

@enduml
```

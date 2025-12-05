```
@startuml
title Diagrama de Comunicação: Envio Cupons por Email - Resgate

skinparam defaultFontSize 14
skinparam objectFontSize 14
skinparam noteFontSize 12
skinparam arrowFontSize 12
skinparam roundcorner 15
skinparam shadowing false

object Aluno
object "Frontend" as Frontend
object "Controller" as Controller
object "DB" as DB
object "Email" as Email

Aluno - Frontend: 1: Resgata vantagem
Frontend - Controller: 2: POST /redeem
Controller - DB: 3: Processar resgate
DB - Controller: 4: Cupom criado
Controller - Email: 5: Email aluno (async)
Email - DB: 6: Buscar empresa
DB - Email: 7: Dados empresa
Email - Email: 8: Template + Send
Controller - Email: 9: Email empresa (async)
Email - Email: 10: Template + Send
Controller - Frontend: 11: HTTP 200
Frontend - Aluno: 12: Sucesso

note right of Email
**Templates:**
- RedeemStudent: cupom
- RedeemCompany: notificação
end note

@enduml
```

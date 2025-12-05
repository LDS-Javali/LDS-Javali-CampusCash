```
@startuml
title Diagrama de Comunicação: Envio Email - Envio Moedas

skinparam defaultFontSize 14
skinparam objectFontSize 14
skinparam noteFontSize 12
skinparam arrowFontSize 12
skinparam roundcorner 15
skinparam shadowing false

object Professor
object "Frontend" as Frontend
object "Controller" as Controller
object "DB" as DB
object "Email" as Email

Professor - Frontend: 1: Envia moedas
Frontend - Controller: 2: POST /give-coins
Controller - DB: 3: Processar envio
DB - Controller: 4: Moedas enviadas
Controller - Email: 5: Email aluno (async)
Email - Email: 6: Template + Send
Controller - Frontend: 7: HTTP 200
Frontend - Professor: 8: Sucesso

note right of Email
**Template:**
CoinsReceived
- Badge moedas
- Mensagem professor
- Info marketplace
end note

note bottom of Controller
**Características:**
1. Não-bloqueante
2. Erros logados
3. HTML formatado
4. Fallback texto
end note

@enduml
```

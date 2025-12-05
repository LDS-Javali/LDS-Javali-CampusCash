```
@startuml
title Diagrama de Comunicação: Troca de Vantagens

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
object "Notification" as Notification
object "Email" as Email

Aluno - Frontend: 1: Resgatar vantagem
Frontend - Frontend: 2: Validar saldo
Frontend - Controller: 3: POST /redeem
Controller - Controller: 4: Extrai studentID
Controller - Controller: 5: Validar entrada
Controller - DB: 6: Buscar vantagem
DB - Controller: 7: Dados
Controller - DB: 8: Buscar aluno (lock)
DB - Controller: 9: Dados aluno
Controller - Controller: 10: Validar saldo
Controller - Controller: 11: Gerar código
Controller - Controller: 12: Gerar hash
Controller - DB: 13: Transação atômica
Controller - Controller: 14: Debitar saldo
Controller - DB: 15: Salvar aluno
Controller - DB: 16: Criar transação
Controller - DB: 17: Criar cupom
Controller - DB: 18: Commit
Controller - DB: 19: Buscar cupom
DB - Controller: 20: Cupom completo
Controller - Notification: 21: Notificar aluno
Notification - DB: 22: Salvar
Controller - Notification: 23: Notificar empresa
Notification - DB: 24: Salvar
Controller - Email: 25: Email aluno (async)
Email - DB: 26: Buscar empresa
DB - Email: 27: Dados empresa
Email - Email: 28: Template + Send
Controller - Email: 29: Email empresa (async)
Email - Email: 30: Template + Send
Controller - Frontend: 31: HTTP 200
Frontend - Frontend: 32: Atualizar cache
Frontend - Aluno: 33: Sucesso

note right of Controller
**Transação Atômica:**
- Debitar aluno
- Criar transação
- Criar cupom
Tudo ou nada
end note

note right of Email
**Assíncrono:**
Goroutines não bloqueiam
resposta HTTP
end note

@enduml
```

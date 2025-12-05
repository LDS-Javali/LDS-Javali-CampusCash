```
@startuml
title Diagrama de Comunicação: Consulta de Extrato - Aluno

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

Aluno - Frontend: 1: Acessa extrato
Frontend - Controller: 2: GET /transactions
Controller - Controller: 3: Extrai studentID
Controller - Controller: 4: Processa filtros
Controller - DB: 5: Query com filtros
Controller - DB: 6: Count total
DB - Controller: 7: Total
Controller - DB: 8: Buscar transações
DB - Controller: 9: Lista
Controller - DB: 10: Buscar usuários
DB - Controller: 11: Dados usuários
Controller - DB: 12: Buscar rewards
DB - Controller: 13: Dados rewards
Controller - Controller: 14: Montar resposta
Controller - Frontend: 15: HTTP 200
Frontend - Frontend: 16: Formatar dados
Frontend - Aluno: 17: Exibir extrato

note right of Controller
**Filtros:**
- Tipo transação
- Período
- Paginação
end note

@enduml
```

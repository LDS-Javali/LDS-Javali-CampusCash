```
@startuml
title Diagrama de Comunicação: Consulta de Extrato - Professor

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

Professor - Frontend: 1: Acessa extrato
Frontend - Controller: 2: GET /transactions
Controller - Controller: 3: Extrai professorID
Controller - DB: 4: Query filtrada
note right of Controller
**Filtro:**
Type = "give"
FromUserID = professorID
end note
Controller - DB: 5: Count total
DB - Controller: 6: Total
Controller - DB: 7: Buscar transações
DB - Controller: 8: Lista
Controller - DB: 9: Buscar relacionados
DB - Controller: 10: Dados
Controller - Controller: 11: Montar resposta
Controller - Frontend: 12: HTTP 200
Frontend - Frontend: 13: Formatar dados
Frontend - Professor: 14: Exibir extrato

@enduml
```

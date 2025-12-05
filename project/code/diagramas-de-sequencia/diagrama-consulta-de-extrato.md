```
@startuml
title Diagrama de Sequência: Consulta de Extrato (Aluno e Professor)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

== Cenário A: Aluno Consulta Extrato ==

actor "Aluno" as Aluno
boundary "Frontend\n(Next.js)" as Frontend
control "TransactionController\n(Go/Gin)" as Controller
database "Banco de Dados\n(SQLite)" as DB

Aluno -> Frontend: 1. Acessa página de extrato
activate Frontend

Frontend -> Controller: 2. GET /api/student/transactions\n?limit=20&offset=0&type=give&from_date=...
activate Controller

Controller -> Controller: 3. Extrai studentID do token JWT

Controller -> Controller: 4. Processar parâmetros de paginação\nlimit, offset

Controller -> DB: 5. Query com filtros\nWhere("from_user_id = ? OR to_user_id = ?", id, id)
activate DB

alt Filtro por tipo
    Controller -> DB: 6. Where("type = ?", typeFilter)
end

alt Filtro por data
    Controller -> DB: 7. Where("created_at >= ?", fromDate)\nWhere("created_at <= ?", toDate)
end

Controller -> DB: 8. Count total de transações
DB --> Controller: 9. Total de registros

Controller -> DB: 10. Buscar transações\nOrder("created_at desc")\nLimit(limit).Offset(offset)
DB --> Controller: 11. Lista de transações
deactivate DB

Controller -> DB: 12. Buscar usuários relacionados\n(FromUserID, ToUserID)
activate DB
DB --> Controller: 13. Dados dos usuários
deactivate DB

Controller -> DB: 14. Buscar rewards relacionadas\n(RewardID)
activate DB
DB --> Controller: 15. Dados das rewards
deactivate DB

Controller -> Controller: 16. Montar resposta com dados completos\nTransactionResponse com\nFromUserName, ToUserName, RewardTitle

Controller --> Frontend: 17. HTTP 200\n{transactions: [...], total, limit, offset}
deactivate Controller

Frontend -> Frontend: 18. Processar e formatar dados

Frontend --> Aluno: 19. Exibir extrato formatado
deactivate Frontend

== Cenário B: Professor Consulta Extrato ==

actor "Professor" as Prof
boundary "Frontend\n(Next.js)" as Frontend2
control "TransactionController\n(Go/Gin)" as Controller2
database "Banco de Dados\n(SQLite)" as DB2

Prof -> Frontend2: 20. Acessa página de extrato
activate Frontend2

Frontend2 -> Controller2: 21. GET /api/professor/transactions\n?limit=20&offset=0&aluno=...
activate Controller2

Controller2 -> Controller2: 22. Extrai professorID do token JWT

Controller2 -> DB2: 23. Query com filtros\nWhere("from_user_id = ? OR to_user_id = ?", id, id)
activate DB2

note right: Filtro específico para professor:\nApenas distribuições para alunos\n(Type = "give" AND FromUserID = professorID)

Controller2 -> DB2: 24. Count total de transações
DB2 --> Controller2: 25. Total de registros

Controller2 -> DB2: 26. Buscar transações com paginação\nOrder("created_at desc")
DB2 --> Controller2: 27. Lista de transações
deactivate DB2

Controller2 -> DB2: 28. Buscar dados relacionados\n(usuários, rewards)
activate DB2
DB2 --> Controller2: 29. Dados relacionados
deactivate DB2

Controller2 -> Controller2: 30. Montar resposta completa

Controller2 --> Frontend2: 31. HTTP 200\n{transactions: [...], total, limit, offset}
deactivate Controller2

Frontend2 -> Frontend2: 32. Processar e formatar dados

Frontend2 --> Prof: 33. Exibir extrato formatado\ncom filtros e estatísticas
deactivate Frontend2

@enduml
```

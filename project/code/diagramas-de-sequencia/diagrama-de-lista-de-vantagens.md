```
@startuml
title Diagrama de Sequência: Listagem de Vantagens (Aluno)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Aluno" as Aluno
boundary "Frontend\n(Next.js)" as Frontend
control "RewardController\n(Go/Gin)" as Controller
database "Banco de Dados\n(SQLite)" as DB

== Fluxo Principal ==

Aluno -> Frontend: 1. Acessa marketplace\n/aluno/marketplace
activate Frontend

Frontend -> Frontend: 2. Aplicar filtros\n(categoria, preço, busca, ordenação)

Frontend -> Controller: 3. GET /api/rewards\n?categoria=Alimentação&precoMin=10\n&precoMax=100&busca=...&ordenacao=relevancia
activate Controller

Controller -> Controller: 4. Inicializar query\nWhere("active = ?", true)

alt Filtro por categoria
    Controller -> DB: 5. Where("category = ?", categoria)
end

alt Filtro por empresa
    Controller -> DB: 6. Where("company_id = ?", empresa)
end

alt Filtro por preço mínimo
    Controller -> DB: 7. Where("cost >= ?", precoMin)
end

alt Filtro por preço máximo
    Controller -> DB: 8. Where("cost <= ?", precoMax)
end

alt Filtro por busca textual
    Controller -> DB: 9. Where("LOWER(title) LIKE ?\nOR LOWER(description) LIKE ?", busca)
end

alt Ordenação
    Controller -> DB: 10. Order por:\n- preco_menor: cost ASC\n- preco_maior: cost DESC\n- nome: title ASC\n- relevancia: created_at DESC
end

Controller -> DB: 11. Buscar vantagens ativas\nFind(&rewards)
activate DB
DB --> Controller: 12. Lista de vantagens
deactivate DB

Controller -> DB: 13. Buscar empresas relacionadas\nWhere("id IN ? AND role = ?", companyIDs, CompanyRole)
activate DB
DB --> Controller: 14. Dados das empresas
deactivate DB

Controller -> Controller: 15. Montar resposta completa\nRewardResponse com:\n- CompanyName\n- ImageURL (se houver)\n- Dados da vantagem

Controller --> Frontend: 16. HTTP 200\n[{ID, Title, Description, Cost,\nCategory, CompanyName, ImageURL}, ...]
deactivate Controller

Frontend -> Frontend: 17. Processar e formatar dados

Frontend -> Frontend: 18. Aplicar filtros adicionais no frontend\n(se necessário)

Frontend --> Aluno: 19. Exibir lista de vantagens\ncom cards, filtros e ordenação
deactivate Frontend

== Busca de Vantagem por ID ==

Aluno -> Frontend: 20. Clica em "Ver Detalhes"
activate Frontend

Frontend -> Controller: 21. GET /api/rewards/:id
activate Controller

Controller -> DB: 22. Buscar vantagem\nFirst(&reward, id)
activate DB
DB --> Controller: 23. Dados da vantagem
deactivate DB

Controller -> Controller: 24. Validar se está ativa\nif !reward.Active

Controller -> DB: 25. Buscar empresa\nWhere("id = ? AND role = ?", companyID, CompanyRole)
activate DB
DB --> Controller: 26. Dados da empresa
deactivate DB

Controller -> Controller: 27. Montar resposta com ImageURL\n(se houver imagem)

Controller --> Frontend: 28. HTTP 200\nRewardResponse completo
deactivate Controller

Frontend --> Aluno: 29. Exibir detalhes da vantagem
deactivate Frontend

@enduml
```

```
@startuml
title Diagrama de Sequência: Cadastro de Vantagens (Empresa Parceira)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Empresa Parceira" as Empresa
boundary "Frontend\n(Next.js)" as Frontend
control "RewardController\n(Go/Gin)" as Controller
control "RewardService" as Service
database "Banco de Dados\n(SQLite)" as DB

== Fluxo Principal ==

Empresa -> Frontend: 1. Acessa tela de cadastro\n/empresa/vantagens/nova
activate Frontend

Frontend --> Empresa: 2. Exibe formulário de cadastro

Empresa -> Frontend: 3. Preenche dados da vantagem\n(título, descrição, custo, categoria)
activate Frontend

Frontend -> Frontend: 4. Valida dados do formulário\n(vantagemSchema)

Frontend -> Controller: 5. POST /api/company/rewards\n{title, description, cost, category}
activate Controller

Controller -> Controller: 6. Extrai companyID do token JWT

Controller -> Controller: 7. Validar dados de entrada\nShouldBindJSON(&input)

Controller -> Controller: 8. Definir CompanyID\ninput.CompanyID = companyID

Controller -> Service: 9. CreateReward(input)
activate Service

    Service -> DB: 10. Criar vantagem\nCreate(&Reward{\n  Title, Description, Cost,\n  Category, CompanyID, Active\n})
    activate DB
    DB --> Service: 11. Vantagem criada com ID
    deactivate DB

Service --> Controller: 12. Retorna Reward criada
deactivate Service

Controller --> Frontend: 13. HTTP 200\nReward criada
deactivate Controller

Frontend -> Frontend: 14. Atualizar cache de vantagens

Frontend --> Empresa: 15. Exibir mensagem de sucesso\n"Vantagem cadastrada com sucesso"
deactivate Frontend

== Upload de Imagem (Opcional) ==

Empresa -> Frontend: 16. Seleciona imagem da vantagem
activate Frontend

Frontend -> Controller: 17. POST /api/company/rewards/:id/image\n(multipart/form-data)
activate Controller

Controller -> Controller: 18. Processar upload de imagem

Controller -> DB: 19. Buscar vantagem\nFirst(&reward, id)
activate DB
DB --> Controller: 20. Dados da vantagem
deactivate DB

Controller -> Controller: 21. Validar propriedade\nif reward.CompanyID != companyID

Controller -> Controller: 22. Processar e salvar imagem\nImageService.SaveImage()

Controller -> DB: 23. Atualizar vantagem com ImageData\nSave(&reward)
activate DB
DB --> Controller: 24. Vantagem atualizada
deactivate DB

Controller --> Frontend: 25. HTTP 200\nImagem salva
deactivate Controller

Frontend --> Empresa: 26. Exibir preview da imagem
deactivate Frontend

@enduml
```

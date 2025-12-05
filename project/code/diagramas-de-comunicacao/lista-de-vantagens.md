```

@startuml
title Diagrama de Comunicação: Marketplace (Vantagens)
skinparam linestyle ortho
skinparam rectangle {
    BackgroundColor White
    BorderColor Black
    RoundCorner 10
}

actor "Aluno" as Aluno
rectangle "Frontend" as Front
rectangle ":RewardController" as Ctrl
database ":Banco de Dados" as DB

' Listagem
Aluno -right-> Front : 1: Acessa Marketplace
Front -right-> Ctrl : 3: GET /rewards\n(filtros: cat, preco, busca)

' Queries de Listagem
Ctrl -down-> DB : 4-10: Build Query (Wheres)\n11: Find(Rewards)\n13: Find(Companies)
DB -up-> Ctrl : 12: Lista Rewards\n14: Dados Empresas

' Detalhes
Aluno -right-> Front : 20: Ver Detalhes
Front -right-> Ctrl : 21: GET /rewards/:id
Ctrl -down-> DB : 22: First(Reward)\n25: First(Company)

' Respostas
Ctrl -left-> Front : 16: Lista JSON\n28: Detalhe JSON

@enduml
```

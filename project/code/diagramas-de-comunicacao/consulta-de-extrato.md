```
@startuml
title Diagrama de Comunicação: Consulta de Extrato
skinparam linestyle ortho
skinparam rectangle {
    BackgroundColor White
    BorderColor Black
    RoundCorner 10
}

actor "Aluno" as Aluno
actor "Professor" as Prof
rectangle "Frontend\n(Next.js)" as Front
rectangle ":TransactionController" as Ctrl
database ":Banco de Dados" as DB

' Fluxo do Aluno
Aluno -down-> Front : 1: Acessa Extrato
Front -right-> Ctrl : 2: GET /student/transactions\n(filtros: user, date, type)

' Fluxo do Professor
Prof -down-> Front : 20: Acessa Extrato
Front -right-> Ctrl : 21: GET /professor/transactions\n(filtros: give, student_role)

' Lógica do Controller (Compartilhada)
Ctrl -down-> DB : 3/23: Query(Where conditions)\n8/24: Count()\n10/26: Find(Pagination)\n12/28: Find(Related Users)\n14/28: Find(Related Rewards)

' Retorno
DB -up-> Ctrl : 11/27: Lista Transações\n13/29: Dados Usuários\n15/29: Dados Rewards
Ctrl -left-> Front : 17/31: HTTP 200 JSON\n(Response Enriquecida)

@enduml
```

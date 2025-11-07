```
@startuml
title Diagrama de Sequência - Listagem de Vantagens

actor Aluno
boundary "Frontend (Aplicação Web)" as Frontend
control "Serviço de Vantagens (Backend)" as VantagemSvc
database "Banco de Dados" as DB

== Fluxo Principal ==

Aluno -> Frontend : 1 : solicitarListagemVantagens()
activate Frontend

Frontend -> VantagemSvc : 2 : GET /vantagens
activate VantagemSvc

VantagemSvc -> DB : 3 : select * from Vantagens
activate DB
DB --> VantagemSvc : listaVantagens
deactivate DB

VantagemSvc --> Frontend : listaVantagens
deactivate VantagemSvc

Frontend --> Aluno : exibirListaVantagens(listaVantagens)
deactivate Frontend

@enduml

```

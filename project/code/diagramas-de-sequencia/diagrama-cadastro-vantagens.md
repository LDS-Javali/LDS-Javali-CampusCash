```
@startuml
title Diagrama de Sequência - Cadastro de Vantagem

actor "Empresa Parceira" as Empresa
boundary "Frontend (Aplicação Web)" as Frontend
control "Serviço de Vantagens (Backend)" as VantagemSvc
database "Banco de Dados" as DB

== Fluxo Principal ==

Empresa -> Frontend : 1 : acessarTelaCadastroVantagem()
activate Frontend

Frontend --> Empresa : exibirFormularioCadastro()

Empresa -> Frontend : 2 : enviarDadosVantagem(título, descrição, custo, foto)
activate Frontend

Frontend -> VantagemSvc : 3 : POST /vantagens (dadosVantagem)
activate VantagemSvc

VantagemSvc -> DB : 4 : insert(Vantagem)
activate DB
DB --> VantagemSvc : sucesso
deactivate DB

VantagemSvc --> Frontend : 5 : confirmaçãoCadastro()
deactivate VantagemSvc

Frontend --> Empresa : 6 : mensagemSucesso("Vantagem cadastrada com sucesso")
deactivate Frontend

@enduml
```



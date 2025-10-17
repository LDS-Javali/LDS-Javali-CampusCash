```
@startuml
left to right direction

actor Aluno
actor Professor

rectangle "Sistema de Moeda Estudantil" {
  usecase "Cadastrar Aluno" as UC1
  usecase "Consultar Extrato" as UC2
  usecase "Trocar Moedas por vantagens" as UC3
  usecase "Enviar notificações por email" as UC4
  
  usecase "Distribuir Moedas" as UC5
  usecase "Receber moedas para distribuição" as UC6

  usecase "Cadastrar Empresa Parceira" as UC8
  usecase "Cadastrar Vantagens" as UC9
}

actor "Empresa Parceira" as Empresa

' -- Relações do Aluno --
Aluno -- (UC1)
Aluno -- (UC2)
Aluno -- (UC3)

' -- Relações do Professor --
Professor -- (UC2)
Professor -- (UC5)
Professor -- (UC6)


' -- Relações da Empresa Parceira --
(UC8) -- Empresa
(UC9) -- Empresa

' -- Relações de Inclusão --
(UC5) .> (UC4) : <<include>>
(UC3) .> (UC4) : <<include>>

@enduml

```

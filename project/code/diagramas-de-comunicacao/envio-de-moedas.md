```
@startuml
title Diagrama de Comunicação: Envio de Moedas
skinparam linestyle ortho
skinparam rectangle {
    BackgroundColor White
    BorderColor Black
    RoundCorner 10
}

actor "Professor" as Prof
rectangle "Frontend" as Front
rectangle ":TransactionController" as Ctrl
rectangle ":TransactionService" as Svc
rectangle ":NotificationService" as Notify
rectangle ":EmailService" as Email
database ":Banco de Dados" as DB

' Início
Prof -right-> Front : 1: Preenche envio
Front -right-> Ctrl : 3: POST /give-coins

' Validações Iniciais
Ctrl -down-> DB : 5: Find(Prof, Student)

' Lógica de Negócio (Service)
Ctrl -down-> Svc : 7: SendCoins()
Svc -right-> DB : 8: Begin Transaction\n11: Check Balance\n12/17: Update Balances\n20: Create Transaction

' Ações Assíncronas (Disparadas pelo Controller após sucesso)
Ctrl -up-> Notify : 24: [Async] CreateNotification()
Notify -right-> DB : 25: Save Notification

Ctrl -left-> Email : 27: [Async] SendHTMLMailSafe()
Email -down-> Email : 28: Render Template
Email -down-> Prof : 29: SMTP Send (to Student)

' Resposta
Ctrl -up-> Front : 30: HTTP 200 OK

@enduml

```

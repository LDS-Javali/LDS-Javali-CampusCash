```
@startuml
title Diagrama de Comunicação: Troca de Vantagens (Resgate)
skinparam linestyle ortho
skinparam rectangle {
    BackgroundColor White
    BorderColor Black
    RoundCorner 10
}
skinparam note {
    BackgroundColor #f0f0f0
    BorderColor #aaaaaa
}

actor "Aluno" as Aluno
actor "Empresa" as Emp
rectangle "Frontend" as Front
rectangle ":CouponController" as Ctrl
rectangle ":NotificationService" as Notify
rectangle ":EmailService" as Email
database ":Banco de Dados" as DB

' Início
Aluno -right-> Front : 1: Solicita Resgate
Front -right-> Ctrl : 3: POST /redeem

' Validações e Transação
Ctrl -down-> DB : 6: Find(Reward)\n10: Find(Student w/ Lock)\n17: Begin Transaction\n21: Create Transaction\n23: Create Coupon

' Notificações (Async)
Ctrl -left-> Notify : 28/31: [Async] CreateNotification\n(Student & Company)
Notify -down-> DB : 29/32: Save Notification

' Emails (Async)
Ctrl -up-> Email : 34/39: [Async] Send Emails\n(Student & Company)

' Detalhe do Email
Email -right-> DB : 35: Find(Company Info)
Email -left-> Aluno : 38: Email Cupom
Email -left-> Emp : 41: Email Aviso Troca

' Resposta
Ctrl -left-> Front : 42: HTTP 200 Created

note bottom of Ctrl
  Lógica Interna:
  12: Valida Saldo
  15: Gera Código
  16: Gera Hash
end note

@enduml
```

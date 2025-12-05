```
@startuml
title Diagrama de Comunicação: Cadastro de Vantagens (Empresa Parceira)
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

actor "Empresa Parceira" as Empresa
rectangle "Frontend\n(Next.js)" as Frontend
rectangle "RewardController\n(Go/Gin)" as Controller
rectangle "RewardService" as Service
database "Banco de Dados\n(SQLite)" as DB

' Relacionamento: Empresa <-> Frontend
Empresa -right-> Frontend : 1: Acessa tela\n3: Preenche dados\n16: Seleciona imagem
Frontend -left-> Empresa : 2: Exibe formulário\n15: Msg Sucesso\n26: Exibe preview

' Relacionamento: Frontend <-> Controller
Frontend -right-> Controller : 5: POST /rewards\n17: POST /rewards/:id/image
Controller -left-> Frontend : 13: HTTP 200 (Created)\n25: HTTP 200 (Saved)

' Relacionamento: Controller <-> Service (Fluxo Principal)
Controller -down-> Service : 9: CreateReward(input)
Service -up-> Controller : 12: Retorna Reward

' Relacionamento: Service <-> DB (Fluxo Principal)
Service -right-> DB : 10: Create(Reward)
DB -left-> Service : 11: Vantagem Criada

' Relacionamento: Controller <-> DB (Fluxo de Imagem - Acesso Direto conforme Seq)
Controller -right-> DB : 19: First(reward, id)\n23: Save(reward updated)
DB -left-> Controller : 20: Dados da vantagem\n24: Vantagem atualizada

' Notas para representar processamento interno (Self-Calls)
note top of Frontend
  4: Valida dados
  14: Atualiza cache
end note

note top of Controller
  6: Extrai JWT
  7: Bind JSON
  8: Set CompanyID
  --
  18: Processa upload
  21: Valida dono
  22: SaveImage()
end note

@enduml  
```

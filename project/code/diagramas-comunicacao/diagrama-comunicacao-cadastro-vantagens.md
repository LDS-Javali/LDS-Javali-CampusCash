```
@startuml
title Diagrama de Comunicação: Cadastro de Vantagens

skinparam defaultFontSize 14
skinparam objectFontSize 14
skinparam noteFontSize 12
skinparam arrowFontSize 12
skinparam roundcorner 15
skinparam shadowing false

object Empresa
object "Frontend" as Frontend
object "Controller" as Controller
object "Service" as Service
object "DB" as DB

Empresa - Frontend: 1: Acessa cadastro
Frontend - Empresa: 2: Exibe formulário
Empresa - Frontend: 3: Preenche dados
Frontend - Frontend: 4: Valida dados
Frontend - Controller: 5: POST /rewards
Controller - Controller: 6: Extrai companyID
Controller - Controller: 7: Validar entrada
Controller - Service: 8: CreateReward()
Service - DB: 9: Criar vantagem
DB - Service: 10: Vantagem criada
Service - Controller: 11: Retorna Reward
Controller - Frontend: 12: HTTP 200
Frontend - Frontend: 13: Atualizar cache
Frontend - Empresa: 14: Sucesso

Empresa - Frontend: 15: Seleciona imagem
Frontend - Controller: 16: POST /rewards/:id/image
Controller - Controller: 17: Processar upload
Controller - DB: 18: Buscar vantagem
DB - Controller: 19: Dados
Controller - Controller: 20: Validar propriedade
Controller - Controller: 21: Salvar imagem
Controller - DB: 22: Atualizar ImageData
DB - Controller: 23: Atualizado
Controller - Frontend: 24: HTTP 200
Frontend - Empresa: 25: Preview imagem

note right of Service
**Validações:**
- Título min 5 chars
- Descrição min 20 chars
- Custo > 0
- Categoria obrigatória
end note

@enduml
```

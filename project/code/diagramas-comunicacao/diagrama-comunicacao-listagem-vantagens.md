```
@startuml
title Diagrama de Comunicação: Listagem de Vantagens

skinparam defaultFontSize 14
skinparam objectFontSize 14
skinparam noteFontSize 12
skinparam arrowFontSize 12
skinparam roundcorner 15
skinparam shadowing false

object Aluno
object "Frontend" as Frontend
object "Controller" as Controller
object "DB" as DB

Aluno - Frontend: 1: Acessa marketplace
Frontend - Frontend: 2: Aplicar filtros
Frontend - Controller: 3: GET /rewards
Controller - Controller: 4: Query ativas
Controller - DB: 5: Aplicar filtros
Controller - DB: 6: Buscar vantagens
DB - Controller: 7: Lista
Controller - DB: 8: Buscar empresas
DB - Controller: 9: Dados empresas
Controller - Controller: 10: Montar resposta
Controller - Frontend: 11: HTTP 200
Frontend - Frontend: 12: Formatar dados
Frontend - Aluno: 13: Exibir lista

Aluno - Frontend: 14: Ver detalhes
Frontend - Controller: 15: GET /rewards/:id
Controller - DB: 16: Buscar vantagem
DB - Controller: 17: Dados
Controller - Controller: 18: Validar ativa
Controller - DB: 19: Buscar empresa
DB - Controller: 20: Dados empresa
Controller - Controller: 21: Montar resposta
Controller - Frontend: 22: HTTP 200
Frontend - Aluno: 23: Exibir detalhes

note right of Controller
**Filtros:**
- Categoria
- Empresa
- Preço min/max
- Busca textual
- Ordenação
end note

@enduml
```

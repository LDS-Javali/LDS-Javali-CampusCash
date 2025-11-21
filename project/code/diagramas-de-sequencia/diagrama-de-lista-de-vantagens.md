```
@startuml
title Sequência: Visualizar Lista de Vantagens

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Usuário (Aluno)" as User
participant ":Aluno" as Aluno
participant ":InstituicaoDeEnsino" as Inst
participant ":EmpresaParceira" as Empresa

note over User, Aluno: O Aluno já está autenticado e associado a uma Instituição

User -> Aluno: 1. solicitarListaVantagens()
activate Aluno

    ' O Aluno recorre à Instituição para buscar dados globais
    Aluno -> Inst: 2. listarTodasVantagens()
    activate Inst

        ' A Instituição cria uma lista vazia para agregar tudo
        Inst -> Inst: 3. listaGeral = new List<Vantagem>()

        ' Loop para percorrer todas as empresas parceiras da instituição
        loop Para cada parceiro na lista 'parceiros'
            Inst -> Empresa: 4. getVantagens()
            activate Empresa
            Empresa --> Inst: 5. retorna List<Vantagem>
            deactivate Empresa
            
            Inst -> Inst: 6. listaGeral.addAll(vantagensDaEmpresa)
        end

    Inst --> Aluno: 7. retorna listaGeral
    deactivate Inst

Aluno --> User: 8. exibe lista de vantagens
deactivate Aluno

@enduml
```

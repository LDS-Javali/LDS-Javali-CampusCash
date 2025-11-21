```

@startuml
title Sequência: Consulta de Extrato (Aluno e Professor)

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Usuário (Aluno)" as UserAluno
participant ":Aluno" as Aluno
participant ":Professor" as Prof
actor "Usuário (Professor)" as UserProf

' --- Caso 1: Aluno consultando ---
group Cenário A: Aluno Consulta Extrato
    UserAluno -> Aluno: 1. consultarExtrato()
    activate Aluno

        ' O objeto acessa sua própria lista interna
        Aluno -> Aluno: 2. buscar lista 'transacoes'
        note right: Recupera histórico de\nenvios, recebimentos e trocas

        ' Opcional: Lógica de ordenação por data
        Aluno -> Aluno: 3. ordenarPorData(transacoes)

    Aluno --> UserAluno: 4. Exibe List<Transacao>
    deactivate Aluno
end

' --- Espaçador ---
... ...

' --- Caso 2: Professor consultando ---
group Cenário B: Professor Consulta Extrato
    UserProf -> Prof: 5. consultarExtrato()
    activate Prof

        ' O objeto acessa sua própria lista interna
        Prof -> Prof: 6. buscar lista 'transacoes'
        note left: Recupera histórico de\ndistribuições feitas

        ' Opcional: Lógica de ordenação
        Prof -> Prof: 7. ordenarPorData(transacoes)

    Prof --> UserProf: 8. Exibe List<Transacao>
    deactivate Prof
end

@enduml

```

```
@startuml
title Sequência: Professor Envia Moedas ao Aluno

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 200
skinparam sequenceParticipant underline
autonumber

actor "Usuário (Professor)" as User
participant ":Professor" as Prof
participant "novaTransacao:Transacao" as Transacao
participant ":Aluno" as Aluno

note over User, Prof: O Professor está logado e possui saldo suficiente

' 1. O Usuário dispara a ação
User -> Prof: 1. distribuirMoedas(aluno, valor, "Bom trabalho")
activate Prof

    ' 2. Debita do saldo do professor
    Prof -> Prof: 2. saldoMoedas = saldoMoedas - valor

    ' 3. Cria o registro da transação (Histórico)
    Prof -> Transacao: 3. <<create>> (data, valor, tipo=ENVIO, msg)
    activate Transacao
    
    ' 4. Configura os participantes da transação
    Transacao -> Transacao: 4. setRemetente(this)
    Transacao -> Transacao: 5. setDestinatario(aluno)
    
    Transacao --> Prof: 6. retorna transação criada
    deactivate Transacao

    ' 7. Adiciona a transação ao histórico do Professor
    Prof -> Prof: 7. transacoes.add(novaTransacao)

    ' 8. Efetiva a transferência para o Aluno
    Prof -> Aluno: 8. receberMoedas(valor, this, "Bom trabalho")
    activate Aluno
    
        ' 9. Aluno aumenta seu saldo
        Aluno -> Aluno: 9. saldoMoedas = saldoMoedas + valor
        
        ' 10. Aluno também deve guardar o histórico da transação
        ' Nota: Como o diagrama de classes mostra 'transacoes' como público (+),
        ' ou o método receberMoedas implementa isso internamente criando o vínculo.
        ' Aqui assumimos que o Aluno registra o recebimento.
        Aluno -> Aluno: 10. transacoes.add(novaTransacao)
        
    Aluno --> Prof: 11. Confirmação de recebimento
    deactivate Aluno

Prof --> User: 12. Sucesso: "Moedas enviadas"
deactivate Prof

@enduml  
```


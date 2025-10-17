```
@startuml

' Skin params para melhor visualização
skinparam linetype ortho
skinparam shadowing false
skinparam handwritten false

' Entidades

entity Usuario {
  * **id_usuario (PK)**: INTEGER
  --
  * nome: VARCHAR
  * email: VARCHAR
  * senha: VARCHAR
}

entity Aluno {
  * **id_usuario (PK, FK)**: INTEGER
  --
  * cpf: VARCHAR
  * rg: VARCHAR
  * endereco: VARCHAR
  * curso: VARCHAR
  * saldo_moedas: INTEGER
  * id_instituicao (FK): INTEGER
}

entity Professor {
  * **id_usuario (PK, FK)**: INTEGER
  --
  * matricula: VARCHAR
  * departamento: VARCHAR ' Enum vira VARCHAR no banco
  * saldo_moedas: INTEGER
  * id_instituicao (FK): INTEGER
}

entity EmpresaParceira {
  * **id_usuario (PK, FK)**: INTEGER
  --
  * cnpj: VARCHAR
}

entity InstituicaoDeEnsino {
  * **id_instituicao (PK)**: INTEGER
  --
  * nome: VARCHAR
  * cnpj: VARCHAR
  * endereco: VARCHAR
}

entity Vantagem {
  * **id_vantagem (PK)**: INTEGER
  --
  * titulo: VARCHAR
  * descricao: TEXT
  * foto_url: VARCHAR
  * custo_moedas: INTEGER
  * id_empresa (FK): INTEGER
}

entity Transacao {
  * **id_transacao (PK)**: INTEGER
  --
  * data: DATETIME
  * valor: INTEGER
  * tipo: VARCHAR ' Enum vira VARCHAR no banco
  * descricao: TEXT
  * id_remetente (FK): INTEGER
  * id_destinatario (FK): INTEGER
}

' Tabela de Junção para o relacionamento Muitos-para-Muitos
entity Aluno_Vantagem {
    * **id_aluno (PK, FK)**: INTEGER
    * **id_vantagem (PK, FK)**: INTEGER
    --
    * data_aquisicao: DATETIME
}


' Relacionamentos

' Mapeamento da Herança
Usuario ||..|{ Aluno
Usuario ||..|{ Professor
Usuario ||..|{ EmpresaParceira

' Relacionamentos restantes
InstituicaoDeEnsino }o..|| Professor
InstituicaoDeEnsino }o..|| Aluno

EmpresaParceira }o..|| Vantagem

' Relacionamento de Transação com Usuario (dois papéis)
Usuario }o..|| Transacao : "é remetente"
Usuario }o..|| Transacao : "é destinatário"

' Relacionamento Muitos-para-Muitos entre Aluno e Vantagem
Aluno }o..o{ Aluno_Vantagem
Vantagem }o..o{ Aluno_Vantagem


@enduml
```

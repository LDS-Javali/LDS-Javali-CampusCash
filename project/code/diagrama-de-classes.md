```
@startuml

skinparam classAttributeIconSize 0

class Usuario {
  + nome: String
  + email: String
  + senha: String
  + autenticar(): Boolean
}

class Aluno extends Usuario {
  + cpf: String
  + rg: String
  + endereco: String
  + instituicao: InstituicaoEnsino
  + curso: String
  + saldoMoedas: int
  + transacoes: List<Transacao>
  - consultarExtrato(): List<Transacao>
  - trocarMoedas(vantagem: Vantagem): void 
  - receberMoedas(valor: int, origem: Professor, mensagem: String): void
}

class Professor extends Usuario {
  + matricula: String
  + departamento: Departamento
  + instituicao: InstituicaoEnsino
  + saldoMoedas: int
  + transacoes: List<Transacao>
  - distribuirMoedas(aluno: Aluno, valor: int, mensagem: String): void
  - consultarExtrato(): List<Transacao>
}

class EmpresaParceira extends Usuario {
  + nome: String
  + cnpj: String
  + email: String
  + senha: String
  + vantagens: List<Vantagem>
  + cadastrarVantagem(vantagem: Vantagem): void
  ' O método foi ajustado para não depender mais de Cupom
  + receberNotificacao(aluno: Aluno, vantagem: Vantagem): void
}

class Vantagem {
  + titulo: String
  + descricao: String
  + foto: String
  + custoMoedas: int
  + empresa: EmpresaParceira
}

class InstituicaoDeEnsino {
  + nome: String
  + cnpj: String
  + endereco: String
}

class Transacao {
  - data: DateTime
  - valor: int
  - tipo: Tipo
  - descricao: String
  + remetente: Usuario
  + destinatario: Usuario
}

enum Tipo {
  ENVIO
  RECEBIMENTO
  TROCA
}

enum Departamento {
  CIENCIAS_EXATAS
  CIENCIAS_HUMANAS
  CIENCIAS_BIOLOGICAS
  ENGENHARIA
  ARTES
  TECNOLOGIA
}


' --- Relacionamentos ---

' Uma transação deve ter exatamente 2 usuários (remetente e destinatário)
Usuario "2" -- "1..*" Transacao

' Um aluno pode possuir várias vantagens (que eram os cupons)
Aluno "1" -- "0..*" Vantagem

Aluno "1" -- "1" InstituicaoDeEnsino
Professor "1..*" -- "1" InstituicaoDeEnsino
EmpresaParceira "1" -- "0..*" Vantagem

@enduml
```

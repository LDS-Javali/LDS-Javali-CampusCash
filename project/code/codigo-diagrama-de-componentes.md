```
@startuml
!theme plain

title Diagrama de Componentes - Sistema de Moeda Estudantil

' Declaração dos atores
actor Aluno
actor Professor
actor "Empresa Parceira" as Empresa

' Declaração dos componentes
package "Sistema de Moeda Estudantil" {
    package "Frontend" {
        [Aplicação Web] as WebApp
    }

    package "Backend" {
        [API Gateway] as Gateway

        component [Serviço de Autenticação e Usuários] as AuthSvc
        component [Serviço de Transações e Moedas] as TransacSvc
        component [Serviço de Vantagens e Cupons] as VantagemSvc
        component [Serviço de Notificação] as NotifSvc

        database "Banco de Dados" as DB
    }
}

package "Sistemas Externos" {
    [Servidor de Email] as EmailSvc
}

' Definição das Interfaces
interface IAuth
interface ITransacao
interface IVantagem
interface INotificacao
interface IPersistencia

' Relações e Dependências

' Atores interagem com a Aplicação Web
Aluno -right-> WebApp
Professor -right-> WebApp
Empresa -right-> WebApp

' Frontend consome a API do Backend através do Gateway
WebApp -down-> Gateway

' Gateway direciona para as interfaces dos serviços de negócio
Gateway -down-> IAuth
Gateway -down-> ITransacao
Gateway -down-> IVantagem

' Serviços de negócio expõem suas interfaces
AuthSvc -left-() IAuth
TransacSvc -left-() ITransacao
VantagemSvc -left-() IVantagem

' Dependências entre os serviços do Backend
VantagemSvc ..> ITransacao : <<usa>>\n(para debitar moedas)
TransacSvc ..> INotificacao : <<usa>>\n(para notificar recebimento)
VantagemSvc ..> INotificacao : <<usa>>\n(para enviar cupons)

' Serviço de notificação expõe sua interface e depende do sistema externo
NotifSvc -left-() INotificacao
NotifSvc ..> EmailSvc : <<usa>>

' Todos os serviços de negócio dependem da interface de persistência de dados
AuthSvc ..> IPersistencia
TransacSvc ..> IPersistencia
VantagemSvc ..> IPersistencia

' O Banco de Dados implementa a interface de persistência
DB -up-() IPersistencia

@enduml
```

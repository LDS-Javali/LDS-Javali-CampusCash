```
@startuml

!theme plain

' Node para o dispositivo do cliente
node "Dispositivo do Cliente" as ClientDevice {
  artifact "Navegador Web" as Browser
}

' Usando um 'cloud' para agrupar a infraestrutura do servidor
cloud "Infraestrutura em Nuvem (ou Data Center)" {

  ' Node para o Servidor Web / Reverse Proxy
  node "Servidor Web" as WebServer {
    artifact "Frontend (React)" as FrontendApp {
      description = "Arquivos estáticos (HTML, CSS, JS)"
    }
  }

  ' Node para o Servidor de Aplicação
  node "Servidor de Aplicação" as AppServer {
    artifact "API da Aplicação" as BackendApp {
      description = "Lógica de negócio do sistema"
    }
  }

  ' Node para o Servidor de Banco de Dados
  node "Servidor de Banco de Dados (MySQL)" as DbServer {
    database "Banco de Dados 'CampusCash'" as DB {
      description = "Esquema ER mapeado"
    }
  }
}

' --- Relacionamentos de Comunicação ---

' O cliente acessa o Servidor Web via HTTPS para obter o site
ClientDevice -> WebServer : "Requisição HTTPS"

' O Servidor Web encaminha as chamadas de API para o Servidor de Aplicação
WebServer -> AppServer : "HTTP (Proxy Reverso)"

' O Servidor de Aplicação se comunica com o Banco de Dados
AppServer -> DbServer : "Conexão de BD (JDBC/TCP)"

@enduml
```

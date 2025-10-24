# CampusCash Backend API

API REST em Go para o sistema de moedas estudantis CampusCash.

## 🚀 Funcionalidades

- **Autenticação JWT** com diferentes roles (aluno, professor, empresa)
- **Gestão de moedas** - distribuição e resgate
- **Marketplace de vantagens** com filtros avançados
- **Sistema de cupons** com validação
- **Upload de imagens** (BLOB no SQLite)
- **Cronjob automático** para distribuição de moedas (demo: 60s)
- **Validações robustas** (CPF, CNPJ, email, senha)
- **Documentação Swagger** automática

## 📋 Pré-requisitos

- Go 1.21+
- SQLite3

## 🛠️ Instalação

1. **Clone o repositório**

```bash
cd code/backend
```

2. **Instale as dependências**

```bash
go mod tidy
```

3. **Configure as variáveis de ambiente**

```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute a aplicação**

```bash
go run cmd/main.go
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável      | Descrição                   | Padrão                            |
| ------------- | --------------------------- | --------------------------------- |
| `DB_PATH`     | Caminho do banco SQLite     | `file:campuscash.db?cache=shared` |
| `JWT_SECRET`  | Chave secreta para JWT      | `your-super-secret-jwt-key...`    |
| `PORT`        | Porta do servidor           | `8080`                            |
| `GIN_MODE`    | Modo do Gin (debug/release) | `debug`                           |
| `SMTP_HOST`   | Servidor SMTP               | `smtp.gmail.com`                  |
| `SMTP_PORT`   | Porta SMTP                  | `587`                             |
| `SMTP_USER`   | Usuário SMTP                | -                                 |
| `SMTP_PASS`   | Senha SMTP                  | -                                 |
| `CRON_SECRET` | Chave para cronjob          | `demo-secret-123`                 |

### Exemplo de .env

```env
DB_PATH=file:campuscash.db?cache=shared
JWT_SECRET=my-super-secret-jwt-key
PORT=8080
GIN_MODE=debug
SMTP_HOST=smtp.gmail.com
SMTP_USER=meu-email@gmail.com
SMTP_PASS=minha-senha-app
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:8080/swagger/index.html
- **Health Check**: http://localhost:8080/

## 🔗 Endpoints Principais

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/signup/student` - Cadastro de aluno
- `POST /api/auth/signup/company` - Cadastro de empresa
- `GET /api/auth/me` - Dados do usuário autenticado

### Alunos

- `GET /api/student/profile` - Perfil do aluno
- `PUT /api/student/profile` - Atualizar perfil
- `POST /api/student/profile/avatar` - Upload de avatar
- `GET /api/student/balance` - Saldo de moedas
- `GET /api/student/statistics` - Estatísticas
- `GET /api/student/transactions` - Histórico de transações
- `GET /api/student/coupons` - Meus cupons
- `POST /api/student/redeem` - Resgatar vantagem

### Professores

- `GET /api/professor/profile` - Perfil do professor
- `PUT /api/professor/profile` - Atualizar perfil
- `GET /api/professor/balance` - Saldo de moedas
- `GET /api/professor/statistics` - Estatísticas
- `GET /api/professor/students` - Listar alunos
- `GET /api/professor/students/search` - Buscar alunos
- `POST /api/professor/transfer` - Distribuir moedas

### Empresas

- `GET /api/company/profile` - Perfil da empresa
- `PUT /api/company/profile` - Atualizar perfil
- `POST /api/company/profile/logo` - Upload de logo
- `GET /api/company/statistics` - Estatísticas
- `GET /api/company/validations` - Histórico de validações
- `GET /api/company/rewards` - Minhas vantagens
- `POST /api/company/rewards` - Criar vantagem
- `POST /api/company/rewards/:id/image` - Upload de imagem
- `PATCH /api/company/rewards/:id/status` - Ativar/desativar
- `POST /api/company/validate-coupon` - Validar cupom

### Público

- `GET /api/rewards` - Listar vantagens (com filtros)
- `GET /api/institutions` - Listar instituições
- `GET /api/images/:type/:id` - Servir imagens

## 🗄️ Banco de Dados

O sistema usa SQLite com as seguintes tabelas:

- **users** - Usuários (alunos, professores, empresas)
- **rewards** - Vantagens oferecidas pelas empresas
- **transactions** - Histórico de transações de moedas
- **coupons** - Cupons gerados para resgates
- **institutions** - Instituições de ensino

## 🔄 Cronjob

O sistema inclui um cronjob que distribui 100 moedas a todos os professores a cada 60 segundos (configurável para demo).

**Endpoint manual**: `POST /api/internal/cron/distribute-coins`
**Header**: `X-Cron-Secret: demo-secret-123`

## 🖼️ Upload de Imagens

- **Avatar do aluno**: `POST /api/student/profile/avatar`
- **Logo da empresa**: `POST /api/company/profile/logo`
- **Imagem da vantagem**: `POST /api/company/rewards/:id/image`
- **Servir imagem**: `GET /api/images/:type/:id`

Formatos suportados: JPG, JPEG, PNG, GIF
Tamanho máximo: 5MB

## ✅ Validações

- **CPF**: Validação completa com dígitos verificadores
- **CNPJ**: Validação completa com dígitos verificadores
- **Email**: Formato válido e único por tipo de usuário
- **Senha**: Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número

## 🧪 Testando a API

### 1. Cadastrar um aluno

```bash
curl -X POST http://localhost:8080/api/auth/signup/student \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "MinhaSenh@123",
    "cpf": "12345678901",
    "rg": "123456789",
    "address": "Rua das Flores, 123",
    "institution": "PUC-Rio",
    "course": "Engenharia"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "MinhaSenh@123"
  }'
```

### 3. Usar o token retornado

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🚀 Deploy

Para produção, configure:

- `GIN_MODE=release`
- `JWT_SECRET` com chave forte
- `CRON_SECRET` com chave única
- Configurações SMTP válidas

## 📝 Logs

O sistema gera logs para:

- Inicialização da aplicação
- Distribuição de moedas (cronjob)
- Erros de validação
- Operações de banco de dados

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
backend/
├── cmd/main.go              # Entrypoint
├── config/                  # Configurações
├── internal/
│   ├── controller/          # HTTP handlers
│   ├── dto/                 # Data Transfer Objects
│   ├── middleware/          # Middlewares
│   ├── model/               # Modelos de dados
│   ├── repository/          # Acesso a dados
│   ├── route/               # Definição de rotas
│   └── service/             # Lógica de negócio
├── pkg/
│   └── validator/           # Validações customizadas
├── docs/                    # Documentação Swagger
└── env.example              # Exemplo de configuração
```

### Adicionando Novos Endpoints

1. Crie o DTO em `internal/dto/`
2. Implemente o service em `internal/service/`
3. Crie o controller em `internal/controller/`
4. Adicione a rota em `internal/route/routes.go`
5. Atualize a documentação Swagger

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

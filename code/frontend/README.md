# CampusCash Frontend

Sistema de moeda estudantil desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animações**: Framer Motion + GSAP
- **Formulários**: React Hook Form + Zod
- **Estado**: TanStack Query + Zustand
- **Notificações**: Sonner
- **QR Codes**: react-qr-code + html5-qrcode

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Páginas de autenticação
│   ├── aluno/             # Módulo do aluno
│   ├── professor/         # Módulo do professor
│   ├── empresa/           # Módulo da empresa
│   └── admin/             # Módulo administrativo
├── components/
│   ├── design-system/     # Componentes base do design system
│   ├── layouts/           # Layouts da aplicação
│   ├── advanced/          # Componentes avançados (QR, forms, animações)
│   └── loading/           # Componentes de loading
├── lib/
│   ├── design-tokens.ts   # Tokens de design
│   ├── animations.ts      # Configurações de animação
│   ├── types.ts          # Tipos TypeScript
│   ├── config.ts         # Configurações gerais
│   └── utils.ts          # Utilitários
└── store/                # Estado global (Zustand)
```

## 🎨 Design System

### Cores
- **Primary**: CampusCash Purple (#8B5CF6)
- **Secondary**: CampusCash Blue (#3B82F6)  
- **Accent**: CampusCash Gold (#F59E0B)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)

### Componentes Base
- `CoinBadge` - Badge com ícone de moeda
- `StatCard` - Card de métrica com ícone e trend
- `TransactionItem` - Item de transação
- `PageHeader` - Cabeçalho com breadcrumb
- `EmptyState` - Estado vazio
- `UserAvatar` - Avatar do usuário

### Componentes Avançados
- `QRCodeGenerator` - Gerador de QR codes
- `QRCodeScanner` - Scanner de QR codes
- `FormField` - Campo de formulário com validação
- `AnimatedCounter` - Contador animado
- `Confetti` - Efeito de confetti
- `Shimmer` - Loading shimmer

## 🏗️ Módulos

### 👨‍🎓 Módulo Aluno
- **Dashboard**: Saldo, stats e transações recentes
- **Extrato**: Histórico completo com filtros
- **Marketplace**: Grid de vantagens com busca
- **Detalhes Vantagem**: Modal de confirmação
- **Meus Cupons**: QR codes e status
- **Perfil**: Dados pessoais e acadêmicos

### 👨‍🏫 Módulo Professor  
- **Dashboard**: Saldo e distribuições recentes
- **Distribuir Moedas**: Seleção de aluno e validação
- **Extrato**: Histórico de distribuições
- **Perfil**: Dados acadêmicos

### 🏢 Módulo Empresa
- **Dashboard**: Stats e gráficos de resgates
- **Gerenciar Vantagens**: CRUD de vantagens
- **Nova Vantagem**: Upload de imagem e preview
- **Validar Cupons**: Scanner QR e validação
- **Histórico**: Resgates com filtros
- **Perfil**: Dados da empresa

## 🎭 Animações

### Framer Motion
- Transições de página
- Animações de entrada (fade, slide, scale)
- Stagger animations
- Gestos e interações

### GSAP
- Coin flip 3D
- Counter smooth increment
- Parallax scroll effects
- Shimmer loading
- ScrollTrigger animations

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Mínimo 44px (WCAG AA)
- **Grid Responsivo**: 1-4 colunas baseado no viewport

## ♿ Acessibilidade

- **WCAG AA**: Conformidade com diretrizes
- **Keyboard Navigation**: Navegação por teclado
- **Screen Readers**: Suporte completo
- **Focus Management**: Estados de foco visíveis
- **Color Contrast**: Contraste adequado
- **Reduced Motion**: Respeita preferências do usuário

## 🚀 Performance

- **Code Splitting**: Por rota automático
- **Image Optimization**: Next.js Image
- **Font Optimization**: Google Fonts otimizado
- **Lazy Loading**: Componentes e imagens
- **Bundle Analysis**: Análise de tamanho

## 🔧 Scripts

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em desenvolvimento
npm run dev
```

## 🌟 Features Implementadas

### ✅ Completas
- [x] Setup inicial Next.js 14 + TypeScript
- [x] Design system robusto
- [x] Layouts responsivos
- [x] Páginas públicas (Landing, Login, Cadastros)
- [x] Módulo Aluno completo
- [x] Módulo Professor completo  
- [x] Módulo Empresa completo
- [x] QR codes (geração e leitura)
- [x] Validação de formulários
- [x] Animações avançadas
- [x] Loading states e skeletons
- [x] Responsividade mobile-first
- [x] Acessibilidade WCAG AA

### 🔄 Em Progresso
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação de componentes
- [ ] Storybook
- [ ] PWA features

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para suporte@campuscash.com ou abra uma issue no GitHub.
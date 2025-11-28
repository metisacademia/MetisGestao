# Métis - Academia da Mente
## Sistema de Gestão de Avaliações Cognitivas

Sistema web completo para gestão de avaliações cognitivas mensais, desenvolvido com Next.js, TypeScript, Prisma e PostgreSQL (Supabase).

## 🚀 Funcionalidades

### Painel Administrativo (Admin)
- **Dashboard**: Visão geral do sistema com estatísticas
- **Usuários**: Gerenciamento de administradores e moderadores
- **Turmas**: Cadastro e gestão de turmas
- **Alunos**: Cadastro e acompanhamento de alunos
- **Domínios Cognitivos**: Configuração dos domínios de avaliação
- **Templates de Avaliação**: Criação e edição de modelos mensais de avaliação
- **Relatórios**: Gráficos e análises de desempenho

### Painel do Moderador
- **Turmas**: Visualização das turmas atribuídas
- **Avaliações**: Formulário dinâmico para lançamento de avaliações
- **Histórico**: Acompanhamento do desempenho dos alunos

### Características Técnicas
- ✅ Autenticação JWT com cookies httpOnly
- ✅ Formulários dinâmicos baseados em templates configuráveis
- ✅ Sistema de pontuação flexível com regras JSON
- ✅ Cálculo automático de scores por domínio cognitivo
- ✅ Gráficos interativos (evolução, comparação, radar)
- ✅ Interface em português do Brasil
- ✅ Design responsivo com Tailwind CSS
- ✅ Componentes UI com shadcn/ui

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório** (se aplicável)
```bash
git clone <url-do-repositorio>
cd metis-avaliacao
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

- `DATABASE_URL`: Use a connection string **PostgreSQL do Supabase** (prefira a URL de pooling para uso na Vercel).
- `JWT_SECRET`: Chave secreta forte para assinar tokens JWT.

> ℹ️ O Prisma 7 lê o datasource a partir de `prisma.config.ts`, que consome `DATABASE_URL` do ambiente (use a URL de pooling do Supabase). Sem essa variável definida, apenas um placeholder local é usado em ferramentas de desenvolvimento.

⚠️ **Importante**: Gere uma chave forte e aleatória para produção. Nunca use valores padrão.

4. **Configure o banco de dados**
```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar as tabelas com migrations
npx prisma migrate dev --name init

# Popular o banco com dados iniciais
npx tsx prisma/seed.ts
```

## ▶️ Executar o Projeto

### Modo de Desenvolvimento
```bash
npx next dev -p 5000
```

O sistema estará disponível em `http://localhost:5000`

### Modo de Produção
```bash
# Build da aplicação
npx next build

# Iniciar servidor de produção
npx next start -p 5000
```

## 👥 Credenciais de Acesso

### Administrador
- **Email**: admin@metis.com
- **Senha**: admin123

### Moderador
- **Email**: moderador@metis.com
- **Senha**: mod123

## 🗂️ Estrutura do Projeto

```
├── app/                      # Aplicação Next.js (App Router)
│   ├── admin/               # Páginas do painel administrativo
│   ├── moderador/           # Páginas do painel do moderador
│   ├── api/                 # API Routes
│   └── login/               # Página de login
├── components/              # Componentes React
│   ├── ui/                 # Componentes UI (shadcn/ui)
│   ├── layout/             # Componentes de layout
│   └── graficos/           # Componentes de gráficos
├── lib/                     # Utilitários e configurações
│   ├── auth.ts             # Funções de autenticação
│   ├── prisma.ts           # Cliente Prisma
│   ├── pontuacao.ts        # Motor de cálculo de pontuações
│   └── utils.ts            # Utilitários gerais
├── prisma/                  # Configuração do Prisma
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts             # Dados iniciais (seed)
└── prisma.config.ts        # Configuração do Prisma 7

```

## 📊 Modelo de Dados

### Principais Entidades

- **Usuario**: Administradores e moderadores do sistema
- **Turma**: Turmas da academia
- **Aluno**: Alunos matriculados nas turmas
- **DominioCognitivo**: Domínios de avaliação (Fluência, Cultura, Atenção, etc.)
- **TemplateAvaliacao**: Modelos mensais de avaliação
- **ItemTemplate**: Questões/itens de cada template
- **Avaliacao**: Avaliações realizadas dos alunos
- **RespostaItem**: Respostas individuais de cada questão

## 🎯 Sistema de Pontuação

O sistema suporta diferentes tipos de regras de pontuação via JSON:

### 1. Faixas Numéricas
```json
{
  "tipo": "faixas",
  "faixas": [
    { "ate": 5, "pontos": 1 },
    { "ate": 10, "pontos": 2 },
    { "acima": 10, "pontos": 3 }
  ]
}
```

### 2. Sim/Não
```json
{
  "tipo": "sim_nao",
  "sim": 1,
  "nao": 0
}
```

### 3. Mapa de Opções
```json
{
  "tipo": "mapa",
  "mapa": {
    "Excelente": 5,
    "Boa": 4,
    "Regular": 3,
    "Ruim": 2,
    "Muito ruim": 1
  }
}
```

### 4. Alternativa Correta
```json
{
  "tipo": "alternativa_correta",
  "correta": "A",
  "pontos_correta": 1,
  "pontos_errada": 0
}
```

## 📈 Relatórios e Gráficos

O sistema oferece três tipos de visualizações:

1. **Gráfico de Evolução** (Linhas): Acompanha a evolução do aluno ao longo dos meses
2. **Gráfico de Comparação** (Barras): Compara alunos de uma turma no mesmo período
3. **Gráfico Radar**: Mostra a distribuição de scores por domínio cognitivo

## 🔐 Segurança

- Senhas armazenadas com hash bcrypt (salt rounds: 10)
- Autenticação via JWT com cookies httpOnly (expiração: 7 dias)
- JWT_SECRET obrigatório via variável de ambiente (sem fallbacks inseguros)
- Middleware de proteção de rotas

## 🚢 Deploy na Vercel com Supabase

1. **Defina as variáveis de ambiente no projeto da Vercel**
   - Vá em *Settings → Environment Variables* e crie a chave `DATABASE_URL` com a *connection string* de pooling do Supabase.
   - Adicione também `JWT_SECRET` com uma chave forte.
   - Salve e acione um novo deploy para que as variáveis sejam aplicadas.

2. **Rodar migrations/localmente**
   - Confirme que o `DATABASE_URL` local aponta para o banco desejado.
   - Execute `npx prisma migrate dev --name init` para aplicar o schema atualizado.

3. **Gerar cliente Prisma**
   - Rode `npx prisma generate` sempre que o schema mudar.

4. **Seed opcional**
   - Use `npx tsx prisma/seed.ts` apenas em ambientes de desenvolvimento ou bancos preparados para dados de exemplo.

5. **Build local**
   - Com o `.env` configurado, execute `npm run build` para validar o deploy antes de subir para a Vercel.
- Controle de acesso baseado em perfis (Admin/Moderador)
- Validações de autorização em todas as APIs
- Proteção contra duplicação de avaliações
- Validação de templates ativos e consistência mês/ano

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Supabase) com Prisma ORM 7
- **Gráficos**: Recharts
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod

## 📝 Comandos Úteis

### Prisma
```bash
# Visualizar banco de dados
npx prisma studio

# Aplicar migrations
npx prisma migrate dev --name init

# Gerar cliente após mudanças no schema
npx prisma generate
```

### Desenvolvimento
```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Lint do código
npx next lint
```

## 🔄 Fluxo de Avaliação

1. **Moderador** acessa sua turma
2. Seleciona um aluno
3. O sistema carrega automaticamente o template ativo do mês atual
4. Preenche o formulário dinâmico com as respostas
5. Ao salvar, o sistema:
   - Calcula automaticamente a pontuação de cada item
   - Agrega os scores por domínio cognitivo
   - Normaliza para escala 0-10
   - Salva a avaliação completa

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Sistema desenvolvido para uso exclusivo da Métis - Academia da Mente.

---

**Desenvolvido com ❤️ para a Métis - Academia da Mente**

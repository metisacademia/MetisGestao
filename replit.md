# Métis - Academia da Mente

## Overview

Métis is a comprehensive web-based cognitive assessment management system for monthly student evaluations. The platform enables administrators to configure dynamic assessment templates, moderators to evaluate students, and both roles to track cognitive development across multiple domains. The system supports flexible, configuration-driven evaluations that can change month-to-month without code modifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 16 with App Router and React Server Components
- Leverages server components for initial data fetching and authentication checks
- Client components for interactive forms and dynamic UI elements
- TypeScript for type safety across the application

**UI Components**: shadcn/ui built on Radix UI primitives
- Consistent design system using Tailwind CSS for styling
- Reusable components (Button, Card, Dialog, Table, Input, Label)
- Custom chart components using Recharts for data visualization

**Routing Strategy**: File-based routing with role-based layouts
- `/admin/*` routes for administrative functions
- `/moderador/*` routes for moderator (teacher) functions
- Middleware handles authentication and role-based redirects
- Protected routes verify JWT tokens before rendering

### Backend Architecture

**API Design**: Next.js API Routes (REST-style endpoints)
- Organized by role: `/api/admin/*` and `/api/moderador/*`
- Authentication endpoints: `/api/auth/login` and `/api/auth/logout`
- All endpoints validate JWT tokens and user permissions
- Server actions for form submissions with automatic revalidation

**Authentication System**: JWT-based with httpOnly cookies
- Uses `jose` library for JWT signing and verification
- Passwords hashed with bcryptjs (10 rounds)
- Token includes userId, email, and perfil (role)
- 7-day token expiration
- Server-side middleware validates tokens on protected routes
- Client-side localStorage backup for API calls

**Business Logic Patterns**:
- **Dynamic Form Generation**: Assessment forms rendered from template configuration stored in database
- **Flexible Scoring System**: JSON-based scoring rules support multiple calculation types (ranges, yes/no, maps, correct answers)
- **Automatic Score Calculation**: Scores aggregated by cognitive domain and normalized to 0-10 scale
- **Status Management**: Assessments track PENDENTE → RASCUNHO → CONCLUIDA workflow

### Data Storage Solutions

**ORM**: Prisma 7.0 with PostgreSQL adapter
- Schema-first approach with migrations
- Type-safe database queries
- Connection pooling via PrismaPg adapter
- Global singleton pattern to prevent connection exhaustion

**Database Schema Design**:
- **Users (Usuario)**: Supports ADMIN and MODERADOR roles
- **Classes (Turma)**: Schedule information with moderator assignment
- **Students (Aluno)**: Linked to classes, with optional metadata
- **Cognitive Domains (DominioCognitivo)**: Configurable evaluation categories
- **Assessment Templates (TemplateAvaliacao)**: Month/year-specific evaluation models
- **Template Items (ItemTemplate)**: Individual questions/tasks with scoring rules
- **Assessments (Avaliacao)**: Student evaluation instances with aggregated scores
- **Responses (RespostaItem)**: Individual item responses with calculated points

**Key Design Decisions**:
- Templates are versioned by month/year, allowing historical assessments to remain valid
- Scoring rules stored as JSON enables flexible calculation without schema changes
- Denormalized score fields (score_fluencia_0a10, etc.) optimize reporting queries
- Status field enables draft-save functionality and completion tracking

### External Dependencies

**Core Framework Dependencies**:
- **Next.js 16**: React framework with App Router and server components
- **React 19**: UI library with concurrent features
- **TypeScript**: Static typing throughout the application

**UI & Styling**:
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **Recharts**: Charting library for analytics visualizations

**Database & ORM**:
- **Prisma 7**: ORM with PostgreSQL support via adapter
- **@prisma/adapter-pg**: PostgreSQL adapter for Prisma
- **pg**: PostgreSQL client driver

**Authentication & Security**:
- **jose**: JWT creation and verification
- **bcryptjs**: Password hashing
- **jsonwebtoken**: Legacy JWT support (could be consolidated with jose)

**Date Handling**:
- **date-fns**: Date manipulation and formatting utilities

**Development Tools**:
- **ESLint**: Code linting with Next.js configuration
- **PostCSS**: CSS processing with Tailwind integration

**Configuration Notes**:
- Database configured via DATABASE_URL environment variable
- JWT_SECRET environment variable required for authentication
- Server actions limited to 2MB body size
- No external API integrations currently configured

## Recent Changes (November 2025)

### Moderator Dashboard (/admin/dashboard)
- New page for tracking evaluation progress across all classes
- Month/Year selectors for filtering
- Statistics cards: Total evaluations, Completed, Drafts, Pending
- Class list with progress bars and expandable student details
- Direct links to start/continue evaluations

### Improved Evaluation Form
- **Collapsible sections by cognitive domain** with progress indicators
- **Integrated answer key (gabarito)** showing correct answers for each item
- **Real-time scoring** - calculates points as you fill in answers
- **Quick navigation** between sections with visual completion status
- **"Next Student" button** after saving to continue with pending evaluations

### Pre-creation of Monthly Evaluations
- Button "Gerar Avaliações para Turmas" on template detail page
- Dialog to select specific classes or all classes
- Creates draft evaluations for all students automatically
- Prevents duplicates if evaluation already exists

### Reopen Completed Evaluations
- Completed evaluations show warning banner
- "Reabrir para Edição" button to change status back to draft
- Fields are disabled until evaluation is reopened

### Fixed Reports Page
- Charts now properly clear when switching students
- Shows "No completed evaluations" message for students without data
- Loading indicators during data fetch
- Separate handling for student evolution and class comparison charts

### New Domain/Template Creation
- "Novo Domínio" button on domains page with dialog form
- "Novo Template" button on templates page with dialog form

## Evaluation Methodology (AVALIAÇÃO MÉTIS)
The system follows the Métis cognitive assessment methodology with 6 sections:
1. **Fluência Verbal** - List writers/painters/singers (scored by ranges)
2. **Cultura Geral (Sim/Não)** - 10 true/false culture questions
3. **Interpretação** - Proverb interpretation with 3 rubric levels
4. **Cultura Geral (Múltipla Escolha)** - 10 multiple choice questions
5. **Atenção** - Find 7 errors task (scored by ranges)
6. **Auto-percepção** - Self-assessment of memory (scale 1-5)
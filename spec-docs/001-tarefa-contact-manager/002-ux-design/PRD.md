# PRD: Refatoração Visual Frontend - Personal Contact Manager

**Documento:** Product Requirements Document  
**Data:** 2026-07-10  
**Versão:** 1.0.0  
**Status:** Pronto para Implementação  
**Objetivo:** Transformar o Personal Contact Manager com design moderno, invador e jovem

---

## 📊 Visão Geral

Refatorar completamente a interface visual do Personal Contact Manager com:
- **Design System** coeso e reutilizável
- **Paleta de Cores:** Azul claro + Cinza (profundo)
- **Componentes:** Modernos, com efeitos visuais elegantes
- **Imagens & Ícones:** Visuais atraentes e consistentes
- **Tipografia:** Hierarquia clara e legível
- **Animações:** Transições suaves e feedback visual
- **Responsividade:** Mobile-first, adaptável a todos os tamanhos

---

## 🎨 Design System

### 1. Paleta de Cores

#### Primárias (Azul Claro)
```
Azul Principal:       #0EA5E9 (Sky Blue)
Azul Escuro:          #0284C7 (Darker Sky)
Azul Claro:           #38BDF8 (Light Sky)
Azul Muito Claro:     #F0F9FF (Sky Bg)
```

#### Secundárias (Cinza)
```
Cinza Escuro:         #1F2937 (Dark Gray - Text)
Cinza Médio:          #6B7280 (Medium Gray)
Cinza Claro:          #D1D5DB (Light Gray - Borders)
Cinza Muito Claro:    #F3F4F6 (Bg Cinza)
```

#### Estados
```
Sucesso:              #10B981 (Green)
Aviso:                #F59E0B (Amber)
Erro:                 #EF4444 (Red)
Info:                 #0EA5E9 (Sky Blue)
```

#### Backgrounds
```
Fundo Principal:      #FFFFFF (White)
Fundo Secundário:     #F3F4F6 (Cinza muito claro)
Fundo Escuro:         #1F2937 (Dark Gray)
Overlay Escuro:       rgba(31, 41, 55, 0.7)
```

---

### 2. Tipografia

#### Fontes
- **Primária:** Inter (sans-serif) - Google Fonts
- **Secundária:** Plus Jakarta Sans - Google Fonts

#### Hierarquia de Tamanhos

| Elemento | Tamanho | Weight | Uso |
|----------|---------|--------|-----|
| H1 (Hero) | 48px | 700 | Títulos principais |
| H2 (Seção) | 32px | 600 | Títulos de seção |
| H3 (Card) | 24px | 600 | Títulos de cards |
| Body (Grande) | 18px | 500 | Labels, destaque |
| Body (Normal) | 16px | 400 | Texto principal |
| Body (Pequeno) | 14px | 400 | Texto secundário |
| Caption | 12px | 500 | Labels, badges |

#### Line Heights
```
H1, H2:  1.2 (compacto)
H3:      1.3
Body:    1.6 (confortável)
Caption: 1.4
```

---

### 3. Espaçamento

Sistema de base 4px para consistência:

```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  24px
2xl: 32px
3xl: 48px
4xl: 64px
```

---

### 4. Componentes Base

#### Botões

**Variantes:**
- **Primary (Azul):** Ações principais, CTA
- **Secondary (Cinza):** Ações secundárias
- **Ghost (Transparent):** Links, ações leves
- **Danger (Vermelho):** Deletar, ações críticas

**Estados:**
- Normal
- Hover (Escurece 10%)
- Active (Escurece 20%)
- Disabled (Opacity 50%, cursor not-allowed)
- Loading (Spinner animado)

**Tamanhos:**
- Small: 32px height, 12px padding
- Medium: 40px height, 16px padding
- Large: 48px height, 20px padding

**Exemplo:**
```tsx
<Button variant="primary" size="medium" disabled={false}>
  Salvar Contato
</Button>
```

#### Cards

- **Border-radius:** 12px
- **Padding:** 20px
- **Box-shadow:** 0 1px 3px rgba(0, 0, 0, 0.1)
- **Hover:** Shadow aumenta para 0 4px 12px rgba(0, 0, 0, 0.15)
- **Background:** #FFFFFF
- **Transition:** all 200ms cubic-bezier(0.4, 0, 0.2, 1)

#### Inputs

- **Border:** 1px solid #D1D5DB
- **Border-radius:** 8px
- **Padding:** 12px 16px
- **Font-size:** 16px
- **Placeholder:** #9CA3AF
- **Focus:** Border #0EA5E9, box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)
- **Disabled:** Background #F3F4F6, color #9CA3AF

#### Badges

- **Padding:** 6px 12px
- **Border-radius:** 999px
- **Font-size:** 12px
- **Font-weight:** 600
- **Variantes:** primary, success, warning, error, info

---

## 🖼️ Páginas & Layouts

### 1. Header (Navegação)

**Especificação:**
- **Height:** 72px
- **Background:** Gradiente azul (claro → céu)
- **Tipo:** Sticky (fixo no topo)
- **Elementos:**
  - Logo + branding à esquerda
  - Título da página central
  - Avatar/perfil + menu dropdown à direita

**Visual:**
```
Background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)
Cor do texto: #FFFFFF
Shadow: 0 4px 12px rgba(14, 165, 233, 0.2)
```

---

### 2. Sidebar (Menu Lateral) - Optional

Se implementado:
- **Width:** 280px (desktop), collapse em mobile
- **Background:** #F3F4F6 (cinza claro)
- **Items:** Ícone + texto, ativo com borda azul esquerda
- **Navegação suave** ao alternar páginas

---

### 3. HomePage (Lista de Contatos)

#### Layout
```
┌─────────────────────────────────────────────┐
│           HEADER (Azul Gradiente)          │
├─────────────────────────────────────────────┤
│                                             │
│  Bem-vindo! Seus Contatos                  │
│  [Search...] [Filter ▼] [+ Novo Contato]  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ CARD 1   │  │ CARD 2   │  │ CARD 3   │ │
│  │ Contato  │  │ Contato  │  │ Contato  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  < 1 2 3 > (Pagination)                    │
│                                             │
└─────────────────────────────────────────────┘
```

#### Componentes

**Search Bar:**
- Ícone de lupa (azul)
- Placeholder: "Buscar por nome ou email..."
- Debounce 300ms
- Sugestões em dropdown real-time

**Filter Button:**
- Ícone de filtro
- Dropdown com opções de filtro por data de nascimento
- Data range picker

**Add Contact Button (CTA):**
- Cor primária azul
- Tamanho grande
- Ícone + texto: "+ Novo Contato"
- Hover effect: Glow suave

**Contact Cards:**
```
┌─────────────────────────────┐
│ João da Silva        [Edit] │  ← Header com nome e ações
│ 📧 joao@email.com    [•••]  │
│ 📱 (11) 98765-4321          │
│ 🎂 15/01/1990        [Del]  │
│                             │
│ Criado em: 09/07/2026       │
│ Atualizado: 10/07/2026      │
└─────────────────────────────┘
```

**Card Features:**
- Hover: Sombra aumenta, se torna ligeiramente azulado
- Click: Abre modal com detalhes
- Ícones informativos (📧, 📱, 🎂)
- Ações rápidas (Editar, Menu dropdown)

**Empty State:**
- Ilustração minimalista (contatos vazios)
- Mensagem: "Nenhum contato ainda"
- Texto de suporte: "Crie seu primeiro contato para começar"
- Botão CTA: "+ Criar Primeiro Contato"

---

### 4. ContactForm (Criar/Editar)

#### Layout
```
┌─────────────────────────────────────────────┐
│           HEADER (Azul Gradiente)          │
├─────────────────────────────────────────────┤
│                                             │
│  Novo Contato                              │
│  [Form fields com validação]                │
│                                             │
│  Nome*                                      │
│  [___________________________]               │
│  Máximo 255 caracteres                      │
│                                             │
│  Email*                                     │
│  [___________________________]               │
│  Formato: nome@dominio.com                  │
│                                             │
│  Telefone                                   │
│  [___________________________]               │
│  (Opcional) 10-20 dígitos                   │
│                                             │
│  Data de Nascimento                         │
│  [___________________________]               │
│  (Opcional) Apenas datas passadas           │
│                                             │
│  [Cancelar]  [Salvar Contato]               │
│                                             │
└─────────────────────────────────────────────┘
```

#### Validações Visuais

**Campo Válido:**
- Border verde suave
- Ícone ✓ verde à direita

**Campo Inválido:**
- Border vermelha
- Ícone ✗ vermelho à direita
- Mensagem de erro em vermelho abaixo

**Campo em Foco:**
- Border azul
- Shadow azul suave
- Placeholder escurece

#### Botões

**Cancelar:**
- Variante: Secondary (Cinza)
- Ação: Volta sem salvar

**Salvar Contato:**
- Variante: Primary (Azul)
- Estado Loading: Mostra spinner
- Mensagem: "Salvando..." durante submit

---

### 5. ContactDetail (Modal/View)

**Especificação:**
```
┌──────────────────────────────┐
│ João da Silva      [X Fechar] │  ← Header
├──────────────────────────────┤
│                              │
│ Email: joao@email.com        │
│ Telefone: (11) 98765-4321    │
│ Data de Nascimento: 15/01/1990│
│ Criado em: 09/07/2026        │
│ Atualizado em: 10/07/2026    │
│                              │
│ [Editar] [Deletar]  [Fechar] │
│                              │
└──────────────────────────────┘
```

---

### 6. DeleteConfirmation (Modal)

**Especificação:**
```
┌──────────────────────────────┐
│ ⚠️  Confirmar Exclusão        │
├──────────────────────────────┤
│                              │
│ Tem certeza que deseja       │
│ deletar João da Silva?       │
│                              │
│ Esta ação não pode ser       │
│ desfeita.                    │
│                              │
│ [Cancelar] [Deletar]         │
│                              │
└──────────────────────────────┘
```

**Cores:**
- Ícone: Amarelo (#F59E0B)
- Botão Deletar: Vermelho (#EF4444)
- Botão Cancelar: Cinza

---

## 🎬 Animações & Transições

### Transições Base
```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animações Específicas

**Fade In (Entrada de elementos):**
- Opacity: 0 → 1
- Duration: 300ms
- Easing: ease-out

**Slide Up (Modais):**
- Transform: translateY(20px) → translateY(0)
- Opacity: 0 → 1
- Duration: 400ms

**Scale Hover (Cards):**
- Transform: scale(1) → scale(1.02)
- Box-shadow aumenta
- Duration: 200ms

**Bounce (Botão CTA):**
- Pulsação suave contínua quando no hover
- Keyframes: 0% scale(1) → 50% scale(1.05) → 100% scale(1)

**Loading Spinner:**
- Rotação contínua 360° em 1s
- Cor: Azul principal
- Size: 24px

**Toast Notification:**
- Slide in: translateX(-100%) → 0
- Slide out: translateX(100%)
- Duration: 300ms enter/exit
- Auto-dismiss: 3000ms

---

## 📱 Responsividade

### Breakpoints

```
Mobile:     320px - 640px
Tablet:     641px - 1024px
Desktop:    1025px+
```

### Adaptações por Breakpoint

#### Mobile (320px - 640px)
- Cards em grid 1 coluna
- Header compacto (height 56px)
- Sidebar → Drawer (hamburger menu)
- Buttons: full-width ou tamanho small
- Font-size base reduzido 2%
- Padding reduzido 50%

#### Tablet (641px - 1024px)
- Cards em grid 2 colunas
- Header normal
- Sidebar vísível (colapsável)
- Buttons: tamanho médio
- Layout flexível

#### Desktop (1025px+)
- Cards em grid 3+ colunas
- Sidebar fixo
- Layout completo
- Buttons: tamanho grande
- Máx width: 1400px

---

## 🖼️ Imagens & Ícones

### Ícones

**Biblioteca:** React Icons (Feather + Hero Icons)
- Size padrão: 20px (nav), 24px (buttons), 32px (hero)
- Cor: Herda do contexto (azul, cinza, branco)

**Ícones Necessários:**
```
📧 Mail          → lucide-react: Mail
📱 Phone         → lucide-react: Phone
🎂 Birthday      → lucide-react: Cake
✏️ Edit          → lucide-react: Edit
🗑️ Delete        → lucide-react: Trash2
🔍 Search        → lucide-react: Search
🔗 Link          → lucide-react: Link
✓ Check         → lucide-react: Check
✕ Close         → lucide-react: X
⚠️ Warning       → lucide-react: AlertCircle
ℹ️ Info          → lucide-react: Info
🛑 Stop          → lucide-react: AlertTriangle
```

### Ilustrações

**Empty States:**
- Estilo: Minimalista, línhas finas
- Cores: Azul + Cinza
- Formato: SVG inline
- Exemplos:
  - Contatos vazios: Ilustração de pessoa com "+"
  - Erro 404: Ilustração de busca sem resultado

**Backgrounds Opcionais:**
- Padrão suave (ondulações) em cinza muito claro
- Gradiente sutil azul → branco
- Uso seletivo (hero section, modais)

---

## ✨ Efeitos & Micro-interações

### Hover Effects

**Cards:**
- Shadow aumenta: 0 1px 3px → 0 4px 12px
- Transform: scale(1.02)
- Border: torna-se azul claro

**Buttons:**
- Background escurece 10%
- Shadow adiciona azul
- Cursor: pointer

**Links:**
- Color: cinza → azul
- Underline: aparece ou anima

### Focus States (Acessibilidade)

**Inputs:**
- Border: 2px #0EA5E9
- Box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)
- Outline: none (custom)

**Botões:**
- Outline: 2px #0EA5E9
- Outline-offset: 2px

### Active States

**Cards/Menu Items:**
- Background: #F0F9FF (azul muito claro)
- Border-left: 4px #0EA5E9
- Font-weight: 600

---

## 🎯 Componentes Reutilizáveis

### Estrutura de Componentes (Atomic Design)

#### Atoms (Primitivos)
- Button
- Input
- Label
- Badge
- Icon
- Spinner
- Toast

#### Molecules (Compostos)
- FormField (Input + Label + Error)
- SearchBar
- Pagination
- DatePicker
- ConfirmDialog

#### Organisms (Complexos)
- Header
- Sidebar
- ContactCard
- ContactForm
- ContactList
- Modal

#### Templates
- HomePage
- FormPage
- DetailPage

---

## 📐 Grid & Layout

### Container Principal
```
Max-width: 1200px
Margin: auto
Padding: 0 16px (mobile), 0 24px (tablet), 0 32px (desktop)
```

### Grid de Cards
```
Desktop:  3 colunas
Tablet:   2 colunas
Mobile:   1 coluna
Gap:      16px
```

### Form Grid
```
1 coluna (full-width)
Margin-bottom: 16px entre fields
Label + Input (full-width)
```

---

## 📋 Design Tokens (Variáveis CSS)

```css
/* Colors */
--color-primary: #0EA5E9;
--color-primary-dark: #0284C7;
--color-primary-light: #38BDF8;
--color-primary-bg: #F0F9FF;

--color-gray-dark: #1F2937;
--color-gray-medium: #6B7280;
--color-gray-light: #D1D5DB;
--color-gray-bg: #F3F4F6;

--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #0EA5E9;

/* Typography */
--font-family: 'Inter', sans-serif;
--font-size-base: 16px;
--line-height-base: 1.6;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 999px;

/* Transitions */
--transition-base: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🚀 Implementação

### Tech Stack
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + CSS Modules + framer-motion
- **Icons:** React Icons (lucide-react)
- **Component Library:** Radix UI (acessibilidade)
- **Animations:** Framer Motion

### Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/          (Button, Input, Badge, etc)
│   │   ├── molecules/      (FormField, SearchBar, etc)
│   │   ├── organisms/      (Header, Sidebar, ContactCard, etc)
│   │   └── templates/      (Layouts)
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ContactForm.tsx
│   │   └── NotFound.tsx
│   ├── styles/
│   │   ├── tailwind.config.js
│   │   ├── globals.css
│   │   └── tokens.css
│   ├── hooks/
│   ├── services/
│   └── App.tsx
```

### Passos de Implementação

1. **Setup Design Tokens**
   - Configurar tailwind.config.js com cores personalizadas
   - Criar CSS variables para theme
   - Exportar tokens para reutilização

2. **Componentes Atoms**
   - Button com variantes
   - Input com validação
   - Badge, Icon, Spinner

3. **Componentes Molecules**
   - FormField (Input + Label + Error)
   - SearchBar com debounce
   - Pagination
   - DatePicker

4. **Componentes Organisms**
   - Header com navegação
   - ContactCard interativo
   - ContactForm com validação
   - ContactList com grid responsivo

5. **Páginas Completas**
   - HomePage
   - ContactFormPage
   - Integração com API

6. **Animações & Interações**
   - Transições de página
   - Hover effects
   - Modais com animação
   - Toasts

7. **Testes & Otimização**
   - Testes de componentes
   - Performance (Lighthouse > 90)
   - Acessibilidade (WCAG AA)
   - Responsividade

---

## ✅ Checklist de Design

- [ ] Todas as cores da paleta implementadas
- [ ] Tipografia coerente em toda app
- [ ] Espaçamento consistente
- [ ] Componentes reutilizáveis criados
- [ ] Animações suaves implementadas
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Acessibilidade verificada (WCAG AA)
- [ ] Dark mode opcionalmente suportado (futuro)
- [ ] Performance otimizada (Lighthouse)
- [ ] Ícones e ilustrações implementadas

---

## 📊 Critérios de Sucesso

### Visual
- ✅ Design coeso com paleta azul + cinza
- ✅ Interface moderna e invadora
- ✅ Componentes reutilizáveis e consistentes
- ✅ Animações suaves e elegantes

### UX
- ✅ Navegação intuitiva
- ✅ Feedback visual claro
- ✅ Acessibilidade WCAG AA
- ✅ Responsividade completa

### Performance
- ✅ Lighthouse score > 90
- ✅ Animações 60 FPS
- ✅ Carregamento < 3s
- ✅ Sem console errors

### Código
- ✅ Componentes TypeScript tipados
- ✅ Cobertura de testes > 80%
- ✅ ESLint + Prettier clean
- ✅ Documentação de componentes

---

## 🎬 Fluxo Visual (Storyboard)

### 1. Usuário Entra no App

```
Fade in Header (azul gradiente)
Fade in HomePage com cards
Empty state com ilustração
```

### 2. Criar Contato

```
Click "+ Novo Contato"
Modal slide up com form
Form fields com focus azul
Validação em tempo real com cores
```

### 3. Salvar Contato

```
Submit button → spinner
Form desativa
Loading toast
Success toast aparece
Card novo aparece com scale animation
```

### 4. Editar Contato

```
Click em card
Modal detalhe
Click editar
Form aparece pré-preenchido
Mesmas animações de criação
```

### 5. Deletar Contato

```
Click delete
Confirmation modal
Button vermelha
Se confirmar: card desaparece com fade
Success toast
```

---

## 📚 Referências de Inspiração

- **Figma Design System:** Sistema de cores + componentes
- **Dribble:** Inspiração visual (search: "modern contact manager")
- **Material Design 3:** Princípios de cores e sombras
- **Apple Design System:** Animações e transições suaves

---

## 🎯 Próximos Passos

1. **Aprovação do PRD** - Validar paleta, tipografia, componentes
2. **Design Tokens Setup** - Tailwind + CSS variables
3. **Componentes Base** - Atoms e Molecules
4. **Componentes Complexos** - Organisms
5. **Integração com API** - Conectar todas as páginas
6. **Testes de UI** - Verificar acessibilidade e performance
7. **Deploy & Feedback** - Iteração com usuários

---

**Autor:** Design Team  
**Aprovado por:** Product Manager  
**Última atualização:** 2026-07-10

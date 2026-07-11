# Guia de Integração - Design System

## ✅ O Que Foi Criado

### 1. Componentes Atoms (Base)
✅ `Button.tsx` - Botões com 5 variantes  
✅ `Input.tsx` - Campos de entrada com validação visual  
✅ `Badge.tsx` - Tags de status  
✅ `Spinner.tsx` - Indicadores de carregamento  

### 2. Componentes Molecules
✅ `FormField.tsx` - Campo de formulário completo  

### 3. Componentes Organisms
✅ `HeaderNew.tsx` - Cabeçalho com gradiente azul  
✅ `ContactCardNew.tsx` - Card de contato refatorado  

### 4. Páginas
✅ `HomePageNew.tsx` - HomePage com novo design  

### 5. Configurações
✅ `tailwind.config.js` - Colors, spacing, shadows  
✅ `index.css` - Global styles + CSS variables  
✅ `cn.ts` - Utility para class merging  

---

## 🚀 Próximos Passos

### Fase 1: Testar os Novos Componentes (1 dia)

**1. Verificar se lucide-react está instalado:**
```bash
npm list lucide-react
```

Se não estiver:
```bash
npm install lucide-react
```

**2. Testar a HomePage nova:**
```bash
# Editar App.tsx para importar HomePageNew
import { HomePageNew } from './pages/HomePageNew';

// Usar na rota
<Route path="/" element={<HomePageNew />} />
```

**3. Verificar no navegador:**
- Verificar cores (azul + cinza)
- Testar responsividade (mobile, tablet, desktop)
- Testar hover effects e animações
- Testar estados de loading

### Fase 2: Refatorar Componentes Existentes (2-3 dias)

**Estrutura atual vs nova:**
```
frontend/src/components/
├── Common/          → Integrar em atoms/molecules
├── ContactCard/     → Usar ContactCardNew.tsx
├── ContactForm/     → Refatorar com novos componentes
├── ContactList/     → Usar HomePageNew como referência
├── FilterBar/       → Manter, aplicar novos estilos
├── Layout/          → Usar Header novo
├── Modal/           → Aplicar novos estilos
├── Pagination/      → Manter, aplicar novos estilos
├── SearchBar/       → Substituir por Input novo
├── SortOptions/     → Aplicar novos estilos
└── Toast/           → Aplicar novos estilos
```

**Checklist de Refatoração:**

- [ ] ContactForm.tsx
  - Usar `FormField` para cada campo
  - Usar novo `Button` com variantes
  - Adicionar validação visual em tempo real
  - Aplicar classes Tailwind do design system

- [ ] ContactList.tsx
  - Usar grid com Tailwind (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
  - Usar `ContactCardNew.tsx`
  - Aplicar novo layout

- [ ] Modal.tsx
  - Aplicar novo visual
  - Usar animações smooth
  - Aplicar box-shadow correto

- [ ] FilterBar.tsx
  - Refatorar com Input novo
  - Aplicar novo Button
  - Melhorar UX

- [ ] SearchBar.tsx
  - Usar Input novo com ícone
  - Manter debounce
  - Aplicar novo styling

### Fase 3: Testes (1 dia)

**1. Testes Visuais:**
```bash
npm run dev
# Verificar todas as páginas
# Testar em diferentes tamanhos de tela
# Verificar hover states
```

**2. Testes de Responsividade:**
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)

**3. Testes de Acessibilidade:**
```bash
# Instalar axe DevTools (Chrome extension)
# Verificar contrast ratios
# Verificar focus states
# Verificar keyboard navigation
```

**4. Testes de Performance:**
```bash
npm run build
# npm i -g serve (se não tiver)
serve -s dist
# Abrir DevTools > Performance
# Verificar Lighthouse
```

---

## 📋 Estrutura de Pastas Proposta

```
frontend/src/
├── components/
│   ├── atoms/              ← Primitivos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Icon.tsx        ← wrapper para lucide
│   │   └── index.ts
│   ├── molecules/          ← Compostos
│   │   ├── FormField.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── DatePicker.tsx
│   │   └── index.ts
│   ├── organisms/          ← Complexos
│   │   ├── Header.tsx
│   │   ├── ContactCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ContactList.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── Home.tsx            ← Usar design novo
│   ├── ContactForm.tsx
│   └── NotFound.tsx
├── services/               ← API
├── hooks/
├── context/
├── types/
├── utils/
│   ├── cn.ts
│   ├── constants.ts
│   └── validation.ts
├── styles/
│   └── index.css
└── App.tsx
```

---

## 🔄 Migrando Componentes Existentes

### Exemplo: Refatorar ContactForm.tsx

**Antes:**
```tsx
const ContactForm = () => {
  return (
    <form>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <button>Salvar</button>
    </form>
  );
};
```

**Depois:**
```tsx
import { FormField } from '../molecules';
import { Button } from '../atoms';

const ContactForm = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form>
      <FormField
        label="Nome"
        type="text"
        error={errors.name}
        hint="Máximo 255 caracteres"
        required
      />
      <FormField
        label="Email"
        type="email"
        error={errors.email}
        hint="Use um email válido"
        required
      />
      <Button variant="primary" size="lg" isLoading={isLoading}>
        Salvar Contato
      </Button>
    </form>
  );
};
```

---

## 💻 Exemplos de Uso

### Exemplo 1: HomePage Simples

```tsx
import { HomePageNew } from './pages/HomePageNew';

function App() {
  return <HomePageNew />;
}

export default App;
```

### Exemplo 2: Formulário com Validação

```tsx
import { FormField } from './components/molecules';
import { Button } from './components/atoms';
import { useState } from 'react';

const MyForm = () => {
  const [data, setData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call
      await saveData(data);
    } catch (err) {
      setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Nome"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        error={errors.name}
        required
      />
      <FormField
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        error={errors.email}
        required
      />
      <Button
        variant="primary"
        size="lg"
        isLoading={isLoading}
      >
        Enviar
      </Button>
    </form>
  );
};
```

### Exemplo 3: Grid de Contatos

```tsx
import { ContactCard } from './components/organisms';

const ContactList = ({ contacts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

---

## 🎨 Checklist de Implementação

### Setup Inicial
- [x] Tailwind config com cores personalizadas
- [x] Global CSS com variables e estilos base
- [x] Utility `cn` para class merging
- [ ] Instalar lucide-react (se necessário)

### Componentes Atoms
- [x] Button (com 5 variantes)
- [x] Input (com validação visual)
- [x] Badge (com 5 variantes)
- [x] Spinner (com 3 tamanhos)
- [ ] Icon (wrapper lucide-react)
- [ ] Select (field customizado)
- [ ] Textarea (para descrições)

### Componentes Molecules
- [x] FormField (input + label + error)
- [ ] SearchBar (com debounce)
- [ ] Pagination (com números)
- [ ] DatePicker (customizado)
- [ ] ConfirmDialog (modal confirmação)
- [ ] Toast (notificações)

### Componentes Organisms
- [x] Header (com gradiente)
- [x] ContactCard (com ações)
- [ ] ContactForm (completo)
- [ ] ContactList (com grid)
- [ ] Sidebar (opcional)

### Páginas
- [x] HomePageNew (referência)
- [ ] ContactFormPage
- [ ] DetailPage
- [ ] NotFoundPage

### Documentação
- [x] DESIGN_SYSTEM.md
- [x] INTEGRATION_GUIDE.md (este arquivo)
- [ ] Component Storybook (futuro)

---

## 🧪 Testes

### Testes Visuais (Manual)

```bash
npm run dev
```

Checklist:
- [ ] Cores corretas (azul + cinza)
- [ ] Tipografia hierárquica
- [ ] Espaçamento consistente
- [ ] Hover states funcionam
- [ ] Focus states visíveis
- [ ] Animações suaves
- [ ] Responsividade em 3+ tamanhos

### Testes Automatizados (Vitest + React Testing Library)

```bash
npm run test
```

Verificar:
- [ ] Componentes renderizam
- [ ] Props funcionam
- [ ] Eventos disparam
- [ ] Validações funcionam

### Performance (Lighthouse)

```bash
npm run build
npx serve -s dist
```

Alvo:
- [ ] Lighthouse > 90
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

---

## 🔗 Links Úteis

- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

---

## ⚡ Troubleshooting

### Problema: Cores não aparecem
**Solução:** Verificar `tailwind.config.js` foi alterado corretamente
```bash
npm run dev  # Reiniciar dev server
```

### Problema: Ícones lucide não aparecem
**Solução:** Verificar se lucide-react está instalado
```bash
npm install lucide-react
```

### Problema: Classes Tailwind não funcionam
**Solução:** Verificar se Tailwind está importado em `index.css`
```css
@import 'tailwindcss';
```

### Problema: Animações não suaves
**Solução:** Verificar se `transition-all duration-200` está aplicado
```tsx
className="transition-all duration-200"
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar DESIGN_SYSTEM.md
2. Verificar exemplos em HomePageNew.tsx
3. Conferir Tailwind docs
4. Verificar console para erros

---

**Última atualização:** 2026-07-10  
**Versão:** 1.0.0  
**Status:** Pronto para integração

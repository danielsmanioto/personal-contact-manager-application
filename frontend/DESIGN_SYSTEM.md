# Design System - Personal Contact Manager

## 🎨 Visão Geral

Este documento descreve o sistema de design implementado no frontend do Personal Contact Manager. O design utiliza uma paleta de **Azul Claro + Cinza**, com componentes reutilizáveis e um visual moderno e invador.

---

## 📐 Arquitetura de Componentes

Seguimos a metodologia **Atomic Design**:

### Atoms (Primitivos)
Componentes base e isolados:
- **Button** - Botões com variantes (primary, secondary, success, danger, ghost)
- **Input** - Campo de entrada com validação visual
- **Badge** - Tags/etiquetas para status
- **Spinner** - Indicador de carregamento

### Molecules (Compostos)
Combinações de atoms:
- **FormField** - Input + Label + Error validação
- **SearchBar** - Barra de busca com ícone
- **Pagination** - Controle de paginação
- **DatePicker** - Seletor de data

### Organisms (Complexos)
Componentes completos e independentes:
- **Header** - Cabeçalho com gradiente azul
- **ContactCard** - Card de contato com ações
- **ContactForm** - Formulário de criação/edição
- **ContactList** - Lista grid de contatos

---

## 🎯 Paleta de Cores

### Primárias (Azul Claro)
```
#0EA5E9 - Azul Principal (Ações)
#0284C7 - Azul Escuro (Hover)
#38BDF8 - Azul Claro (Background)
#F0F9FF - Azul Muito Claro (BG leve)
```

### Secundárias (Cinza)
```
#1F2937 - Cinza Escuro (Texto)
#6B7280 - Cinza Médio (Texto secundário)
#D1D5DB - Cinza Claro (Borders)
#F3F4F6 - Cinza Muito Claro (Background)
```

### Estados
```
#10B981 - Verde (Sucesso)
#F59E0B - Amarelo (Aviso)
#EF4444 - Vermelho (Erro)
```

---

## 📝 Usando os Componentes

### Button

```tsx
import { Button } from './components/atoms';

// Variante primária (padrão)
<Button variant="primary" size="md">Salvar</Button>

// Variante secundária
<Button variant="secondary">Cancelar</Button>

// Com ícone e loading
<Button icon={<EditIcon />} isLoading={isLoading}>Editar</Button>

// Variantes de tamanho
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Estados
<Button variant="success">Confirmar</Button>
<Button variant="danger">Deletar</Button>
<Button variant="ghost">Link</Button>
```

### Input

```tsx
import { Input } from './components/atoms';

// Básico
<Input placeholder="Digite seu nome..." />

// Com label e validação
<Input
  label="Email"
  type="email"
  error="Email inválido"
  hint="Use um email válido"
  required
/>

// Com ícone
<Input
  label="Buscar"
  icon={<SearchIcon />}
  placeholder="Buscar..."
/>
```

### Badge

```tsx
import { Badge } from './components/atoms';

<Badge variant="primary">Primary</Badge>
<Badge variant="success">Sucesso</Badge>
<Badge variant="warning">Aviso</Badge>
<Badge variant="error">Erro</Badge>
<Badge variant="info">Informação</Badge>
```

### Spinner

```tsx
import { Spinner } from './components/atoms';

<Spinner size="sm" color="primary" />
<Spinner size="md" color="white" />
<Spinner size="lg" />
```

### FormField

```tsx
import { FormField } from './components/molecules';

<FormField
  label="Nome"
  placeholder="Seu nome completo"
  error={errors.name}
  hint="Máximo 255 caracteres"
  required
/>
```

### ContactCard

```tsx
import { ContactCard } from './components/organisms';

<ContactCard
  contact={contact}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Header

```tsx
import { Header } from './components/organisms/HeaderNew';

<Header />
```

---

## 🎨 Tailwind Classes Disponíveis

Todas as cores estão configuradas no `tailwind.config.js`:

```tsx
// Cores primárias
className="text-sky-500 bg-sky-50 border-sky-600"

// Cores secundárias
className="text-gray-900 bg-gray-100 border-gray-400"

// Sombras
className="shadow-sm hover:shadow-md active:shadow-lg"

// Border radius
className="rounded-sm rounded-md rounded-lg rounded-full"

// Transições
className="transition-all duration-200"
```

---

## 💡 Padrões de Uso

### Validação em Tempo Real

```tsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  setValue(val);
  
  if (val.length > 255) {
    setError('Máximo 255 caracteres');
  } else {
    setError('');
  }
};

return (
  <Input
    value={value}
    onChange={handleChange}
    error={error}
    placeholder="Digite..."
  />
);
```

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await saveContact(formData);
    showSuccessToast('Contato salvo!');
  } catch (err) {
    showErrorToast('Erro ao salvar');
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button
    onClick={handleSubmit}
    isLoading={isLoading}
    disabled={isLoading}
  >
    Salvar Contato
  </Button>
);
```

### Grid Responsivo

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {contacts.map(contact => (
    <ContactCard key={contact.id} contact={contact} />
  ))}
</div>
```

---

## 🌙 Tema Escuro (Futuro)

O sistema é preparado para suportar tema escuro. As cores estão em CSS variables:

```css
:root {
  --color-primary: #0EA5E9;
  --color-gray-dark: #1F2937;
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #38BDF8;
    --color-gray-dark: #E2E8F0;
    /* ... */
  }
}
```

---

## 📱 Responsividade

Breakpoints Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Uso:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 coluna mobile, 2 tablet, 3 desktop */}
</div>

<Button size="sm" className="md:size-md lg:size-lg">
  Responsivo
</Button>
```

---

## ♿ Acessibilidade

Todos os componentes incluem:
- Focus states com outline azul
- Atributos `aria-*` quando necessário
- Labels associados aos inputs
- Contrast ratios WCAG AA

```tsx
<Input
  id="email"
  label="Email"
  aria-label="Email do contato"
  aria-required="true"
  required
/>
```

---

## 🚀 Performance

### CSS Classes Otimizadas
- Uso de Tailwind classes
- Evitar inline styles
- Lazy loading de componentes

### Animações
- Transições de 200ms (smooth)
- Usar `transform` para melhor performance
- Evitar animações em scroll

```tsx
// ✅ Bom - Transform é rápido
<div className="hover:scale-105 hover:-translate-y-1 transition-all">
  Card
</div>

// ❌ Evitar - Animações custosas
<div style={{animation: 'complex 3s ease-in-out infinite'}}>
  Card
</div>
```

---

## 📚 Exemplo Completo

Veja `HomePageNew.tsx` para um exemplo completo de página usando o design system:

```bash
frontend/src/pages/HomePageNew.tsx
```

---

## 🔄 Implementando Novos Componentes

1. Criar arquivo em `components/atoms/` (ou molecules/organisms)
2. Usar tipos TypeScript
3. Aplicar classes Tailwind do design system
4. Exportar em `index.ts` da pasta
5. Documentar uso aqui

---

## 📝 Checklist para Componentes

- [ ] TypeScript tipado
- [ ] Tailwind classes do design system
- [ ] Focus states acessíveis
- [ ] Transições suaves (200ms)
- [ ] Testes unitários
- [ ] Documentado neste arquivo
- [ ] Reutilizável em múltiplos contextos

---

**Última atualização:** 2026-07-10  
**Versão:** 1.0.0  
**Status:** Pronto para uso

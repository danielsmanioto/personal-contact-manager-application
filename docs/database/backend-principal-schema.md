# Modelagem de Banco de Dados - Backend Principal

## Visão Geral

O sistema de **Contact Manager** utiliza um banco de dados PostgreSQL com uma única tabela principal `contacts` para gerenciar contactos pessoais. O design segue padrões de **soft delete** (exclusão lógica) onde contatos não são fisicamente removidos, mas marcados como deletados.

**Database:** `contact_manager`  
**Engine:** PostgreSQL 15+  
**Version Control:** Flyway (migrations)

---

## Tabela Principal: `contacts`

Armazena todos os contactos pessoais com suporte a soft delete.

### Estrutura da Tabela

| Coluna | Tipo | Restrições | Descrição |
|--------|------|-----------|-----------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único (auto-gerado) |
| `name` | VARCHAR(255) | NOT NULL | Nome completo do contacto (1-255 caracteres) |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email do contacto (único, válido RFC 5322) |
| `phone` | VARCHAR(20) | NULLABLE | Número de telefone (10-20 dígitos numéricos ou vazio) |
| `birth_date` | DATE | NULLABLE | Data de nascimento (apenas datas passadas) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data/hora de criação (imutável) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data/hora da última atualização (auto-atualizado) |
| `deleted_at` | TIMESTAMP | NULLABLE | Data/hora de exclusão lógica (NULL = ativo) |

### Regras de Validação no Banco

```sql
-- id: Gerado automaticamente como UUID
-- name: Obrigatório, 1-255 caracteres, não pode ser em branco
-- email: Obrigatório, único no banco, válido (RFC 5322)
-- phone: Opcional, padrão ^[0-9]{10,20}$|^$ (10-20 dígitos ou vazio)
-- birth_date: Opcional, deve ser no passado ou presente
-- created_at: Imutável após criação
-- updated_at: Auto-atualizado em cada modificação
-- deleted_at: NULL para activos, TIMESTAMP para deletados
```

### Exemplo de Linha

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "5511987654321",
  "birth_date": "1990-05-15",
  "created_at": "2026-01-10T14:30:00",
  "updated_at": "2026-07-12T09:15:30",
  "deleted_at": null
}
```

---

## Índices

Índices criados para otimização de queries, todos filtrando contactos **activos** (deleted_at IS NULL):

| Índice | Coluna(s) | Descrição |
|--------|-----------|-----------|
| `idx_contacts_email` | email | Busca rápida por email (com soft delete) |
| `idx_contacts_name` | name | Busca rápida por nome (com soft delete) |
| `idx_contacts_birth_date` | birth_date | Filtro por data de nascimento (com soft delete) |
| `idx_contacts_deleted_at` | deleted_at | Otimiza WHERE deleted_at IS NULL |

### Queries de Exemplo

```sql
-- Listar todos os contactos activos (sem deleted_at)
SELECT * FROM contacts WHERE deleted_at IS NULL;

-- Buscar por email (usa idx_contacts_email)
SELECT * FROM contacts WHERE email = 'joao@example.com' AND deleted_at IS NULL;

-- Buscar por nome (usa idx_contacts_name)
SELECT * FROM contacts WHERE name ILIKE '%João%' AND deleted_at IS NULL;

-- Filtrar por data de nascimento (usa idx_contacts_birth_date)
SELECT * FROM contacts 
WHERE birth_date BETWEEN '1990-01-01' AND '2000-12-31' 
AND deleted_at IS NULL;

-- Soft delete (não remove, apenas marca como deletado)
UPDATE contacts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?;
```

---

## Soft Delete Strategy

### O que é Soft Delete?

Contactos não são fisicamente removidos do banco. Em vez disso:
- Um timestamp `deleted_at` é definido
- `NULL` = contacto ativo
- `TIMESTAMP` = contacto deletado naquela data

### Por quê usar Soft Delete?

✅ **Rastreabilidade**: Histórico completo preservado  
✅ **Recuperação**: Contactos podem ser restaurados  
✅ **Auditoria**: Quando foi deletado é registado  
✅ **Referência**: Dados não são perdidos se houver referências externas  
✅ **Performance**: DELETE mais rápido (UPDATE vs DELETE)

### Como Restaurar

```java
// ContactService.restore(UUID id)
contact.setDeletedAt(null);
contactRepository.save(contact);
```

---

## Schema SQL Completo

```sql
-- Create contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL
);

-- Create indexes for performance optimization
-- Search by email (soft delete filter)
CREATE INDEX idx_contacts_email ON contacts(email) WHERE deleted_at IS NULL;

-- Search by name (soft delete filter)
CREATE INDEX idx_contacts_name ON contacts(name) WHERE deleted_at IS NULL;

-- Filter by birth date (soft delete filter)
CREATE INDEX idx_contacts_birth_date ON contacts(birth_date) WHERE deleted_at IS NULL;

-- Soft delete filtering (commonly used WHERE clause)
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at);

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'Personal contacts with soft delete support';
COMMENT ON COLUMN contacts.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN contacts.name IS 'Contact full name (1-255 chars, required)';
COMMENT ON COLUMN contacts.email IS 'Contact email (unique, required, RFC 5322)';
COMMENT ON COLUMN contacts.phone IS 'Contact phone number (10-20 digits, optional)';
COMMENT ON COLUMN contacts.birth_date IS 'Date of birth (optional, past dates only)';
COMMENT ON COLUMN contacts.created_at IS 'Creation timestamp (auto-set)';
COMMENT ON COLUMN contacts.updated_at IS 'Last update timestamp (auto-updated)';
COMMENT ON COLUMN contacts.deleted_at IS 'Soft delete timestamp (NULL = active)';
```

---

## Versioning da Estrutura

| Version | Arquivo | Descrição | Data |
|---------|---------|-----------|------|
| 1 | `V1__init.sql` | Schema inicial com tabela contacts e índices | 2026-01-10 |

### Para Adicionar Novas Migrations

1. Criar arquivo: `backend/src/main/resources/db/migration/V2__descricao.sql`
2. Flyway roda automaticamente no startup
3. Verificar: `mvn flyway:info`

---

## Relacionamentos Futuros

Para futuras expansões, planejamos:

- **Tabela `contact_addresses`**: Múltiplos endereços por contacto
- **Tabela `contact_groups`**: Agrupar contactos em categorias
- **Tabela `contact_notes`**: Notas/observações por contacto
- **Tabela `audit_log`**: Rastreamento de alterações

---

## Performance & Constraints

- **Max Rows**: ~10M registros (PostgreSQL padrão)
- **Max Storage**: ~500GB (com índices)
- **Average Query Time**: < 50ms (com índices)
- **Concurrent Connections**: 100 (default pool)
- **Max Email Length**: 255 caracteres
- **Max Name Length**: 255 caracteres
- **Phone Format**: 10-20 dígitos numéricos

---

## Backup & Restore

### Backup

```bash
# Dump da database
pg_dump -U postgres -d contact_manager > backup_$(date +%Y%m%d).sql

# Desde Docker
docker-compose exec postgres pg_dump -U postgres -d contact_manager > backup.sql
```

### Restore

```bash
# Restaurar de backup
psql -U postgres -d contact_manager < backup_$(date +%Y%m%d).sql

# Desde Docker
docker-compose exec -T postgres psql -U postgres -d contact_manager < backup.sql
```

---

## Conexão & Acesso

### Development (Local)

```
Host: localhost
Port: 5432
Database: contact_manager
User: postgres
Password: postgres
```

### Docker Compose

```
Host: postgres
Port: 5432
Database: contact_manager
User: postgres
Password: postgres
```

### Verificar Status

```bash
# Conectar ao banco
psql -h localhost -U postgres -d contact_manager

# Ver tabelas
\dt

# Ver índices
\di

# Ver estrutura de tabela
\d contacts
```

---

## Migration History

### V1__init.sql (Current)

- ✅ Tabela `contacts` com 8 colunas
- ✅ UUID como primary key
- ✅ Soft delete via `deleted_at`
- ✅ 4 índices de performance
- ✅ Comentários de documentação

### Próximas Versões

- V2__add_categories.sql (planejado)
- V3__add_notes.sql (planejado)
- V4__add_addresses.sql (planejado)

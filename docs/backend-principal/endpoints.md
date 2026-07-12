# API REST - Backend Principal

## Visão Geral

**Base URL:** `http://localhost:8081/api`

**Versão:** 1.0  
**Formato:** REST JSON  
**Autenticação:** Nenhuma (sem token/API key requerido)  
**Content-Type:** `application/json`  
**Status:** ✅ Produção

---

## 🔗 Acessar Documentação Interativa

### Swagger UI (OpenAPI)

Documentação interativa com possibilidade de testar endpoints diretamente:

```
http://localhost:8081/swagger-ui.html
```

**Recursos:**
- ✅ Visualizar todos os endpoints
- ✅ Ver schemas de request/response
- ✅ Testar requests diretamente
- ✅ Ver códigos HTTP retornados
- ✅ Download OpenAPI JSON

### API JSON Schema

OpenAPI spec em formato JSON (para importar em ferramentas):

```
http://localhost:8081/v3/api-docs
```

### Health Check

Verificar status da API:

```
http://localhost:8081/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    }
  }
}
```

---

## 📝 Endpoints por Função

### 1. Listar Contactos (Paginado)

**Endpoint:**
```
GET /api/contacts
```

**Descrição:** Retorna lista paginada de contactos activos (não deletados)

**Parâmetros Query:**

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-----------|---------|-----------|
| `page` | integer | Não | `0` | Número da página (0-indexed) |
| `size` | integer | Não | `10` | Itens por página (max 100) |

**Exemplo de Requisição:**

```bash
# Página 1 (0-indexed), 10 itens
curl -X GET "http://localhost:8081/api/contacts?page=0&size=10"

# Página 2, 20 itens
curl -X GET "http://localhost:8081/api/contacts?page=1&size=20"
```

**Resposta (200 OK):**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "5511987654321",
      "birthDate": "1990-05-15",
      "createdAt": "2026-01-10T14:30:00",
      "updatedAt": "2026-07-12T09:15:30"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Maria Santos",
      "email": "maria@example.com",
      "phone": "5511912345678",
      "birthDate": "1995-03-20",
      "createdAt": "2026-02-15T10:00:00",
      "updatedAt": "2026-06-20T15:45:00"
    }
  ],
  "currentPage": 0,
  "pageSize": 10,
  "totalElements": 42,
  "totalPages": 5
}
```

**Códigos de Resposta:**
- `200 OK` - Contactos recuperados com sucesso
- `400 Bad Request` - Parâmetros inválidos (page/size)

---

### 2. Obter Contacto por ID

**Endpoint:**
```
GET /api/contacts/{id}
```

**Descrição:** Retorna detalhes de um contacto específico

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `id` | UUID | Sim | Identificador único do contacto |

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000"
```

**Resposta (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "5511987654321",
  "birthDate": "1990-05-15",
  "createdAt": "2026-01-10T14:30:00",
  "updatedAt": "2026-07-12T09:15:30"
}
```

**Códigos de Resposta:**
- `200 OK` - Contacto encontrado
- `404 Not Found` - Contacto não existe ou foi deletado

---

### 3. Criar Contacto

**Endpoint:**
```
POST /api/contacts
```

**Descrição:** Cria um novo contacto

**Body (JSON):**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "5511987654321",
  "birthDate": "1990-05-15"
}
```

**Validações Obrigatórias:**

| Campo | Regra | Exemplo |
|-------|-------|---------|
| `name` | 1-255 caracteres, não pode ser vazio | "João Silva" |
| `email` | Válido RFC 5322, único no banco | "joao@example.com" |
| `phone` | 10-20 dígitos numéricos (opcional) | "5511987654321" |
| `birthDate` | ISO 8601 (YYYY-MM-DD), passado/presente (opcional) | "1990-05-15" |

**Exemplo de Requisição:**

```bash
curl -X POST "http://localhost:8081/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "5511987654321",
    "birthDate": "1990-05-15"
  }'
```

**Resposta (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "5511987654321",
  "birthDate": "1990-05-15",
  "createdAt": "2026-07-12T10:30:00",
  "updatedAt": "2026-07-12T10:30:00"
}
```

**Códigos de Resposta:**
- `201 Created` - Contacto criado com sucesso
- `400 Bad Request` - Validação falhou (ver detalhes na resposta)
- `409 Conflict` - Email já existe

**Exemplo de Erro (400):**

```json
{
  "timestamp": "2026-07-12T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "name": "Name is required and cannot be blank",
    "email": "Email must be in valid format (RFC 5322)",
    "phone": "Phone must be 10-20 digits or empty"
  }
}
```

---

### 4. Atualizar Contacto

**Endpoint:**
```
PUT /api/contacts/{id}
```

**Descrição:** Atualiza um contacto existente

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `id` | UUID | Sim | Identificador do contacto |

**Body (JSON):**

```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "phone": "5511999999999",
  "birthDate": "1990-05-15"
}
```

**Validações:** Mesmas do POST (create)

**Exemplo de Requisição:**

```bash
curl -X PUT "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com",
    "phone": "5511999999999",
    "birthDate": "1990-05-15"
  }'
```

**Resposta (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "phone": "5511999999999",
  "birthDate": "1990-05-15",
  "createdAt": "2026-01-10T14:30:00",
  "updatedAt": "2026-07-12T10:45:00"
}
```

**Códigos de Resposta:**
- `200 OK` - Contacto atualizado com sucesso
- `400 Bad Request` - Validação falhou
- `404 Not Found` - Contacto não existe
- `409 Conflict` - Email já existe em outro contacto

---

### 5. Deletar Contacto (Soft Delete)

**Endpoint:**
```
DELETE /api/contacts/{id}
```

**Descrição:** Soft delete - marca contacto como deletado (não remove do BD)

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `id` | UUID | Sim | Identificador do contacto |

**Exemplo de Requisição:**

```bash
curl -X DELETE "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000"
```

**Resposta (204 No Content):**

```
(sem body)
```

**Importante:** Contacto é marcado como deletado (deleted_at = CURRENT_TIMESTAMP), mas permanece no banco para auditoria.

**Códigos de Resposta:**
- `204 No Content` - Contacto deletado com sucesso
- `404 Not Found` - Contacto não existe ou já foi deletado

---

### 6. Buscar Contacto por Nome/Email

**Endpoint:**
```
GET /api/contacts/search?q=termo
```

**Descrição:** Busca contactos por nome ou email (case-insensitive)

**Parâmetros Query:**

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-----------|---------|-----------|
| `q` | string | Sim | - | Termo de busca (nome ou email) |
| `page` | integer | Não | `0` | Página (0-indexed) |
| `size` | integer | Não | `10` | Itens por página |

**Exemplo de Requisição:**

```bash
# Buscar por nome
curl -X GET "http://localhost:8081/api/contacts/search?q=João&page=0&size=10"

# Buscar por email
curl -X GET "http://localhost:8081/api/contacts/search?q=joao@example.com&page=0&size=10"

# Busca parcial
curl -X GET "http://localhost:8081/api/contacts/search?q=silva"
```

**Resposta (200 OK):**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "5511987654321",
      "birthDate": "1990-05-15",
      "createdAt": "2026-01-10T14:30:00",
      "updatedAt": "2026-07-12T09:15:30"
    }
  ],
  "currentPage": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

**Códigos de Resposta:**
- `200 OK` - Resultados de busca (pode ser vazio)
- `400 Bad Request` - Parâmetro q não fornecido

---

### 7. Filtrar Contacto por Data de Nascimento

**Endpoint:**
```
GET /api/contacts/filter?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
```

**Descrição:** Filtra contactos por intervalo de data de nascimento

**Parâmetros Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `fromDate` | string | Sim | Data inicial (ISO 8601: YYYY-MM-DD) |
| `toDate` | string | Sim | Data final (ISO 8601: YYYY-MM-DD) |
| `page` | integer | Não | Página (0-indexed, default 0) |
| `size` | integer | Não | Itens por página (default 10) |

**Exemplo de Requisição:**

```bash
# Contactos nascidos entre 1990 e 2000
curl -X GET "http://localhost:8081/api/contacts/filter?fromDate=1990-01-01&toDate=2000-12-31"

# Com paginação
curl -X GET "http://localhost:8081/api/contacts/filter?fromDate=1990-01-01&toDate=2000-12-31&page=0&size=20"
```

**Resposta (200 OK):**

```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "5511987654321",
      "birthDate": "1990-05-15",
      "createdAt": "2026-01-10T14:30:00",
      "updatedAt": "2026-07-12T09:15:30"
    }
  ],
  "currentPage": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

**Códigos de Resposta:**
- `200 OK` - Resultados do filtro (pode ser vazio)
- `400 Bad Request` - Datas em formato inválido

---

## 🔄 Fluxo de Exemplo Completo

### 1. Criar um novo contacto

```bash
curl -X POST "http://localhost:8081/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "5511912345678",
    "birthDate": "1995-03-20"
  }'
```

Resposta: `201 Created` com `id`: `550e8400-e29b-41d4-a716-446655440000`

### 2. Obter contacto criado

```bash
curl -X GET "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000"
```

### 3. Atualizar contacto

```bash
curl -X PUT "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva Santos",
    "email": "maria.silva@example.com",
    "phone": "5511999999999",
    "birthDate": "1995-03-20"
  }'
```

### 4. Buscar contacto

```bash
curl -X GET "http://localhost:8081/api/contacts/search?q=Maria"
```

### 5. Deletar contacto

```bash
curl -X DELETE "http://localhost:8081/api/contacts/550e8400-e29b-41d4-a716-446655440000"
```

---

## 📊 Status Codes Resumo

| Código | Descrição | Quando Retorna |
|--------|-----------|---------------|
| `200 OK` | Sucesso | GET, PUT com dados válidos |
| `201 Created` | Criado com sucesso | POST com dados válidos |
| `204 No Content` | Sem conteúdo | DELETE com sucesso |
| `400 Bad Request` | Requisição inválida | Parâmetros/body malformados, validação falhou |
| `404 Not Found` | Não encontrado | ID não existe, contacto foi deletado |
| `409 Conflict` | Conflito | Email já existe em outro contacto |

---

## 🔒 Considerações de Segurança

- ✅ **Validação**: Todos os inputs são validados (Jakarta Bean Validation)
- ✅ **Email Único**: Duplicate constraint na database
- ✅ **Soft Delete**: Dados são preservados para auditoria
- ✅ **Timestamps**: Rastreamento completo de criação/atualização
- ⚠️ **CORS**: Configurado para localhost (desenvolvimento)
- ⚠️ **Autenticação**: Não implementada (adicionar conforme necessário)

---

## 🚀 Performance

**Latência Média:**
- GET (list): < 50ms
- GET (by id): < 20ms
- POST: < 100ms
- PUT: < 100ms
- DELETE: < 50ms
- Search: < 100ms
- Filter: < 100ms

**Max Pagina:**
- Default: 10 itens/página
- Max: 100 itens/página

---

## 📋 Campos de Resposta

### ContactResponse

```json
{
  "id": "UUID",
  "name": "string (1-255)",
  "email": "string (RFC 5322)",
  "phone": "string (10-20 dígitos ou null)",
  "birthDate": "YYYY-MM-DD ou null",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### PaginatedResponse

```json
{
  "content": [ContactResponse, ...],
  "currentPage": "integer (0-indexed)",
  "pageSize": "integer",
  "totalElements": "integer",
  "totalPages": "integer"
}
```

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:8081/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8081/v3/api-docs
- **Health Check:** http://localhost:8081/actuator/health
- **Base URL:** http://localhost:8081/api

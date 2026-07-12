# API REST - Alert Service

## Visão Geral

**Base URL:** `http://localhost:8082/api`

**Versão:** 1.0  
**Formato:** REST JSON  
**Database:** MongoDB  
**Status:** ✅ Produção

---

## 🔗 Acessar Documentação Interativa

### Swagger UI (OpenAPI)

```
http://localhost:8082/swagger-ui.html
```

### OpenAPI JSON

```
http://localhost:8082/v3/api-docs
```

### Health Check

```
http://localhost:8082/actuator/health
```

---

## 📝 Endpoints

### 1. Criar Alerta

**Endpoint:**
```
POST /api/alerts
```

**Descrição:** Cria um novo alerta para um contacto

**Body (JSON):**

```json
{
  "contactId": "550e8400-e29b-41d4-a716-446655440000",
  "contactName": "João Silva",
  "contactEmail": "joao@example.com",
  "alertType": "CREATE",
  "message": "Novo contacto criado com sucesso"
}
```

**Validações:**

| Campo | Regra | Exemplo |
|-------|-------|---------|
| `contactId` | Obrigatório, UUID string | "550e8400-e29b-41d4-a716-446655440000" |
| `contactName` | Obrigatório, não vazio | "João Silva" |
| `contactEmail` | Obrigatório, válido | "joao@example.com" |
| `alertType` | Obrigatório (CREATE, UPDATE, DELETE) | "CREATE" |
| `message` | Obrigatório, não vazio | "Novo contacto criado" |

**Exemplo de Requisição:**

```bash
curl -X POST "http://localhost:8082/api/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "contactName": "João Silva",
    "contactEmail": "joao@example.com",
    "alertType": "CREATE",
    "message": "Novo contacto criado com sucesso"
  }'
```

**Resposta (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "contactId": "550e8400-e29b-41d4-a716-446655440000",
  "contactName": "João Silva",
  "contactEmail": "joao@example.com",
  "alertType": "CREATE",
  "message": "Novo contacto criado com sucesso",
  "status": "PENDING",
  "createdAt": "2026-07-12T10:30:00"
}
```

**Códigos de Resposta:**
- `201 Created` - Alerta criado com sucesso
- `400 Bad Request` - Validação falhou

---

### 2. Listar Alertas (Paginado)

**Endpoint:**
```
GET /api/alerts
```

**Descrição:** Retorna lista paginada de todos os alertas

**Parâmetros Query:**

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-----------|---------|-----------|
| `page` | integer | Não | `0` | Página (0-indexed) |
| `size` | integer | Não | `10` | Itens por página |

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:8082/api/alerts?page=0&size=10"
```

**Resposta (200 OK):**

```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "contactId": "550e8400-e29b-41d4-a716-446655440000",
      "contactName": "João Silva",
      "contactEmail": "joao@example.com",
      "alertType": "CREATE",
      "message": "Novo contacto criado",
      "status": "PENDING",
      "createdAt": "2026-07-12T10:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

**Códigos de Resposta:**
- `200 OK` - Alertas recuperados
- `400 Bad Request` - Parâmetros inválidos

---

### 3. Obter Alerta por ID

**Endpoint:**
```
GET /api/alerts/{id}
```

**Descrição:** Retorna um alerta específico

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `id` | string | Sim | ObjectId do MongoDB |

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:8082/api/alerts/507f1f77bcf86cd799439011"
```

**Resposta (200 OK):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "contactId": "550e8400-e29b-41d4-a716-446655440000",
  "contactName": "João Silva",
  "contactEmail": "joao@example.com",
  "alertType": "CREATE",
  "message": "Novo contacto criado",
  "status": "PENDING",
  "createdAt": "2026-07-12T10:30:00"
}
```

**Códigos de Resposta:**
- `200 OK` - Alerta encontrado
- `404 Not Found` - Alerta não existe

---

### 4. Listar Alertas por Contacto

**Endpoint:**
```
GET /api/alerts/contact/{contactId}
```

**Descrição:** Retorna todos os alertas de um contacto específico

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `contactId` | UUID | Sim | UUID do contacto |

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:8082/api/alerts/contact/550e8400-e29b-41d4-a716-446655440000"
```

**Resposta (200 OK):**

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "contactName": "João Silva",
    "contactEmail": "joao@example.com",
    "alertType": "CREATE",
    "message": "Novo contacto criado",
    "status": "PENDING",
    "createdAt": "2026-07-12T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "contactName": "João Silva",
    "contactEmail": "joao@example.com",
    "alertType": "UPDATE",
    "message": "Contacto atualizado",
    "status": "PENDING",
    "createdAt": "2026-07-12T11:00:00"
  }
]
```

**Códigos de Resposta:**
- `200 OK` - Alertas recuperados (lista vazia se nenhum)

---

### 5. Listar Alertas por Status

**Endpoint:**
```
GET /api/alerts/status/{status}
```

**Descrição:** Retorna alertas com um status específico

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `status` | string | Sim | PENDING ou PROCESSED |

**Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:8082/api/alerts/status/PENDING"
```

**Resposta (200 OK):**

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "contactName": "João Silva",
    "contactEmail": "joao@example.com",
    "alertType": "CREATE",
    "message": "Novo contacto criado",
    "status": "PENDING",
    "createdAt": "2026-07-12T10:30:00"
  }
]
```

**Códigos de Resposta:**
- `200 OK` - Alertas recuperados

---

### 6. Marcar Alerta como Processado

**Endpoint:**
```
PUT /api/alerts/{id}/mark-processed
```

**Descrição:** Atualiza status do alerta para PROCESSED

**Parâmetros Path:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `id` | string | Sim | ObjectId do MongoDB |

**Exemplo de Requisição:**

```bash
curl -X PUT "http://localhost:8082/api/alerts/507f1f77bcf86cd799439011/mark-processed"
```

**Resposta (204 No Content):**

```
(sem body)
```

**Códigos de Resposta:**
- `204 No Content` - Alerta marcado com sucesso
- `404 Not Found` - Alerta não existe

---

## 🔄 Fluxo de Exemplo

### Backend Principal → Alert Service

Quando um contacto é criado no backend principal:

1. **ContactController** recebe POST `/api/contacts`
2. **ContactService** cria o contacto
3. **ContactService** chama via **Feign**:
   ```bash
   POST /api/alerts
   {
     "contactId": "uuid",
     "contactName": "João",
     "contactEmail": "joao@example.com",
     "alertType": "CREATE",
     "message": "Novo contacto criado"
   }
   ```
4. **AlertService** cria o documento no MongoDB
5. Log é registado: `"Creating alert for contact: uuid (João)"`
6. **AlertResponse** é retornado (sucesso silencioso)

---

## 📊 Status Codes Resumo

| Código | Descrição |
|--------|-----------|
| `200 OK` | GET com sucesso |
| `201 Created` | POST com sucesso |
| `204 No Content` | PUT com sucesso (sem body) |
| `400 Bad Request` | Validação falhou |
| `404 Not Found` | Recurso não existe |

---

## 📋 Campos de Resposta

### AlertResponse

```json
{
  "id": "ObjectId (MongoDB)",
  "contactId": "UUID string",
  "contactName": "string",
  "contactEmail": "string",
  "alertType": "string (CREATE|UPDATE|DELETE)",
  "message": "string",
  "status": "string (PENDING|PROCESSED)",
  "createdAt": "ISO 8601 datetime"
}
```

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:8082/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8082/v3/api-docs
- **Health Check:** http://localhost:8082/actuator/health
- **Base URL:** http://localhost:8082/api

---

## 🗄️ Banco de Dados (MongoDB)

### Colection: alerts

Documentos armazenados com os campos:

```javascript
{
  "_id": ObjectId,              // ID único (auto-gerado)
  "contact_id": "string",       // UUID do contacto
  "contact_name": "string",     // Nome do contacto
  "contact_email": "string",    // Email do contacto
  "alert_type": "string",       // CREATE, UPDATE, DELETE
  "message": "string",          // Mensagem do alerta
  "status": "string",           // PENDING, PROCESSED
  "created_at": ISODate         // Data/hora criação
}
```

### Índices

Automáticamente criados em:
- `contact_id` - Busca rápida por contacto
- `status` - Filtro por status
- `alert_type` - Filtro por tipo
- `created_at` - Ordenação por data

---

## Performance

- **Response Time:** < 50ms
- **Max Documents:** ~1M por collection
- **Paginação:** Default 10, max 100 items/página

---

## 🔒 Considerações de Segurança

- ✅ **Validação:** Todos inputs validados
- ✅ **Logging:** Todas operações registadas
- ✅ **MongoDB Index:** Otimizações ativas
- ⚠️ **CORS:** Configurado apenas internamente (inter-serviços)
- ⚠️ **Autenticação:** Não implementada (adicionar conforme necessário)

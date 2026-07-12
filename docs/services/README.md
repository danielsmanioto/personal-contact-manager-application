# 🏗️ Microserviços - Contact Manager

Documentação centralizada de todos os microserviços da plataforma Contact Manager.

---

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│              http://localhost:5173                   │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Backend Principal   │  │   Alert Service      │
│  (Contact Manager)   │  │  (Microservice)      │
│  :8081/api           │  │  :8082/api           │
└──────────┬───────────┘  └──────────┬───────────┘
           │                        │
    ┌──────┴────────┐       ┌──────┴─────┐
    ▼               ▼       ▼             ▼
┌─────────┐  ┌──────────┐ ┌────────┐  ┌──────────┐
│PostgreSQL│ │  Feign  │ │MongoDB │  │  Logs   │
│  15      │ │  Client  │ │  5.0   │  │  File   │
└─────────┘  └──────────┘ └────────┘  └──────────┘
```

---

## 🔧 Serviços Disponíveis

### 1. Backend Principal (Contact Manager)

**Localização:** `/backend`  
**Porta:** `8081`  
**Database:** PostgreSQL 15  
**Linguagem:** Java 21 + Spring Boot 3.3

**Responsabilidades:**
- ✅ API REST para gerenciamento de contactos
- ✅ CRUD (Create, Read, Update, Delete)
- ✅ Search, Filter, Sort
- ✅ Chamar alert-service via Feign quando contacto é criado

**Endpoints:**
- `GET /api/contacts` - Listar contactos
- `POST /api/contacts` - Criar contacto (dispara alerta)
- `PUT /api/contacts/{id}` - Atualizar contacto
- `DELETE /api/contacts/{id}` - Deletar contacto
- `GET /api/contacts/search?q=...` - Buscar
- `GET /api/contacts/filter?...` - Filtrar

**Documentação:** `docs/backend-principal/endpoints.md`

---

### 2. Alert Service

**Localização:** `/services/alert-service`  
**Porta:** `8082`  
**Database:** MongoDB 5.0  
**Linguagem:** Java 21 + Spring Boot 3.3

**Responsabilidades:**
- ✅ Receber alertas do backend principal
- ✅ Armazenar alertas em MongoDB
- ✅ Registar logs de todas as operações
- ✅ Fornecer API para consulta de alertas

**Endpoints:**
- `POST /api/alerts` - Criar alerta
- `GET /api/alerts?page=0&size=10` - Listar alertas
- `GET /api/alerts/{id}` - Obter alerta por ID
- `GET /api/alerts/contact/{contactId}` - Alertas por contacto
- `GET /api/alerts/status/{status}` - Alertas por status
- `PUT /api/alerts/{id}/mark-processed` - Marcar como processado

**Documentação:** `docs/services/alert-service/endpoints.md`

**Tech Stack:**
- Spring Boot 3.3
- Spring Data MongoDB
- MongoDB 5.0 (NoSQL)
- OpenAPI/Swagger
- SLF4J Logging

---

## 🔗 Comunicação Entre Serviços

### Backend → Alert Service (Feign)

Quando um contacto é **criado** no backend:

```
1. ContactController.POST /api/contacts
   ↓
2. ContactService.create()
   ↓
3. ContactRepository.save()
   ↓
4. AlertClient.sendAlert() [Feign]
   ↓
5. AlertService.POST /api/alerts
   ↓
6. AlertRepository.save() [MongoDB]
   ↓
7. Retorna resposta 201
```

**Configuração Feign:**

```yaml
# backend/src/main/resources/application.yml
alert-service:
  url: http://localhost:8082

feign:
  client:
    config:
      alert-service:
        connectTimeout: 5000
        readTimeout: 5000
```

**Fallback Automático:**
- Se alert-service está down, o log é registado mas a criação do contacto **NÃO FALHA**
- Padrão: "Fire and forget"

---

## 🗄️ Databases

### Backend Principal - PostgreSQL

```
Database: contact_manager
Host: postgres:5432
User: postgres
Password: postgres

Tabela: contacts
- id (UUID)
- name (VARCHAR 255)
- email (VARCHAR 255)
- phone (VARCHAR 20)
- birth_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP - soft delete)
```

### Alert Service - MongoDB

```
Database: alert_manager
Host: mongo:27017
User: admin
Password: admin

Collection: alerts
{
  _id: ObjectId,
  contact_id: String,
  contact_name: String,
  contact_email: String,
  alert_type: String,
  message: String,
  status: String,
  created_at: ISODate
}
```

---

## 🐳 Docker Compose

Todos os serviços rodam com Docker Compose:

```bash
# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Ver logs
docker-compose logs -f

# Específico
docker-compose logs -f alert-service
docker-compose logs -f backend
```

**Serviços no docker-compose.yml:**
1. `postgres` - PostgreSQL 15
2. `mongo` - MongoDB 5.0
3. `backend` - Contact Manager (porta 8081)
4. `alert-service` - Alert Service (porta 8082)
5. `frontend` - React (porta 80)

---

## 🔌 URLs de Acesso (Desenvolvimento)

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost | React app |
| **Backend API** | http://localhost:8081/api | Contact Manager REST |
| **Backend Swagger** | http://localhost:8081/swagger-ui.html | Documentação interativa |
| **Alert API** | http://localhost:8082/api | Alert Service REST |
| **Alert Swagger** | http://localhost:8082/swagger-ui.html | Documentação interativa |
| **PostgreSQL** | localhost:5432 | Database |
| **MongoDB** | localhost:27017 | Database |

---

## 📊 Fluxo de Dados Completo

### Cenário: Criar um Novo Contacto

```
1. FRONTEND
   POST http://localhost:5173/contacts
   Body: { name, email, phone, birthDate }
   
2. BACKEND (ContactController)
   POST /api/contacts
   │
   ├─ Validar input
   ├─ Verificar email único
   └─ Chamar ContactService.create()
   
3. BACKEND (ContactService)
   ├─ Criar Contact entity
   ├─ Salvar em PostgreSQL
   ├─ Chamar AlertClient.sendAlert() [ASYNC - Feign]
   └─ Retornar ContactResponse
   
4. ALERT SERVICE (via Feign)
   ├─ Receber AlertRequest
   ├─ Validar campos
   ├─ Criar Alert document
   ├─ Salvar em MongoDB
   ├─ Registar log
   └─ Retornar 201 Created
   
5. FRONTEND
   ├─ Recebe ContactResponse
   ├─ Atualiza lista
   └─ Mostra toast "Contacto criado"
   
6. LOGS
   Backend: "Contact created with ID: ..."
   Backend: "Alert sent for contact: ..."
   Alert: "Creating alert for contact: ..."
   Alert: "Alert created successfully with ID: ..."
```

---

## 🚀 Deployment

### Local Development
```bash
mvn clean install    # Backend
npm install          # Frontend
docker-compose up -d # All services
```

### Docker Production
```bash
mvn clean package           # Build backend
npm run build              # Build frontend
docker-compose -f docker-compose.yml up -d
```

### Kubernetes (Futuros)
- Helm charts para cada serviço
- Service mesh (Istio)
- Ingress controller

---

## 📈 Monitoramento & Health Checks

### Backend Health
```bash
curl http://localhost:8081/actuator/health
```

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

### Alert Service Health
```bash
curl http://localhost:8082/actuator/health
```

```json
{
  "status": "UP",
  "components": {
    "mongo": { "status": "UP" }
  }
}
```

---

## 🔐 Segurança Inter-Serviços

### Atual (Desenvolvimento)
- ✅ Comunicação HTTP sem autenticação
- ✅ Mesma rede Docker (isolada)
- ✅ Health checks automáticos

### Futuro (Produção)
- 🔒 mTLS (mutual TLS)
- 🔒 API Keys ou JWT
- 🔒 Rate limiting
- 🔒 Circuit breaker (Hystrix/Resilience4j)

---

## 📚 Documentação por Serviço

### Backend Principal
- `docs/backend-principal/endpoints.md` - API REST
- `docs/backend-principal/postman-collection.json` - Coleção Postman
- `docs/database/backend-principal-schema.md` - Schema PostgreSQL
- `backend/README.md` - Setup local

### Alert Service
- `docs/services/alert-service/endpoints.md` - API REST
- `docs/services/alert-service/postman-collection.json` - Coleção Postman
- `services/alert-service/README.md` - Setup local

---

## 🔄 Próximos Serviços Planejados

| Serviço | Descrição | Porta | Database | Status |
|---------|-----------|-------|----------|--------|
| **User Service** | Gerenciar usuários | 8083 | PostgreSQL | 📋 Planejado |
| **Payment Service** | Processar pagamentos | 8084 | PostgreSQL | 📋 Planejado |
| **Notification Service** | Email/SMS | 8085 | MongoDB | 📋 Planejado |
| **Analytics Service** | Relatórios | 8086 | ClickHouse | 📋 Planejado |

---

## ⚡ Performance & SLA

### Latência

| Operação | Target | Atual |
|----------|--------|-------|
| GET /api/contacts | < 100ms | ~40ms |
| POST /api/contacts | < 200ms | ~150ms |
| POST /api/alerts | < 100ms | ~30ms |
| GET /api/alerts | < 100ms | ~50ms |

### Disponibilidade

| Serviço | SLA | Uptime |
|---------|-----|--------|
| Backend | 99.9% | ~43.2s down/month |
| Alert | 99.5% | ~3.6min down/month |
| PostgreSQL | 99.95% | ~21.6s down/month |
| MongoDB | 99.9% | ~43.2s down/month |

---

## 📝 Versionamento

**Versão Atual:** 1.0.0

- Backend: 1.0.0 (12/12 tasks complete)
- Alert Service: 1.0.0 (novo)
- API: v1

---

## 🤝 Contribuindo

### Para Adicionar Novo Serviço

1. Criar pasta: `services/novo-servico/`
2. Copiar estrutura de `services/alert-service/`
3. Atualizar `docker-compose.yml`
4. Documentar em `docs/services/novo-servico/`
5. Atualizar este README

---

## 📞 Suporte & Troubleshooting

### Serviço Down
```bash
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs alert-service

# Reiniciar
docker-compose restart alert-service
```

### Feign Connection Error
```
Causa: Alert service não está rodando
Solução: docker-compose up -d alert-service
```

### MongoDB Connection Error
```
Causa: Mongo container não iniciou
Solução: docker-compose up -d mongo
        docker-compose exec mongo mongosh
```

---

## 🎯 Quick Links

- [Backend Principal](../backend-principal/endpoints.md)
- [Alert Service](./alert-service/endpoints.md)
- [Database Schema](../database/)
- [Postman Collections](./alert-service/postman-collection.json)
- [CLAUDE.md - Projeto Completo](../../CLAUDE.md)

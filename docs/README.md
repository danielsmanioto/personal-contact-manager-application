# 📚 Documentação - Contact Manager

Bem-vindo à documentação do **Contact Manager**! Esta pasta contém toda a documentação sobre os serviços, arquitetura, banco de dados e como usar as APIs.

---

## 📁 Estrutura de Documentação

```
docs/
├── README.md (este arquivo)
├── database/
│   └── backend-principal-schema.md    # Modelagem completa do banco
├── backend-principal/
│   ├── endpoints.md                   # Documentação de todos os endpoints
│   ├── postman-collection.json        # Coleção Postman pronta para usar
│   └── POSTMAN-SETUP.md               # Guia de setup do Postman & Swagger
└── (futuros serviços)
    ├── backend-usuarios/
    ├── backend-pagamentos/
    └── ...
```

---

## 🚀 Quick Start

### 1. Para Testar a API Interativamente

**Opção A: Swagger UI (Recomendado)**
- Inicie o backend: `export JAVA_HOME=$(/usr/libexec/java_home) && mvn spring-boot:run`
- Abra no navegador: http://localhost:8081/swagger-ui.html
- Teste endpoints diretamente na interface

**Opção B: Postman (Desktop)**
- Abra Postman
- Import: `docs/backend-principal/postman-collection.json`
- Configure ambiente com `baseUrl = http://localhost:8081`
- Teste endpoints com interface intuitiva

### 2. Para Consultar Documentação

- **Endpoints:** `docs/backend-principal/endpoints.md`
- **Database:** `docs/database/backend-principal-schema.md`
- **Postman Setup:** `docs/backend-principal/POSTMAN-SETUP.md`

---

## 📖 Guias por Tópico

### 🔗 API REST - Backend Principal

**Arquivo:** `backend-principal/endpoints.md`

- Lista completa de todos os 7 endpoints
- Request/response examples
- Parâmetros e validações
- Status codes
- Performance
- Tratamento de erros

**Endpoints inclusos:**
1. `GET /api/contacts` - Listar (paginado)
2. `GET /api/contacts/{id}` - Obter um
3. `POST /api/contacts` - Criar
4. `PUT /api/contacts/{id}` - Atualizar
5. `DELETE /api/contacts/{id}` - Deletar (soft delete)
6. `GET /api/contacts/search?q=...` - Buscar
7. `GET /api/contacts/filter?fromDate=...&toDate=...` - Filtrar

---

### 🗄️ Modelagem de Banco de Dados

**Arquivo:** `database/backend-principal-schema.md`

- Estrutura completa da tabela `contacts`
- Tipos de dados e restrições
- Índices de performance
- Soft delete strategy
- SQL completo (migration)
- Estratégia de backup

**Inclusos:**
- ✅ 8 colunas com tipos e validações
- ✅ 4 índices de performance
- ✅ Soft delete (deletedAt)
- ✅ Timestamps (createdAt, updatedAt)
- ✅ UUID como primary key

---

### 📮 Postman & Swagger

**Arquivo:** `backend-principal/POSTMAN-SETUP.md`

- Como usar Swagger UI
- Como instalar e usar Postman
- Como importar coleção
- Como configurar ambiente
- Testes automáticos
- Troubleshooting

**Recursos:**
- ✅ Coleção Postman pronta (`postman-collection.json`)
- ✅ 15+ requisições pré-configuradas
- ✅ Testes automáticos em cada requisição
- ✅ Variáveis de ambiente auto-preenchidas

---

## 🔗 Links Úteis

### Desenvolvimento Local

| Recurso | URL |
|---------|-----|
| **Swagger UI** | http://localhost:8081/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8081/v3/api-docs |
| **Health Check** | http://localhost:8081/actuator/health |
| **API Base** | http://localhost:8081/api |

### Frontend

| Recurso | URL |
|---------|-----|
| **Frontend Dev** | http://localhost:5173 |
| **Frontend Prod** | http://localhost |

### Documentação do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `CLAUDE.md` | Instruções para Claude Code |
| `README.md` | Visão geral do projeto |
| `QUICKSTART.md` | Guia rápido de início |

---

## 🎯 Por Persona

### Para Front-end Developer

1. Leia: `backend-principal/endpoints.md` (seção "Endpoints por Função")
2. Teste: Abra Swagger UI em http://localhost:8081/swagger-ui.html
3. Use: Postman collection para testar antes de integrar

**Útil para:**
- Entender estrutura de request/response
- Testar antes de integrar no frontend
- Verificar validações de entrada

---

### Para Backend Developer

1. Leia: `database/backend-principal-schema.md` (completo)
2. Leia: `backend-principal/endpoints.md` (completo)
3. Estude: `CLAUDE.md` (arquitetura completa)

**Útil para:**
- Entender design de database
- Adicionar novos endpoints
- Modificar migrations
- Implementar features

---

### Para QA/Tester

1. Setup: Postman com `docs/backend-principal/postman-collection.json`
2. Leia: `backend-principal/POSTMAN-SETUP.md` (guia completo)
3. Execute: Testes automáticos via Postman Collection Runner

**Útil para:**
- Testar fluxos completos
- Validar edge cases
- Reporte de bugs
- Regressão testing

---

### Para DevOps/Infra

1. Leia: `database/backend-principal-schema.md` (seção "Backup & Restore")
2. Estude: `CLAUDE.md` (seção "Docker & Deployment")
3. Configure: CI/CD pipelines

**Útil para:**
- Setup de database
- Backup strategy
- Deployment
- Monitoramento

---

## 📊 Estatísticas da API

### Endpoints
- ✅ Total: 7 endpoints
- ✅ GET: 4
- ✅ POST: 1
- ✅ PUT: 1
- ✅ DELETE: 1

### Database
- ✅ Tabelas: 1 (contacts)
- ✅ Colunas: 8
- ✅ Índices: 4
- ✅ Status: Soft delete ativo

### Performance
- ✅ Response time: < 100ms (avg)
- ✅ Max pagination: 100 items/page
- ✅ Database: PostgreSQL 15

---

## 🔄 Estrutura de Versioning

Documentação segue **versionamento semântico**:

| Versão | Status | Descrição |
|--------|--------|-----------|
| 1.0.0 | ✅ Current | API completa com CRUD, search, filter |
| 2.0.0 | 📋 Planejado | Autenticação, roles, permissões |
| 3.0.0 | 📋 Planejado | Múltiplos backends (usuários, pagamentos) |

---

## 🚀 Para Próximos Backends

Quando adicionar novos serviços (backend-usuarios, backend-pagamentos, etc.):

1. **Criar pasta:** `docs/backend-NOME/`
2. **Criar docs:**
   - `endpoints.md` - Documentação de API
   - `postman-collection.json` - Coleção Postman
   - `POSTMAN-SETUP.md` - Setup guide (opcional, se diferente)
3. **Criar pasta:** `docs/database/backend-NOME-schema.md`
4. **Atualizar:** Este README com link para nova doc

**Template para nova documentação:**
```markdown
# docs/backend-NOVO/endpoints.md
# Base URL: http://localhost:808X/api
# [Seguir mesmo formato de backend-principal]
```

---

## ✅ Checklist para Novo Backend

- [ ] Criar pasta `docs/backend-NOVO/`
- [ ] Documentar endpoints em `endpoints.md`
- [ ] Criar `postman-collection.json`
- [ ] Criar `POSTMAN-SETUP.md` (se necessário)
- [ ] Documentar schema em `database/backend-NOVO-schema.md`
- [ ] Atualizar este README com link
- [ ] Testar todos endpoints em Postman
- [ ] Validar exemplos de request/response

---

## 🤝 Contribuindo com Documentação

### Quando Adicionar/Modificar Docs

- ✅ Quando criar novo endpoint
- ✅ Quando mudar validação
- ✅ Quando adicionar novo campo
- ✅ Quando modificar database schema
- ✅ Quando descobrir bug ou edge case

### Como Contribuir

1. **Edite o arquivo** (ex: `endpoints.md`)
2. **Adicione exemplo** (request + response)
3. **Atualize postman-collection.json** (se necessário)
4. **Teste tudo** via Swagger UI ou Postman
5. **Commit com message clara:** `docs: add new endpoint documentation`

---

## 📞 Suporte

### Problemas com API?

1. Verifique **Health Check:** http://localhost:8081/actuator/health
2. Leia **Troubleshooting** em `backend-principal/POSTMAN-SETUP.md`
3. Verifique **logs** do backend: `mvn spring-boot:run`

### Problemas com Database?

1. Verifique status de migration: `mvn flyway:info`
2. Leia **Database Schema:** `database/backend-principal-schema.md`
3. Verifique conexão: `psql -h localhost -U postgres -d contact_manager`

### Problemas com Postman?

1. Leia **POSTMAN-SETUP.md** (seção Troubleshooting)
2. Verifique `baseUrl` no ambiente
3. Verifique que backend está rodando

---

## 📝 Versionamento de Docs

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 2026-07-12 | Documentação inicial (7 endpoints, 1 tabela) |

---

## 🎯 Próximos Passos

1. **Ler:** Este README
2. **Testar:** Abra Swagger UI ou Postman
3. **Explorar:** Tente os endpoints
4. **Perguntar:** Se tiver dúvidas, abra uma issue

**Bom desenvolvimento! 🚀**

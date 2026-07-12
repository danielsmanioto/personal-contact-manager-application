# Guia de Setup - Postman & Swagger

## 📚 Documentação Interativa da API

### 1. Swagger UI (Recomendado para Desenvolvimento)

**O que é?** Interface web interativa para visualizar e testar todos os endpoints da API.

**URL:**
```
http://localhost:8081/swagger-ui.html
```

**Recursos:**
- ✅ Visualizar todos os endpoints
- ✅ Ver schemas de request/response
- ✅ Testar requests diretamente na interface
- ✅ Ver códigos HTTP retornados
- ✅ Download OpenAPI JSON
- ✅ Documentação em tempo real

**Como Usar:**

1. **Inicie o backend:**
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home)
   mvn spring-boot:run
   ```

2. **Abra no navegador:**
   ```
   http://localhost:8081/swagger-ui.html
   ```

3. **Na interface:**
   - Clique em um endpoint para expandi-lo
   - Clique em "Try it out" para testar
   - Preencha parâmetros/body
   - Clique "Execute" para enviar requisição
   - Veja resposta em tempo real

**Exemplo - Listar Contactos:**

1. Expandir `GET /api/contacts`
2. Clique "Try it out"
3. Defina `page=0`, `size=10`
4. Clique "Execute"
5. Veja resposta JSON

---

### 2. OpenAPI JSON Schema

**O que é?** Especificação OpenAPI 3.0 em formato JSON (máquina-legível).

**URL:**
```
http://localhost:8081/v3/api-docs
```

**Uso:**
- Importar em ferramentas de automação
- Gerar SDKs
- Integração com CI/CD
- Documentação automática

---

## 📮 Postman - Importar Coleção

### O que é Postman?

Postman é um cliente HTTP poderoso que permite:
- ✅ Testar APIs sem código
- ✅ Salvar requisições em coleções
- ✅ Automatizar testes
- ✅ Compartilhar coleções com equipe
- ✅ Documentar APIs

### Instalação do Postman

1. **Download:** https://www.postman.com/downloads/
2. **Instalar:** Siga instruções do site
3. **Abrir:** Crie uma conta (grátis) ou use offline

---

## 🔧 Importar Coleção Contact Manager

### Opção 1: Via Arquivo JSON (Recomendado)

**Arquivo da coleção:**
```
docs/backend-principal/postman-collection.json
```

**Passos:**

1. **Abra Postman**

2. **Click em "Import"** (canto superior esquerdo)

3. **Selecione "Upload Files"**

4. **Procure o arquivo:**
   ```
   docs/backend-principal/postman-collection.json
   ```

5. **Clique "Open"** e depois **"Import"**

6. **Pronto!** A coleção aparecerá na barra lateral esquerda

### Opção 2: Via Link (Workspace Compartilhado)

> Quando tivermos um workspace público, será possível:
> ```
> https://www.postman.com/collections/contact-manager-api
> ```

---

## ⚙️ Configurar Ambiente no Postman

### Criar Novo Ambiente

1. **Clique em "Environments"** (aba superior)

2. **Clique em "+"** (novo ambiente)

3. **Nomeie:** "Contact Manager - Development"

4. **Adicione variáveis:**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `baseUrl` | `http://localhost:8081` | URL base da API |
| `contactId` | (vazio) | ID do contacto (auto-preenchido) |
| `createdContactId` | (vazio) | ID criado (auto-preenchido) |

5. **Clique "Save"**

### Selecionar Ambiente

1. **No topo direito** (próximo a "Eye icon")
2. **Selecione** "Contact Manager - Development"
3. **Pronto!** Suas variáveis estão ativas

---

## 🚀 Usar a Coleção

### Estrutura da Coleção

```
Contact Manager API
├── Contacts (CRUD)
│   ├── List All Contacts (Paginated)
│   ├── Get Contact by ID
│   ├── Create Contact
│   ├── Update Contact
│   └── Delete Contact
├── Search & Filter
│   ├── Search by Name or Email
│   ├── Search by Email
│   └── Filter by Birth Date Range
└── Health & Documentation
    ├── Health Check
    └── OpenAPI Spec (JSON)
```

### Exemplo: Fluxo Completo

#### 1. Verificar Saúde da API

1. **Expand** "Health & Documentation" → "Health Check"
2. **Click "Send"**
3. **Resposta esperada:** `status: "UP"`

#### 2. Criar um Novo Contacto

1. **Expand** "Contacts" → "Create Contact"
2. **Clique "Send"** (usa dados padrão)
3. **Na resposta**, copia o `id`
4. **Em seu ambiente**, seta `createdContactId = <id>`

#### 3. Obter Contacto Criado

1. **Expand** "Contacts" → "Get Contact by ID"
2. **Clique "Send"**
3. **Verifica** se os dados são os esperados

#### 4. Atualizar Contacto

1. **Expand** "Contacts" → "Update Contact"
2. **Muda dados no body** (ex: name)
3. **Clique "Send"**
4. **Verifica** se `updatedAt` foi alterado

#### 5. Buscar Contacto

1. **Expand** "Search & Filter" → "Search by Name or Email"
2. **Altera parâmetro `q`** (ex: "Maria")
3. **Clique "Send"**
4. **Verifica** resultados

#### 6. Deletar Contacto

1. **Expand** "Contacts" → "Delete Contact"
2. **Clique "Send"**
3. **Resposta esperada:** `204 No Content`

---

## 📝 Variáveis de Ambiente (Automáticas)

A coleção tem **scripts de teste** que preenchem variáveis automaticamente:

### List All Contacts
- ✅ Auto-salva ID do primeiro contacto em `contactId`

### Create Contact
- ✅ Auto-salva ID criado em `createdContactId`

### Uso em Requisições

```
{{baseUrl}}/api/contacts/{{createdContactId}}
```

Variáveis são substituídas automaticamente (ex: `http://localhost:8081/api/contacts/550e8400...`)

---

## 🧪 Testes Automatizados

A coleção inclui **testes automáticos** em cada request:

### Exemplo: Create Contact

```javascript
pm.test('Status is 201 Created', function () {
  pm.response.to.have.status(201);
});

pm.test('Contact created with correct data', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.name).to.equal('João Silva');
  pm.expect(jsonData.email).to.equal('joao.silva@example.com');
});
```

### Ver Resultados

1. **Depois de enviar request**
2. **Clique na aba "Tests"**
3. **Vê testes passando (✓) ou falhando (✗)**

### Rodar Teste em Lote

1. **Selecione uma pasta** (ex: "Contacts")
2. **Clique na seta** > "Run Contacts"
3. **Abre "Collection Runner"**
4. **Clique "Run"**
5. **Vê todos testes rodar em sequência**

---

## 🔐 Adicionar Autenticação (Futuro)

Quando a API tiver autenticação:

1. **Na coleção**, clique **"Edit"**
2. **Abra aba "Authorization"**
3. **Selecione tipo** (Bearer, API Key, etc.)
4. **Preencha token/credenciais**
5. **Salve**

---

## 💾 Exportar Coleção

Para compartilhar com equipe:

1. **Clique na coleção**
2. **Menu (3 pontos)**
3. **"Export"**
4. **Selecione formato** (JSON recomendado)
5. **Salve arquivo**
6. **Compartilhe** via Git, email, etc.

---

## 🌐 URLs de Desenvolvimento

| Recurso | URL |
|---------|-----|
| **API Base** | http://localhost:8081/api |
| **Swagger UI** | http://localhost:8081/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8081/v3/api-docs |
| **Health Check** | http://localhost:8081/actuator/health |

---

## 📱 Postman Mobile

Postman também funciona em **mobile** (iOS/Android):

1. **Baixe Postman** da app store
2. **Faça login** (mesma conta desktop)
3. **Suas coleções sincronizam** automaticamente
4. **Teste APIs** do seu celular

---

## 🐛 Troubleshooting

### "Cannot GET /api/contacts"

**Causa:** Backend não está rodando

**Solução:**
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
mvn spring-boot:run
```

### "Connection refused"

**Causa:** URL errada ou porta 8081 não acessível

**Solução:**
- Verifique `baseUrl = http://localhost:8081`
- Verifique porta em `application.yml`

### Variáveis não funcionam

**Causa:** Ambiente não selecionado

**Solução:**
1. Selecione ambiente no topo direito
2. Verifique que variáveis estão preenchidas

### Testes falhando

**Causa:** Dados de teste podem estar duplicados

**Solução:**
1. Use emails únicos em cada requisição
2. Limpe dados criados antes de rerun

---

## 📚 Recursos Adicionais

- **Postman Learning Center:** https://learning.postman.com/
- **API Documentation:** `docs/backend-principal/endpoints.md`
- **Database Schema:** `docs/database/backend-principal-schema.md`
- **Código Backend:** `backend/src/main/java/com/contactmanager/`

---

## ✅ Checklist de Setup

- [ ] Backend rodando (`mvn spring-boot:run`)
- [ ] Postman instalado
- [ ] Coleção importada
- [ ] Ambiente criado
- [ ] `baseUrl` configurado
- [ ] Health check funcionando
- [ ] Primeira requisição testada
- [ ] Testes automáticos passando

**Pronto para testar! 🚀**

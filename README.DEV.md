# 🚀 Desenvolvimento - Personal Contact Manager

Este documento explica como configurar e executar a aplicação em ambiente de desenvolvimento.

## ✅ Pré-requisitos

- **Java 21+** (com Maven)
- **Node.js 18+** (com npm)
- **PostgreSQL 15+** (rodando localmente ou via Docker)

## 🚀 Iniciando a Aplicação

### Opção 1: Script Automático (Recomendado)

```bash
./start.sh
```

Este script:
- ✅ Verifica Java, Maven e npm
- ✅ Inicia o Backend (Spring Boot) na porta 8080
- ✅ Inicia o Frontend (Vite) na porta 5173
- ✅ Aguarda ambos ficarem prontos
- ✅ Salva logs em `.backend.log` e `.frontend.log`

### Opção 2: Manual (em dois terminais)

**Terminal 1 - Backend:**
```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home)
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🛑 Parando a Aplicação

### Com Script:
```bash
./stop.sh
```

### Manual:
```bash
# Pressione Ctrl+C em cada terminal
```

## 🌐 Acessar a Aplicação

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Aplicação React |
| **Backend API** | http://localhost:8080/api | REST API |
| **Swagger** | http://localhost:8080/swagger-ui.html | Documentação API |
| **Database** | localhost:5432 | PostgreSQL (postgres/postgres) |

## 📊 Estrutura do Projeto

```
personal-contact-manager-application/
├── backend/                 # Spring Boot Application
│   ├── src/
│   ├── pom.xml             # Dependências Maven
│   └── Dockerfile          # Para builds em Docker
├── frontend/               # React + Vite Application
│   ├── src/
│   ├── package.json        # Dependências npm
│   ├── vite.config.ts      # Configuração Vite (proxy para /api)
│   └── Dockerfile          # Para builds em Docker
├── start.sh                # Script para iniciar tudo
└── stop.sh                 # Script para parar tudo
```

## 🔧 Variáveis de Ambiente

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:8080/api
```

### Backend (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contact_manager
    username: postgres
    password: postgres
```

## 📝 Logs

Os scripts geram arquivos de log:

```bash
# Ver logs do Backend em tempo real
tail -f .backend.log

# Ver logs do Frontend em tempo real
tail -f .frontend.log
```

## 🐘 Banco de Dados

### Iniciar PostgreSQL (Docker)
```bash
docker run -d \
  --name contact-manager-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=contact_manager \
  -p 5432:5432 \
  postgres:15-alpine
```

### Conectar ao Banco
```bash
psql -U postgres -d contact_manager -h localhost
```

## 🛠️ Troubleshooting

### Porta 8080 já em uso
```bash
# Encontrar processo na porta 8080
lsof -ti:8080

# Matar processo
kill -9 <PID>
```

### Porta 5173 já em uso
```bash
# Encontrar processo na porta 5173
lsof -ti:5173

# Matar processo
kill -9 <PID>
```

### Erro de conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -d contact_manager

# Se não existir, criar banco
createdb -U postgres contact_manager
```

### Limpar cache do Maven
```bash
cd backend
mvn clean install
```

### Limpar node_modules
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Comandos Úteis

### Backend
```bash
# Compilar
mvn clean compile

# Testar
mvn clean test

# Construir JAR
mvn clean package

# Executar testes com cobertura
mvn clean test jacoco:report
```

### Frontend
```bash
# Instalar dependências
npm install

# Dev server
npm run dev

# Build produção
npm run build

# Testar
npm run test

# Linter
npm run lint
```

## 🚢 Deployment (Docker)

Se preferir usar Docker:

```bash
# Parar aplicação local
./stop.sh

# Usar Docker Compose
docker-compose down
docker-compose up -d --build

# Acessar via
# Frontend: http://localhost
# Backend: http://localhost:8081/api (ajustar conforme docker-compose.yml)
```

## 📖 Documentação

- [Backend - CLAUDE.md](./CLAUDE.md)
- [Frontend - Frontend README](./frontend/README.md)
- [API Documentation - Swagger](http://localhost:8080/swagger-ui.html)

## 💡 Dicas de Desenvolvimento

1. **Vite Proxy**: O frontend usa proxy automático para `/api` via Vite
2. **Hot Reload**: Alterações no código recarregam automaticamente
3. **CORS Configurado**: Backend permite requests de `localhost:5173`
4. **Debug**: Use browser DevTools (F12) para inspecionar requisições

---

**Desenvolvido com ❤️ usando Java + React**

#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🚀 Personal Contact Manager - Inicializando...          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

# Check requirements
echo -e "${BLUE}[1/3]${NC} Verificando requisitos..."

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven não encontrado. Por favor, instale Maven.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Por favor, instale Node.js.${NC}"
    exit 1
fi

export JAVA_HOME=$(/usr/libexec/java_home 2>/dev/null || echo "")
if [ -z "$JAVA_HOME" ]; then
    echo -e "${RED}❌ JAVA_HOME não encontrado.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todos os requisitos encontrados${NC}"
echo ""

# Start backend
echo -e "${BLUE}[2/3]${NC} Iniciando Backend (Spring Boot)..."
cd "$PROJECT_ROOT/backend"
mvn spring-boot:run > "$PROJECT_ROOT/.backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo "  ⏳ Aguardando Backend ficar pronto..."
for i in {1..60}; do
    if curl -s http://localhost:8080/api/contacts > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Backend pronto${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}  ❌ Timeout aguardando Backend${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done
echo ""

# Install frontend dependencies if needed
echo -e "${BLUE}[3/3]${NC} Preparando Frontend (React + Vite)..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
    echo "  📦 Instalando dependências do frontend..."
    npm install > "$PROJECT_ROOT/.frontend.log" 2>&1
fi

# Start frontend
echo -e "${BLUE}[3/3]${NC} Iniciando Frontend (React + Vite)..."
npm run dev > "$PROJECT_ROOT/.frontend.log" 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo "  ⏳ Aguardando Frontend ficar pronto..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Frontend pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}  ⚠️  Frontend ainda inicializando...${NC}"
    fi
    sleep 1
done
echo ""

# Save PIDs for stop script
echo "$BACKEND_PID" > "$PROJECT_ROOT/.pids"
echo "$FRONTEND_PID" >> "$PROJECT_ROOT/.pids"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║             ✅ APLICAÇÃO INICIADA COM SUCESSO!                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo -e "║  🌐 ${GREEN}Frontend:${NC}        http://localhost:5173                   ║"
echo -e "║  🔌 ${GREEN}Backend API:${NC}     http://localhost:8080/api              ║"
echo -e "║  📊 ${GREEN}Swagger UI:${NC}      http://localhost:8080/swagger-ui.html  ║"
echo -e "║  🗄️  ${GREEN}Database:${NC}        localhost:5432 (postgres/postgres)    ║"
echo "║                                                                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                         COMANDOS ÚTEIS                         ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Ver logs do Backend:                                         ║"
echo "║    tail -f .backend.log                                       ║"
echo "║                                                                ║"
echo "║  Ver logs do Frontend:                                        ║"
echo "║    tail -f .frontend.log                                      ║"
echo "║                                                                ║"
echo "║  Parar a aplicação:                                           ║"
echo "║    ./stop.sh                                                  ║"
echo "║                                                                ║"
echo "║  Abrir Frontend no navegador:                                 ║"
echo "║    open http://localhost:5173                                 ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}💡 Pressione Ctrl+C para parar a aplicação${NC}"
echo ""

# Trap to handle Ctrl+C
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f "$PROJECT_ROOT/.pids"' EXIT

# Wait for both processes
wait

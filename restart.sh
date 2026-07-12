#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    🔄 Contact Manager (Microserviços) - Reiniciando...        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado.${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

# Stop services
echo -e "${BLUE}[1/2]${NC} Parando serviços..."
docker-compose down 2>/dev/null || true

echo -e "  ${GREEN}✅ Serviços parados${NC}"
echo ""

# Wait a moment before starting
echo "  ⏳ Aguardando 2 segundos..."
sleep 2

# Start services
echo -e "${BLUE}[2/2]${NC} Iniciando serviços..."
docker-compose up -d

echo ""
echo "Aguardando serviços ficarem prontos..."
echo ""

# PostgreSQL
echo "  ⏳ PostgreSQL..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo -e "  ${GREEN}✅ PostgreSQL pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout${NC}"
    fi
    sleep 1
done

# MongoDB
echo "  ⏳ MongoDB..."
for i in {1..30}; do
    if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo -e "  ${GREEN}✅ MongoDB pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout${NC}"
    fi
    sleep 1
done

# Backend
echo "  ⏳ Backend Principal..."
for i in {1..60}; do
    if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Backend Principal pronto${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout${NC}"
    fi
    sleep 1
done

# Alert Service
echo "  ⏳ Alert Service..."
for i in {1..60}; do
    if curl -s http://localhost:8082/actuator/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Alert Service pronto${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout${NC}"
    fi
    sleep 1
done

# Frontend
echo "  ⏳ Frontend..."
for i in {1..30}; do
    if curl -s http://localhost > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Frontend pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "  ${YELLOW}⚠️  Frontend inicializando...${NC}"
    fi
    sleep 1
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      ✅ APLICAÇÃO REINICIADA COM SUCESSO!                     ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo -e "║  🌐 ${GREEN}Frontend:${NC}             http://localhost                      ║"
echo -e "║  🔌 ${GREEN}Backend API:${NC}         http://localhost:8081/api            ║"
echo -e "║  📊 ${GREEN}Backend Swagger:${NC}     http://localhost:8081/swagger-ui.html║"
echo -e "║  🚨 ${GREEN}Alert API:${NC}           http://localhost:8082/api            ║"
echo -e "║  📊 ${GREEN}Alert Swagger:${NC}       http://localhost:8082/swagger-ui.html║"
echo "║                                                                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                      SERVIÇOS EM EXECUÇÃO                      ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo -e "║  ${CYAN}Frontend${NC}          Nginx          :80                           ║"
echo -e "║  ${CYAN}Backend Principal${NC}   Spring Boot    :8081                        ║"
echo -e "║  ${CYAN}Alert Service${NC}      Spring Boot    :8082                        ║"
echo -e "║  ${CYAN}PostgreSQL${NC}        Database       :5432                       ║"
echo -e "║  ${CYAN}MongoDB${NC}           Database       :27017                      ║"
echo "║                                                                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                         COMANDOS ÚTEIS                         ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Ver logs em tempo real:                                      ║"
echo "║    docker-compose logs -f                                     ║"
echo "║                                                                ║"
echo "║  Ver status dos containers:                                   ║"
echo "║    docker-compose ps                                          ║"
echo "║                                                                ║"
echo "║  Parar tudo:                                                  ║"
echo "║    ./stop.sh                                                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

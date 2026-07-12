#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║    🔄 Contact Manager (Microserviços) - Reset Completo        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

# Confirmation
echo -e "${YELLOW}⚠️  AVISO: Esta ação vai:${NC}"
echo "  1. Parar todos os containers"
echo "  2. Remover volumes (DELETAR DADOS do PostgreSQL e MongoDB)"
echo "  3. Reconstruir imagens Docker"
echo "  4. Reiniciar tudo com dados limpos"
echo ""
read -p "Deseja continuar? (sim/não): " -r response

if [[ ! "$response" =~ ^[Ss][Ii][Mm]$ ]]; then
    echo -e "${BLUE}Operação cancelada.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}[1/5]${NC} Parando containers..."
cd "$PROJECT_ROOT"
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✅ Containers parados${NC}"
echo ""

echo -e "${BLUE}[2/5]${NC} Removendo volumes (dados do PostgreSQL, MongoDB)..."
docker volume ls -q | grep -E "(contact-manager|alert-service)" | xargs -r docker volume rm 2>/dev/null || true
echo -e "${GREEN}✅ Volumes removidos${NC}"
echo ""

echo -e "${BLUE}[3/5]${NC} Limpando imagens antigas..."
docker-compose down --rmi local 2>/dev/null || true
echo -e "${GREEN}✅ Imagens removidas${NC}"
echo ""

echo -e "${BLUE}[4/5]${NC} Reconstruindo imagens Docker..."
docker-compose build --no-cache || {
    echo -e "${RED}❌ Erro ao construir imagens${NC}"
    exit 1
}
echo -e "${GREEN}✅ Imagens reconstruídas${NC}"
echo ""

echo -e "${BLUE}[5/5]${NC} Iniciando aplicação com dados limpos..."
docker-compose up -d || {
    echo -e "${RED}❌ Erro ao iniciar serviços${NC}"
    exit 1
}
echo -e "${GREEN}✅ Aplicação iniciada${NC}"
echo ""

# Wait for services
echo "Aguardando serviços ficarem prontos (isso pode levar alguns minutos)..."
echo ""

# PostgreSQL
echo "  ⏳ Aguardando PostgreSQL..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo -e "  ${GREEN}✅ PostgreSQL pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout aguardando PostgreSQL${NC}"
    fi
    sleep 1
done

# MongoDB
echo "  ⏳ Aguardando MongoDB..."
for i in {1..30}; do
    if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo -e "  ${GREEN}✅ MongoDB pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout aguardando MongoDB${NC}"
    fi
    sleep 1
done

# Backend
echo "  ⏳ Aguardando Backend Principal..."
for i in {1..60}; do
    if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Backend Principal pronto${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout aguardando Backend${NC}"
    fi
    sleep 1
done

# Alert Service
echo "  ⏳ Aguardando Alert Service..."
for i in {1..60}; do
    if curl -s http://localhost:8082/actuator/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Alert Service pronto${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "  ${YELLOW}⚠️  Timeout aguardando Alert Service${NC}"
    fi
    sleep 1
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      ✅ RESET COMPLETO REALIZADO COM SUCESSO!                 ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  ✨ Ambiente limpo e pronto para uso!                         ║"
echo "║                                                                ║"
echo -e "║  🌐 ${GREEN}Frontend:${NC}             http://localhost                      ║"
echo -e "║  🔌 ${GREEN}Backend API:${NC}         http://localhost:8081/api            ║"
echo -e "║  📊 ${GREEN}Backend Swagger:${NC}     http://localhost:8081/swagger-ui.html║"
echo -e "║  🚨 ${GREEN}Alert API:${NC}           http://localhost:8082/api            ║"
echo -e "║  📊 ${GREEN}Alert Swagger:${NC}       http://localhost:8082/swagger-ui.html║"
echo "║                                                                ║"
echo "║  Dados do banco foram limpos.                                 ║"
echo "║  Você pode começar a testar do zero!                         ║"
echo "║                                                                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                         COMANDOS ÚTEIS                         ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Ver logs de todos os serviços:                               ║"
echo "║    docker-compose logs -f                                     ║"
echo "║                                                                ║"
echo "║  Parar tudo:                                                  ║"
echo "║    ./stop.sh                                                  ║"
echo "║                                                                ║"
echo "║  Status dos containers:                                       ║"
echo "║    docker-compose ps                                          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

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

# Check if Docker is installed
echo -e "${BLUE}[1/5]${NC} Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Por favor, instale Docker.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado. Por favor, instale Docker Compose.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker encontrado${NC}"
echo ""

# Stop any existing containers
echo -e "${BLUE}[2/5]${NC} Parando containers anteriores..."
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✅ Containers parados${NC}"
echo ""

# Build images
echo -e "${BLUE}[3/5]${NC} Construindo imagens Docker..."
docker-compose build --no-cache || {
    echo -e "${RED}❌ Erro ao construir imagens${NC}"
    exit 1
}
echo -e "${GREEN}✅ Imagens construídas${NC}"
echo ""

# Start services
echo -e "${BLUE}[4/5]${NC} Iniciando serviços..."
docker-compose up -d || {
    echo -e "${RED}❌ Erro ao iniciar serviços${NC}"
    exit 1
}
echo -e "${GREEN}✅ Serviços iniciados${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}[5/5]${NC} Aguardando serviços ficarem prontos..."
echo "  ⏳ Banco de dados..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo -e "${GREEN}  ✅ PostgreSQL pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}  ❌ Timeout aguardando PostgreSQL${NC}"
        exit 1
    fi
    sleep 1
done

echo "  ⏳ Backend..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/contacts > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Backend pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}  ⚠️  Backend ainda não respondeu (pode estar inicializando)${NC}"
    fi
    sleep 1
done

echo "  ⏳ Frontend..."
for i in {1..30}; do
    if curl -s http://localhost > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Frontend pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}  ⚠️  Frontend ainda não respondeu${NC}"
    fi
    sleep 1
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║             ✅ APLICAÇÃO INICIADA COM SUCESSO!                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo -e "║  🌐 ${GREEN}Frontend:${NC}        http://localhost                      ║"
echo -e "║  🔌 ${GREEN}Backend API:${NC}     http://localhost:8080/api            ║"
echo -e "║  📊 ${GREEN}Swagger UI:${NC}      http://localhost:8080/swagger-ui.html║"
echo -e "║  🗄️  ${GREEN}Database:${NC}        localhost:5432 (postgres/postgres)   ║"
echo "║                                                                ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                         COMANDOS ÚTEIS                         ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Ver logs de todos os serviços:                               ║"
echo "║    docker-compose logs -f                                     ║"
echo "║                                                                ║"
echo "║  Ver logs de um serviço específico:                           ║"
echo "║    docker-compose logs -f backend                             ║"
echo "║    docker-compose logs -f frontend                            ║"
echo "║    docker-compose logs -f postgres                            ║"
echo "║                                                                ║"
echo "║  Parar a aplicação:                                           ║"
echo "║    ./stop.sh                                                  ║"
echo "║                                                                ║"
echo "║  Resetar tudo (remove dados):                                 ║"
echo "║    docker-compose down -v                                     ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

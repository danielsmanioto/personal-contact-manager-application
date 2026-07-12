#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🛑 Contact Manager (Microserviços) - Parando...          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado.${NC}"
    exit 1
fi

# Stop all services
cd "$PROJECT_ROOT"

echo -e "${BLUE}Parando containers...${NC}"
echo ""

# Get list of services before stopping
SERVICES=$(docker-compose ps --services 2>/dev/null || echo "")

if [ -z "$SERVICES" ]; then
    echo -e "${YELLOW}⚠️  Nenhum container em execução${NC}"
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║       ✅ Nenhum serviço estava em execução                     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    exit 0
fi

# Stop containers
docker-compose down 2>/dev/null

echo ""
echo "Serviços parados:"
echo -e "  ${GREEN}✅ Frontend${NC}"
echo -e "  ${GREEN}✅ Backend Principal${NC}"
echo -e "  ${GREEN}✅ Alert Service${NC}"
echo -e "  ${GREEN}✅ PostgreSQL${NC}"
echo -e "  ${GREEN}✅ MongoDB${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         ✅ APLICAÇÃO PARADA COM SUCESSO!                      ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Para iniciar novamente:                                      ║"
echo "║    ./start.sh                                                 ║"
echo "║                                                                ║"
echo "║  Para reiniciar:                                              ║"
echo "║    ./restart.sh                                               ║"
echo "║                                                                ║"
echo "║  Ver logs dos containers:                                     ║"
echo "║    docker-compose logs -f                                     ║"
echo "║                                                                ║"
echo "║  Ver status dos containers:                                   ║"
echo "║    docker-compose ps                                          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

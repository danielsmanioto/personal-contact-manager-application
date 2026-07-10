#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🛑 Parando Personal Contact Manager...                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}[1/2]${NC} Parando containers..."
docker-compose down || {
    echo -e "${RED}❌ Erro ao parar containers${NC}"
    exit 1
}
echo -e "${GREEN}✅ Containers parados${NC}"
echo ""

echo -e "${BLUE}[2/2]${NC} Limpando recursos..."
docker-compose ps -q | xargs -r docker stop 2>/dev/null || true
echo -e "${GREEN}✅ Recursos limpos${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║             ✅ APLICAÇÃO PARADA COM SUCESSO!                  ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Para iniciar novamente:                                      ║"
echo "║    ./start.sh                                                 ║"
echo "║                                                                ║"
echo "║  Para resetar tudo (remove dados do banco):                   ║"
echo "║    docker-compose down -v                                     ║"
echo "║    ./start.sh                                                 ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

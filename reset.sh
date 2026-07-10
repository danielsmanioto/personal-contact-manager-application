#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🔄 Resetando Personal Contact Manager...               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  AVISO: Esta ação vai deletar todos os dados do banco de dados!${NC}"
echo ""
read -p "Deseja continuar? (sim/não): " -r response

if [[ ! "$response" =~ ^[Ss][Ii][Mm]$ ]]; then
    echo -e "${BLUE}Operação cancelada.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}[1/4]${NC} Parando containers..."
docker-compose down || true
echo -e "${GREEN}✅ Containers parados${NC}"
echo ""

echo -e "${BLUE}[2/4]${NC} Removendo volumes (dados do banco)..."
docker volume ls -q | xargs -r docker volume rm 2>/dev/null || true
echo -e "${GREEN}✅ Volumes removidos${NC}"
echo ""

echo -e "${BLUE}[3/4]${NC} Removendo imagens antigas..."
docker-compose build --no-cache || {
    echo -e "${RED}❌ Erro ao construir imagens${NC}"
    exit 1
}
echo -e "${GREEN}✅ Imagens reconstruídas${NC}"
echo ""

echo -e "${BLUE}[4/4]${NC} Iniciando aplicação com dados limpos..."
docker-compose up -d || {
    echo -e "${RED}❌ Erro ao iniciar serviços${NC}"
    exit 1
}
echo -e "${GREEN}✅ Aplicação iniciada${NC}"
echo ""

# Wait for services
echo "Aguardando serviços ficarem prontos..."
sleep 5

for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL pronto${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠️  Timeout aguardando PostgreSQL${NC}"
    fi
    sleep 1
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         ✅ RESET COMPLETO REALIZADO COM SUCESSO!              ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Ambiente limpo e pronto para uso!                            ║"
echo "║                                                                ║"
echo -e "║  🌐 ${GREEN}Frontend:${NC}        http://localhost                      ║"
echo -e "║  🔌 ${GREEN}Backend API:${NC}     http://localhost:8081/api            ║"
echo -e "║  📊 ${GREEN}Swagger UI:${NC}      http://localhost:8081/swagger-ui.html║"
echo "║                                                                ║"
echo "║  Banco de dados foi resetado com dados vazios.               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🛑 Personal Contact Manager - Parando...                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ -f "$PROJECT_ROOT/.pids" ]; then
    echo -e "${BLUE}Parando processos...${NC}"
    while IFS= read -r PID; do
        if [ -n "$PID" ] && ps -p "$PID" > /dev/null 2>&1; then
            echo -e "  ⏳ Parando PID $PID..."
            kill -TERM "$PID" 2>/dev/null || true

            # Wait for process to terminate gracefully
            for i in {1..5}; do
                if ! ps -p "$PID" > /dev/null 2>&1; then
                    echo -e "  ${GREEN}✅ Processo $PID parado${NC}"
                    break
                fi
                sleep 1
            done

            # Force kill if still running
            if ps -p "$PID" > /dev/null 2>&1; then
                kill -9 "$PID" 2>/dev/null || true
                echo -e "  ${YELLOW}⚠️  Processo $PID finalizado à força${NC}"
            fi
        fi
    done < "$PROJECT_ROOT/.pids"

    rm -f "$PROJECT_ROOT/.pids"
    echo -e "${GREEN}✅ Todos os processos foram parados${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum arquivo de PIDs encontrado${NC}"
    echo "Tentando parar manualmente..."

    # Try to kill by port
    if command -v lsof &> /dev/null; then
        echo "Parando serviços nas portas 8080 e 5173..."
        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ Serviços parados${NC}"
    fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║             ✅ APLICAÇÃO PARADA COM SUCESSO!                  ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  Para iniciar novamente:                                      ║"
echo "║    ./start.sh                                                 ║"
echo "║                                                                ║"
echo "║  Ver logs do Backend:                                         ║"
echo "║    tail -f .backend.log                                       ║"
echo "║                                                                ║"
echo "║  Ver logs do Frontend:                                        ║"
echo "║    tail -f .frontend.log                                      ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

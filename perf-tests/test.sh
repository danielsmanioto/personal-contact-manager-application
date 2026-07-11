#!/bin/bash

# Simple test runner - MODO RÁPIDO 🚀
# Instala k6 localmente se não tiver e roda testes

set -e

API_URL="${API_URL:-http://localhost:8080/api}"
SCENARIO="${1:-smoke}"

echo "🚀 Performance Test - Modo Rápido"
echo "API: $API_URL"
echo "Teste: $SCENARIO"
echo ""

# Verificar se k6 está instalado
if ! command -v k6 &> /dev/null; then
    echo "📦 k6 não encontrado. Instalando..."

    # Verificar sistema operacional
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "❌ Brew não encontrado. Instale em: https://brew.sh"
            exit 1
        fi
        brew install k6
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y k6
    else
        echo "❌ Sistema não suportado. Instale k6 manualmente: https://k6.io/docs/getting-started/installation/"
        exit 1
    fi
fi

echo "✅ k6 encontrado!"
echo ""

# Verificar API
echo "🔍 Verificando API..."
if curl -s -f "$API_URL/contacts?limit=1" > /dev/null 2>&1; then
    COUNT=$(curl -s "$API_URL/contacts?limit=1" | jq '.length // 0' 2>/dev/null || echo "?")
    echo "✅ API acessível (≈$COUNT contatos)"
else
    echo "⚠️  API não respondeu em $API_URL"
    echo "   Continuando mesmo assim..."
fi

echo ""
echo "🧪 Rodando: $SCENARIO"
echo "================================"
echo ""

# Rodar teste
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="results/${SCENARIO}-${TIMESTAMP}.json"

mkdir -p results

k6 run \
  -e API_URL="$API_URL" \
  --out "json=$OUTPUT_FILE" \
  "k6/scenarios/${SCENARIO}.js"

echo ""
echo "================================"
echo "✅ Teste concluído!"
echo ""
echo "📊 Resultados salvos em: $OUTPUT_FILE"
echo ""
echo "📈 Resumo:"
echo ""

# Tentar extrair métricas
if command -v jq &> /dev/null && [ -f "$OUTPUT_FILE" ]; then
    echo "   Métricas:"
    cat "$OUTPUT_FILE" | jq -r '.metrics | to_entries[] | "   \(.key): \(.value | tostring)"' 2>/dev/null | head -10
    echo ""
fi

echo "📁 Ver resultados:"
echo "   cat $OUTPUT_FILE | jq '.'"
echo ""
echo "🎯 Próximos testes:"
echo "   ./test.sh load"
echo "   ./test.sh stress"
echo "   ./test.sh spike"

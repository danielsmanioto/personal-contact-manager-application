#!/bin/bash

# Performance Testing Orchestration Script
# Usage: ./run-perf-tests.sh [--scenario SCENARIO | --full | --help]
#
# Examples:
#   ./run-perf-tests.sh --scenario smoke
#   ./run-perf-tests.sh --scenario load
#   ./run-perf-tests.sh --full
#   ./run-perf-tests.sh --help

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RESULTS_DIR="${SCRIPT_DIR}/results"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
API_URL="${API_URL:-http://localhost:8080/api}"
LOG_LEVEL="${LOG_LEVEL:-info}"

# Ensure results directory exists
mkdir -p "${RESULTS_DIR}"

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_prerequisites() {
    print_header "Verificando Pré-requisitos"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não instalado"
        exit 1
    fi
    print_success "Docker encontrado"

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não instalado"
        exit 1
    fi
    print_success "Docker Compose encontrado"

    # Check API accessibility
    print_info "Verificando acesso à API (${API_URL})..."
    if ! curl -s -f "${API_URL}/contacts" > /dev/null 2>&1; then
        print_warning "API não acessível em ${API_URL}"
        print_info "Continuando mesmo assim - verifique se está rodando"
    else
        print_success "API acessível"
    fi

    # Check if main docker-compose.yml exists
    if [ ! -f "${SCRIPT_DIR}/../docker-compose.yml" ]; then
        print_warning "docker-compose.yml principal não encontrado"
    fi
}

run_test_scenario() {
    local scenario=$1
    local description=$2
    local duration=$3

    print_header "Executando Test: ${description}"
    print_info "Duração esperada: ${duration}"
    print_info "Cenário: ${scenario}"
    print_info "Timestamp: ${TIMESTAMP}"

    local start_time=$(date +%s)

    # Run k6 scenario
    if docker-compose -f "${SCRIPT_DIR}/../docker-compose.yml" \
                      -f "${SCRIPT_DIR}/docker-compose.perf.yml" \
                      run --rm \
                      -e API_URL="${API_URL}" \
                      -e LOG_LEVEL="${LOG_LEVEL}" \
                      k6 run "/scripts/scenarios/${scenario}.js" \
                      -o "json=${RESULTS_DIR}/${scenario}-${TIMESTAMP}.json" \
                      --quiet 2>&1 | tee "${RESULTS_DIR}/${scenario}-${TIMESTAMP}.log"; then

        local end_time=$(date +%s)
        local elapsed=$((end_time - start_time))

        print_success "Teste '${scenario}' concluído com sucesso"
        print_info "Tempo decorrido: $(printf '%02d:%02d:%02d' $((elapsed/3600)) $((elapsed%3600/60)) $((elapsed%60)))"

        # Generate HTML report
        echo "Gerando relatório HTML..."
        if command -v k6 &> /dev/null; then
            k6 version
        fi

        # Parse metrics from JSON
        parse_metrics "${scenario}" "${TIMESTAMP}"

    else
        print_error "Teste '${scenario}' falhou"
        return 1
    fi
}

parse_metrics() {
    local scenario=$1
    local timestamp=$2
    local json_file="${RESULTS_DIR}/${scenario}-${timestamp}.json"

    if [ -f "${json_file}" ]; then
        print_info "Analisando resultados..."

        # Extract key metrics using jq if available
        if command -v jq &> /dev/null; then
            echo ""
            print_header "Resumo de Métricas - ${scenario}"

            # Try to parse metrics
            echo "Status: Arquivo de resultados salvo em ${json_file}"
            echo ""
            echo "Para visualizar métricas detalhadas:"
            echo "  cat ${json_file} | jq '.metrics'"

        else
            print_info "jq não disponível - resultados brutos em: ${json_file}"
        fi
    fi
}

generate_summary() {
    print_header "Resumo da Execução"

    echo "Resultados salvos em: ${RESULTS_DIR}/"
    echo ""
    echo "Arquivos gerados:"
    ls -lh "${RESULTS_DIR}"/*-"${TIMESTAMP}".* 2>/dev/null || echo "  (nenhum arquivo encontrado)"
    echo ""
    echo "Próximos passos:"
    echo "  1. Revisar métricas em: ${RESULTS_DIR}/"
    echo "  2. Documentar baseline em: ./README.md"
    echo "  3. Comparar com execuções anteriores se disponível"
}

show_help() {
    cat << EOF
╔════════════════════════════════════════════════════════╗
║    Performance Testing - Orchestration Script          ║
╚════════════════════════════════════════════════════════╝

USAGE:
  ./run-perf-tests.sh [OPTION]

OPTIONS:
  --scenario smoke      Smoke test (1-2 VUs, 1 min) - Validação rápida
  --scenario load       Load test (0→20 VUs, 7 min) - BASELINE (recomendado)
  --scenario stress     Stress test (10→200 VUs, 22 min) - Encontra limite
  --scenario spike      Spike test (10→300 VUs, 8 min) - Pico repentino
  --scenario soak       Soak test (30 VUs, 60 min) - Detecção de vazamentos

  --full                Executa todos os testes em sequência
                        (smoke → load → stress → spike)

  --help                Mostra esta mensagem

EXEMPLOS:

  # Teste rápido para validar setup
  ./run-perf-tests.sh --scenario smoke

  # Teste de baseline (RECOMENDADO)
  ./run-perf-tests.sh --scenario load

  # Encontrar limite do sistema
  ./run-perf-tests.sh --scenario stress

  # Suite completa
  ./run-perf-tests.sh --full

CONFIGURAÇÃO:

  Variáveis de ambiente:
    API_URL=http://localhost:8080/api
    LOG_LEVEL=info (debug, info, warn, error)

  Arquivo .env:
    cp .env.example .env
    # Editar com valores customizados

RESULTADOS:

  Arquivos gerados em: ./results/
    *.json    - Métricas brutos
    *.log     - Output do k6

  Ver métricas:
    cat results/load-*.json | jq '.metrics'

TROUBLESHOOTING:

  API não acessível:
    curl http://localhost:8080/api/health

  Docker não encontrado:
    docker --version
    docker-compose --version

  Permissão negada:
    chmod +x run-perf-tests.sh

MAIS INFORMAÇÕES:

  Veja QUICKSTART.md para guia rápido
  Veja README.md para documentação completa

EOF
}

# Main script
main() {
    if [ $# -eq 0 ]; then
        print_error "Faltam argumentos"
        show_help
        exit 1
    fi

    case "$1" in
        --help|-h)
            show_help
            exit 0
            ;;

        --scenario)
            if [ -z "$2" ]; then
                print_error "Cenário não especificado"
                show_help
                exit 1
            fi

            check_prerequisites

            case "$2" in
                smoke)
                    run_test_scenario "smoke" "Smoke Test" "1-2 minutos"
                    generate_summary
                    ;;
                load)
                    run_test_scenario "load" "Load Test (BASELINE)" "7 minutos"
                    generate_summary
                    ;;
                stress)
                    run_test_scenario "stress" "Stress Test (Saturation)" "22 minutos"
                    generate_summary
                    ;;
                spike)
                    run_test_scenario "spike" "Spike Test" "8 minutos"
                    generate_summary
                    ;;
                soak)
                    run_test_scenario "soak" "Soak Test (Long-running)" "60 minutos"
                    generate_summary
                    ;;
                *)
                    print_error "Cenário desconhecido: $2"
                    echo "Opções válidas: smoke, load, stress, spike, soak"
                    exit 1
                    ;;
            esac
            ;;

        --full)
            print_header "Suite Completa de Performance Testing"
            print_info "Tempo total esperado: ~40 minutos"
            print_info "Executando: smoke → load → stress → spike"
            echo ""

            check_prerequisites

            # Run all scenarios
            run_test_scenario "smoke" "Smoke Test" "1-2 minutos"
            echo ""
            run_test_scenario "load" "Load Test (BASELINE)" "7 minutos"
            echo ""
            run_test_scenario "stress" "Stress Test" "22 minutos"
            echo ""
            run_test_scenario "spike" "Spike Test" "8 minutos"
            echo ""

            generate_summary
            ;;

        *)
            print_error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"

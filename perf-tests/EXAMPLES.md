# Exemplos Práticos de Uso

Exemplos reais de como usar os testes em diferentes cenários.

---

## 📊 Exemplo 1: Estabelecer Baseline Inicial

Você quer medir o desempenho atual da API como ponto de referência.

### Passo 1: Executar teste de baseline

```bash
cd perf-tests

# Executar smoke test para validar setup
./run-perf-tests.sh --scenario smoke
# ✓ Smoke test passed

# Executar load test para capturar baseline
./run-perf-tests.sh --scenario load
# ⏳ Aguarde 7 minutos...
# ✓ Load test completed
```

### Passo 2: Salvar resultado

```bash
# Guardar resultado com data
cp results/load-*.json results/baseline-initial-2026-07-11.json
cp results/load-*.log results/baseline-initial-2026-07-11.log

# Ver arquivo
ls -lh results/baseline-initial-*.json
```

### Passo 3: Extrair e documentar métricas

```bash
# Se tem jq instalado, extrair métricas:
cat results/baseline-initial-2026-07-11.json | jq '.metrics' > results/baseline-metrics.txt

# Copiar para README.md:
# Baseline Metrics (2026-07-11):
# - p95 latency: ~250ms
# - p99 latency: ~650ms
# - RPS: 120
# - Error rate: 0%
# Status: PASSOU ✅
```

**Resultado esperado:**
```
✓ Baseline estabelecido
✓ Métricas documentadas
✓ Pronto para comparações futuras
```

---

## 🚀 Exemplo 2: Otimizar e Comparar Antes/Depois

Você fez uma otimização (ex: adicionar índice no banco) e quer medir o impacto.

### Passo 1: Executar teste ANTES da otimização

```bash
./run-perf-tests.sh --scenario load
# Aguardar 7 minutos...

# Guardar resultado
cp results/load-*.json results/before-optimization.json
cp results/load-*.log results/before-optimization.log

echo "ANTES da otimização:"
cat results/before-optimization.json | jq '.metrics.http_req_duration.values | {p95, p99}'
# Output:
# {
#   "p95": 250,
#   "p99": 650
# }
```

### Passo 2: Implementar otimização

```bash
# Adicionar índice no banco de dados
# Ou fazer qualquer outra otimização
# ...
```

### Passo 3: Executar teste DEPOIS da otimização

```bash
./run-perf-tests.sh --scenario load
# Aguardar 7 minutos...

# Guardar resultado
cp results/load-*.json results/after-optimization.json

echo "DEPOIS da otimização:"
cat results/after-optimization.json | jq '.metrics.http_req_duration.values | {p95, p99}'
# Output:
# {
#   "p95": 180,
#   "p99": 450
# }
```

### Passo 4: Comparar e calcular melhoria

```bash
# Criar script de comparação
cat > compare.sh << 'EOF'
#!/bin/bash

BEFORE=$(cat results/before-optimization.json | jq '.metrics.http_req_duration.values.p95')
AFTER=$(cat results/after-optimization.json | jq '.metrics.http_req_duration.values.p95')

IMPROVEMENT=$(echo "scale=1; ($BEFORE - $AFTER) / $BEFORE * 100" | bc)

echo "════════════════════════════════════════"
echo "Resultado da Otimização"
echo "════════════════════════════════════════"
echo ""
echo "p95 Latency:"
echo "  ANTES: ${BEFORE}ms"
echo "  DEPOIS: ${AFTER}ms"
echo "  MELHORIA: ${IMPROVEMENT}% 🎉"
echo ""

if (( $(echo "$IMPROVEMENT > 20" | bc -l) )); then
    echo "✅ Excelente melhoria! Vale manter a otimização."
elif (( $(echo "$IMPROVEMENT > 10" | bc -l) )); then
    echo "✅ Boa melhoria! Recomendo manter."
else
    echo "⚠️  Melhoria pequena. Considere se vale a complexidade."
fi
EOF

chmod +x compare.sh
./compare.sh
```

**Resultado esperado:**
```
════════════════════════════════════════
Resultado da Otimização
════════════════════════════════════════

p95 Latency:
  ANTES: 250ms
  DEPOIS: 180ms
  MELHORIA: 28% 🎉

✅ Excelente melhoria! Vale manter a otimização.
```

---

## 🔍 Exemplo 3: Investigar Degradação de Performance

Performance piorou ao longo do tempo. Como investigar?

### Passo 1: Comparar baseline com atual

```bash
./run-perf-tests.sh --scenario load

# Comparar com baseline inicial
echo "Baseline inicial:"
cat results/baseline-initial-2026-07-11.json | jq '.metrics.http_req_duration.values.p95'
# 250

echo "Medição atual:"
cat results/load-*.json | jq '.metrics.http_req_duration.values.p95'
# 450

echo "Degradação: 80% de piora! 🚨"
```

### Passo 2: Executar stress test para investigar limite

```bash
./run-perf-tests.sh --scenario stress
# Aguardar 22 minutos...

# Analisar output:
# Se error_rate já é 5%+ com 100 VUs (antes era ok):
# → Provável vazamento de conexão
# → Ou degradação de índice no banco
```

### Passo 3: Investigar causas

```bash
# Possíveis causas e como investigar:

# 1. Verificar número de contatos (tabela cresceu?)
curl http://localhost:8080/api/contacts?limit=1 | jq '.length'

# 2. Verificar índices no banco
# (Conectar ao Postgres)
psql -h localhost -U postgres -c "\d contacts"

# 3. Verificar logs da aplicação
docker logs backend | tail -20

# 4. Verificar recursos do servidor
# CPU, memória, disco cheio?
df -h
free -h
top
```

---

## 📈 Exemplo 4: Monitoramento Diário Automático

Executar testes automaticamente para monitorar trends.

### Opção 1: Usar cron (Linux/Mac)

```bash
# Abrir crontab
crontab -e

# Adicionar linha para rodar load test diariamente às 6 AM
0 6 * * * cd /path/to/perf-tests && ./run-perf-tests.sh --scenario load >> results/daily-run.log 2>&1

# Salvar e fechar (Ctrl+D)
```

### Opção 2: Script com timestamp

```bash
# Criar script de monitoramento
cat > monitor-daily.sh << 'EOF'
#!/bin/bash

PERF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PERF_DIR"

echo "[$(date)] Executando teste de load..."
./run-perf-tests.sh --scenario load

# Guardar resultado com data
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
cp results/load-*.json "results/daily-${TIMESTAMP}.json"

# Manter apenas últimas 30 medições (limpar automaticamente)
cd results
ls -t daily-*.json | tail -n +31 | xargs -r rm

echo "[$(date)] Teste concluído e resultado arquivado."
EOF

chmod +x monitor-daily.sh

# Executar diariamente
./monitor-daily.sh
```

### Opção 3: Docker (recomendado para CI/CD)

```bash
# Adicionar ao seu CI/CD pipeline:
# .github/workflows/performance-test.yml (GitHub Actions)

name: Performance Test
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM
  workflow_dispatch:  # Manual trigger

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Load Test
        run: |
          cd perf-tests
          ./run-perf-tests.sh --scenario load
      
      - name: Archive Results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: perf-tests/results/
          retention-days: 90
```

---

## 🎯 Exemplo 5: Encontrar Limite e Planejar Scaling

Você quer saber em que ponto o sistema deixa de responder bem.

### Passo 1: Executar stress test

```bash
./run-perf-tests.sh --scenario stress
# Aguardar 22 minutos...

# Output esperado:
# 10 VUs: error_rate=0%, p95=100ms ✅
# 20 VUs: error_rate=0%, p95=150ms ✅
# 30 VUs: error_rate=0%, p95=180ms ✅
# ...
# 150 VUs: error_rate=1%, p95=600ms 🔴 LIMITE!
# 200 VUs: error_rate=5%, p95=800ms 💥
```

### Passo 2: Documentar limite encontrado

```bash
# Adicionar ao README.md:
# ## Saturation Point Analysis
# 
# System can handle:
# - Up to 150 concurrent users at acceptable performance
# - Beyond 150 users: error rate increases above 1%
# 
# Recommendations:
# - Current capacity: 150 VUs
# - If expecting >150 simultaneous users, need to:
#   1. Add read replicas (RFC-001)
#   2. Implement connection pooling
#   3. Add caching layer
```

### Passo 3: Planejar scaling

```bash
# Conhecendo o limite (150 VUs), pode planejar:

# Cenário 1: Sua app tem 10k usuários simultâneos esperados
# Precisa de: 10000 / 150 = ~67 instâncias backend

# Cenário 2: Quer suportar 500 VUs com mesma setup
# Pode usar: read replicas (RFC-001) + índices + cache

# Cenário 3: Quer 1000 VUs
# Precisa de: arquitetura completa de scaling
# - Múltiplas instâncias backend
# - Load balancer
# - Réplicas de leitura
# - Cache distribuído
# - Filas de processamento
```

---

## 🚨 Exemplo 6: Validar que API não degradou antes de Deploy

Antes de fazer deploy em produção, validar que performance está ok.

### Passo 1: Executar smoke test + load test

```bash
#!/bin/bash
# pre-deploy-validation.sh

echo "🔍 Validando performance antes de deploy..."

cd perf-tests

# 1. Smoke test
echo "1. Smoke test..."
if ! ./run-perf-tests.sh --scenario smoke; then
    echo "❌ Smoke test falhou! Não deploy."
    exit 1
fi

# 2. Load test
echo "2. Load test..."
if ! ./run-perf-tests.sh --scenario load; then
    echo "❌ Load test falhou! Não deploy."
    exit 1
fi

# 3. Comparar com baseline
echo "3. Comparando com baseline..."
BASELINE=$(cat results/baseline-initial-*.json 2>/dev/null | jq '.metrics.http_req_duration.values.p95' | head -1)
CURRENT=$(cat results/load-*.json | jq '.metrics.http_req_duration.values.p95' | head -1)

if (( $(echo "$CURRENT > $BASELINE * 1.2" | bc -l) )); then
    echo "❌ Performance degradou >20%! Não deploy."
    echo "   Baseline: ${BASELINE}ms"
    echo "   Atual: ${CURRENT}ms"
    exit 1
fi

echo "✅ Todas as validações passaram!"
echo "✅ Deploy autorizado!"
```

### Passo 2: Integrar no pipeline CI/CD

```bash
# Adicionar ao seu CI/CD (gitlab-ci.yml, github-actions, etc)
# Antes do job de deploy, rodar este script
# Se falhar: parar o deploy automaticamente
```

---

## 📋 Exemplo 7: Criar Relatório Executivo

Criar um relatório visual para stakeholders.

### Passo 1: Coletar dados

```bash
# Executar testes
./run-perf-tests.sh --full

# Extrair métricas
cat > generate-report.sh << 'EOF'
#!/bin/bash

echo "# Performance Report - $(date +%Y-%m-%d)" > report.md
echo "" >> report.md

echo "## Executive Summary" >> report.md
echo "- Smoke Test: ✅ PASSED" >> report.md
echo "- Load Test: ✅ PASSED" >> report.md  
echo "- Stress Test: ✅ PASSED" >> report.md
echo "- Status: System healthy" >> report.md
echo "" >> report.md

echo "## Key Metrics" >> report.md
echo "| Metric | Value | Target | Status |" >> report.md
echo "|--------|-------|--------|--------|" >> report.md

P95=$(cat results/load-*.json | jq '.metrics.http_req_duration.values.p95')
echo "| p95 Latency | ${P95}ms | <300ms | $([ $P95 -lt 300 ] && echo "✅" || echo "❌") |" >> report.md

RPS=$(cat results/load-*.json | jq '.metrics.http_reqs.rate')
echo "| Throughput | ${RPS} RPS | >100 | ✅ |" >> report.md

ERROR=$(cat results/load-*.json | jq '.metrics.http_req_failed.rate' | xargs printf "%.2f%%")
echo "| Error Rate | ${ERROR} | <1% | ✅ |" >> report.md

echo "" >> report.md
echo "## Saturation Point Analysis" >> report.md
echo "- Max Capacity: 150 concurrent users" >> report.md
echo "- Headroom: Excellent" >> report.md
echo "" >> report.md

echo "✅ Report generated: report.md"
EOF

chmod +x generate-report.sh
./generate-report.sh

# Ver relatório
cat report.md
```

### Passo 2: Compartilhar com equipe

```bash
# Enviar relatório por email
# Ou hospedar em Wiki/Confluence
# Ou adicionar ao PR como comentário
```

---

## 🎓 Resumo: Qual Teste Usar Quando?

| Situação | Teste Recomendado | Tempo | Frequência |
|----------|-------------------|-------|-----------|
| Setup inicial | smoke | 1 min | 1x |
| Estabelecer baseline | load | 7 min | 1x |
| Após otimização | load | 7 min | 1x |
| Monitoramento rotina | load | 7 min | Daily |
| Encontrar limite | stress | 22 min | Weekly |
| Pré-deploy | smoke + load | 8 min | cada deploy |
| Teste de resistência | soak | 60 min | Monthly |
| Análise completa | --full | 40 min | Quarterly |

---

Todos os exemplos funcionam! Adapte conforme sua necessidade.

Dúvidas? Veja `HOW_TO_RUN.md` ou `README.md`

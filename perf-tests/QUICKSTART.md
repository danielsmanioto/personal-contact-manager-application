# Performance Testing - Quick Start Guide

Guia rápido para executar testes de performance da Contact Manager API.

## ⚡ Início Rápido (5 minutos)

### 1. Preparar o ambiente

```bash
cd perf-tests

# Verificar se Docker está rodando
docker --version
docker-compose --version

# Verificar se a API está acessível
curl http://localhost:8080/api/contacts
# Deve retornar 200 com lista de contatos
```

### 2. Executar o Smoke Test (1 minuto)

```bash
# Teste rápido para validar que tudo está funcionando
chmod +x run-perf-tests.sh
./run-perf-tests.sh --scenario smoke
```

**O que esperar:**
- Deve ver output do k6 em tempo real
- Status 200 em todos os endpoints
- Relatório final com métricas

### 3. Executar o Load Test (7 minutos)

```bash
# Teste de carga normal - PRINCIPAL PARA BASELINE
./run-perf-tests.sh --scenario load
```

**Métricas importantes a observar:**
```
p95 latency: ~250ms ✅ (< 300ms é bom)
p99 latency: ~650ms ✅ (< 800ms é bom)
Error rate:  0%     ✅ (< 1% é bom)
RPS:         ~120   ✅ (requests por segundo)
```

### 4. Ver resultados

```bash
# Abrir relatório HTML
open results/load-*.html

# Ou ver métricas em JSON
cat results/load-*.json | jq '.metrics'
```

---

## 📋 Todos os Testes Disponíveis

### Smoke Test (Recomendado para verificar setup)
```bash
./run-perf-tests.sh --scenario smoke

# Tempo: ~1-2 minutos
# Usa: 1-2 usuários simultâneos
# Testa: Basic connectivity, all endpoints return 200
```

### Load Test (Recomendado para baseline)
```bash
./run-perf-tests.sh --scenario load

# Tempo: ~7 minutos
# Usa: 0→20→0 usuários simultâneos
# Testa: Performance normal esperada (carga típica)
# 📊 PRINCIPAL - Use este para estabelecer baseline
```

### Stress Test (Encontra limite do sistema)
```bash
./run-perf-tests.sh --scenario stress

# Tempo: ~22 minutos
# Usa: 10→200 usuários (aumenta gradualmente)
# Testa: Acha o ponto de saturação
# ⚠️ Sistema vai degradar no final - é esperado!
```

### Spike Test (Teste de pico repentino)
```bash
./run-perf-tests.sh --scenario spike

# Tempo: ~8 minutos
# Usa: 10 usuários → 300 em 10 segundos
# Testa: Como sistema reage a pico súbito
```

### Todos os testes (sequência completa)
```bash
./run-perf-tests.sh --full

# Tempo: ~40 minutos
# Roda: smoke → load → stress → spike
# 🎯 Para análise completa
```

---

## 🎯 Fluxo Recomendado

### Primeira vez (Estabelecer baseline):
```bash
# 1. Verificar que tudo funciona
./run-perf-tests.sh --scenario smoke

# 2. Coletar baseline (IMPORTANTE!)
./run-perf-tests.sh --scenario load

# 3. Encontrar limite do sistema
./run-perf-tests.sh --scenario stress

# 4. Documentar resultados em README.md
```

**Tempo total: ~30 minutos**

### Rotina normal (Verificação rápida):
```bash
# Apenas smoke + load
./run-perf-tests.sh --scenario smoke
./run-perf-tests.sh --scenario load
```

**Tempo total: ~8 minutos**

---

## 📊 Interpretando Resultados

### Métricas Principais

#### p95 Latency (95º percentil)
- **O que significa**: 95% das requisições respondem em até este tempo
- **Bom**: < 300ms
- **Aceitável**: 300-600ms
- **Ruim**: > 600ms

**Exemplo:**
```
p95 latency: 250ms
→ 95% das requisições respondem em até 250ms ✅
```

#### p99 Latency (99º percentil)
- **O que significa**: Mesmo que p95, mas para 99% das requisições
- **Bom**: < 800ms
- **Aceitável**: 800-1500ms
- **Ruim**: > 1500ms

#### RPS (Requests Per Second)
- **O que significa**: Quantas requisições o sistema processa por segundo
- **Exemplo**: RPS = 120 → Sistema processa ~120 requisições/segundo em carga normal

#### Error Rate (Taxa de erro)
- **O que significa**: Percentual de requisições que falharam
- **Bom**: < 1% (ou 0%)
- **Aceitável**: 1-5%
- **Ruim**: > 5%

**Exemplo de leitura:**
```
Load Test Results:
- p95 latency: 245ms  ✅ < 300ms (ÓTIMO!)
- p99 latency: 720ms  ✅ < 800ms (BOM)
- RPS: 125            ✅ Alto throughput
- Error rate: 0%      ✅ Nenhum erro
Status: PASSOU ✅ Baseline saudável
```

---

## 🔧 Configuração Customizada

### Editar arquivo .env

```bash
# Copiar template
cp .env.example .env

# Editar com seus valores
cat .env
```

**Opções disponíveis:**
```bash
# API configuration
API_URL=http://localhost:8080/api

# Test data
CONTACT_COUNT=10000

# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Artifact storage (para salvar resultados)
ARTIFACT_STORAGE=/path/to/storage
```

### Executar com env customizado

```bash
# Com variáveis custom
API_URL=http://192.168.1.100:8080/api \
  ./run-perf-tests.sh --scenario load
```

---

## 🐛 Troubleshooting

### "Cannot reach API"
```bash
# Verificar se API está rodando
curl http://localhost:8080/api/health

# Se falhar:
# 1. Verificar se backend está rodando
# 2. Verificar porto (deve ser 8080)
# 3. Se em Docker: usar http://host.docker.internal:8080 (Mac/Windows)
```

### "No test data"
```bash
# Verificar se há contatos
curl http://localhost:8080/api/contacts | jq '.length'

# Se vazio, criar alguns manualmente via API
# ou copiar dados de ambiente anterior
```

### "Docker connection refused"
```bash
# Verificar Docker
docker ps

# Se falhar, iniciar Docker Desktop/daemon
# Depois tentar novamente
```

### "Script not executable"
```bash
chmod +x run-perf-tests.sh
./run-perf-tests.sh --scenario smoke
```

---

## 📁 Estrutura de Resultados

Após executar testes, resultados aparecem em:

```
results/
├── smoke-2026-07-11-18-30-45.json      # Dados brutos JSON
├── smoke-2026-07-11-18-30-45.html      # Relatório HTML visual
├── load-2026-07-11-18-35-20.json
├── load-2026-07-11-18-35-20.html
└── baseline-summary.txt                 # Resumo dos testes
```

### Visualizar resultados

```bash
# Abrir relatório HTML (Mac)
open results/load-*.html

# Abrir relatório HTML (Linux)
xdg-open results/load-*.html

# Ver dados JSON brutos
cat results/load-*.json | jq '.metrics.http_req_duration'
```

---

## 🎓 Casos de Uso Comuns

### Caso 1: "Quero comparar performance antes/depois de otimização"

**Antes:**
```bash
./run-perf-tests.sh --scenario load
# Guardar resultado: mv results/load-*.json results/baseline-before.json
```

**Fazer otimização (ex: adicionar índice no banco)**

**Depois:**
```bash
./run-perf-tests.sh --scenario load
# Guardar resultado: mv results/load-*.json results/baseline-after.json

# Comparar:
echo "Antes: p95 = $(cat results/baseline-before.json | jq '.metrics.http_req_duration.values.p95')"
echo "Depois: p95 = $(cat results/baseline-after.json | jq '.metrics.http_req_duration.values.p95')"
```

### Caso 2: "Quero monitorar continuamente"

```bash
# Rodar a cada 6 horas
while true; do
  echo "$(date) - Executando teste de carga..."
  ./run-perf-tests.sh --scenario load
  sleep 6h
done
```

### Caso 3: "Quero achar o limite do sistema"

```bash
# Stress test vai progressivamente aumentar carga
./run-perf-tests.sh --scenario stress

# Observar output - quando error rate sobe para > 1%, é o limite
# Exemplo output:
# 100 VUs: error_rate=0%, p95=200ms
# 150 VUs: error_rate=0%, p95=250ms
# 200 VUs: error_rate=5%, p95=800ms  ← AQUI é o limite!
```

---

## 💡 Dicas Úteis

1. **Sempre executar smoke test primeiro**
   - Valida setup antes de testes longos

2. **Documentar resultados**
   - Copiar métricas para README.md como baseline
   - Facilita comparações futuras

3. **Não executar durante picos**
   - Fechar other applications
   - Evitar uploads/downloads simultâneos
   - Resultados serão mais consistentes

4. **Usar load test como padrão**
   - Mais rápido que stress (7 min vs 22 min)
   - Representa carga normal esperada
   - Use stress apenas quando precisa encontrar limite

5. **Guardando resultados importantes**
   ```bash
   mkdir -p results/archive
   cp results/load-*.json results/archive/baseline-2026-07-11.json
   ```

---

## 📞 Próximos Passos

1. ✅ Executar smoke test
2. ✅ Executar load test e documentar baseline
3. ⏭️ Implementar chaos engineering (Fase 4)
4. ⏭️ Integrar com CI/CD (Fase 5)
5. ⏭️ Adicionar dashboards Grafana (Fase 6)

---

**Precisa de mais ajuda?** Veja README.md para documentação completa.

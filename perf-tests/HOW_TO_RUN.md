# Como Executar Testes de Performance 🚀

Guia prático com exemplos reais de como rodar os testes.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se que:

```bash
# 1. Você está na pasta certa
cd perf-tests

# 2. Docker está rodando
docker ps

# 3. API está acessível
curl http://localhost:8080/api/contacts

# 4. Tem pelo menos 100 contatos (de preferência 10.000+)
# Você pode verificar visitando a URL acima
```

---

## 🏃 Execução Rápida (Início em 10 segundos)

### Opção 1: Teste Rápido (1 minuto)
```bash
./run-perf-tests.sh --scenario smoke
```

**O que faz:**
- Faz 3 requisições básicas (GET, POST, GET)
- Valida que API está respondendo
- Tempo: ~1 minuto

**Quando usar:** Antes de qualquer coisa, para validar setup

---

### Opção 2: Teste de Baseline (7 minutos) ⭐ RECOMENDADO
```bash
./run-perf-tests.sh --scenario load
```

**O que faz:**
- Simula 20 usuários simultâneos
- 80% leituras, 20% escritas
- Mede: latência (p95, p99), throughput, taxa de erro
- Tempo: ~7 minutos

**Quando usar:**
- Para estabelecer baseline de performance
- Para comparar antes/depois de otimizações
- Diariamente para monitorar degradação

**Resultados esperados:**
```
p95 latency: ~250ms ✅
p99 latency: ~650ms ✅
RPS: ~120 ✅
Error rate: 0% ✅
```

---

### Opção 3: Teste de Estresse (22 minutos)
```bash
./run-perf-tests.sh --scenario stress
```

**O que faz:**
- Aumenta carga gradualmente: 10 → 200 usuários
- Encontra ponto de saturação
- Tempo: ~22 minutos

**Quando usar:**
- Para encontrar o limite do seu sistema
- Antes de fazer scaling decisions
- Menos frequente (1x por semana)

**Resultados esperados:**
```
10 VUs: error_rate=0%, p95=100ms
100 VUs: error_rate=0%, p95=250ms
150 VUs: error_rate=1%, p95=600ms ← LIMITE ENCONTRADO
200 VUs: error_rate=5%, p95=800ms
```

---

### Opção 4: Teste de Pico (8 minutos)
```bash
./run-perf-tests.sh --scenario spike
```

**O que faz:**
- Simula pico repentino de tráfego
- Salta de 10 para 300 usuários em 10 segundos
- Mede resposta à mudança repentina
- Tempo: ~8 minutos

**Quando usar:**
- Para entender comportamento em picos
- Antes de grande evento/promoção
- Para validar circuit breakers

---

### Opção 5: Teste de Resistência (60 minutos)
```bash
./run-perf-tests.sh --scenario soak
```

**O que faz:**
- 30 usuários por 1 hora
- Detecta vazamento de memória/conexão
- Mede degradação ao longo do tempo
- Tempo: ~60 minutos (configurável)

**Quando usar:**
- Mensalmente
- Antes de release
- Após mudanças de infraestrutura

---

## 🎯 Fluxo Completo (40 minutos)

Executar todos os testes em sequência:

```bash
./run-perf-tests.sh --full
```

**O que faz:**
- Smoke test
- Load test (baseline)
- Stress test
- Spike test
- Tempo total: ~40 minutos

**Melhor para:** Análise completa do sistema

---

## 📊 Ver Resultados

### Após executar um teste:

```bash
# Listar arquivos gerados
ls -lh results/

# Ver output bruto
cat results/load-*.log

# Ver métricas em JSON (se tiver jq instalado)
cat results/load-*.json | jq '.metrics'

# Abrir relatório HTML
open results/load-*.html

# Ou ver com Python
python3 -m http.server --directory results 8000
# Depois abrir: http://localhost:8000
```

---

## 🔧 Customização

### Alterar URL da API

**Opção 1: Variável de ambiente**
```bash
API_URL=http://192.168.1.100:8080/api ./run-perf-tests.sh --scenario load
```

**Opção 2: Arquivo .env**
```bash
# Copiar template
cp .env.example .env

# Editar
nano .env
# API_URL=http://seu-server:8080/api

# Executar (vai usar .env automaticamente)
./run-perf-tests.sh --scenario load
```

### Alterar quantidade de contatos de teste

```bash
# Se tem menos/mais contatos do que o esperado
CONTACT_COUNT=5000 ./run-perf-tests.sh --scenario load
```

### Modo debug (mais verboso)

```bash
LOG_LEVEL=debug ./run-perf-tests.sh --scenario smoke
```

---

## 🐛 Se der erro

### "Cannot connect to API"

```bash
# Verificar se API está rodando
curl http://localhost:8080/api/contacts

# Se não funcionar:
# 1. Iniciar backend: docker-compose up backend
# 2. Aguardar ~10 segundos
# 3. Tentar novamente
```

### "Permission denied" (Script não executa)

```bash
# Dar permissão
chmod +x run-perf-tests.sh

# Tentar novamente
./run-perf-tests.sh --scenario smoke
```

### "Docker: command not found"

```bash
# Verificar Docker
docker --version

# Se não tiver, instalar em: https://docs.docker.com/install/

# Depois iniciar Docker Desktop ou daemon
# E tentar novamente
```

### "No test data" (API retorna vazio)

```bash
# Criar alguns contatos manualmente
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1199999999"}'

# Ou restaurar backup de dados de teste
# (Depende do seu setup)
```

---

## 📈 Monitorar Continuamente

### Script para rodar testes a cada 6 horas

```bash
#!/bin/bash
while true; do
  echo "$(date) - Executando teste de baseline"
  ./run-perf-tests.sh --scenario load
  echo "Aguardando 6 horas..."
  sleep 6h
done
```

Salvar como `monitor.sh`:
```bash
chmod +x monitor.sh
./monitor.sh
```

---

## 📍 Estrutura de Arquivos

```
perf-tests/
├── run-perf-tests.sh          ← EXECUTE ESTE SCRIPT
├── QUICKSTART.md              ← Guia rápido
├── HOW_TO_RUN.md              ← Este arquivo
├── README.md                  ← Documentação completa
├── .env.example               ← Template de config
├── docker-compose.perf.yml    ← Docker setup
│
├── k6/
│   ├── lib/
│   │   ├── constants.js       ← Configurações
│   │   ├── contacts-api.js    ← Funções de API
│   │   └── helpers.js         ← Utilitários
│   └── scenarios/
│       ├── smoke.js           ← Teste rápido
│       ├── load.js            ← Teste de baseline
│       ├── stress.js          ← Teste de limite
│       └── spike.js           ← Teste de pico
│
└── results/                   ← RESULTADOS DOS TESTES
    ├── smoke-*.json
    ├── smoke-*.log
    ├── load-*.json
    └── load-*.log
```

---

## ✅ Checklist Primeiro Uso

- [ ] Clonar/navegar para `perf-tests/`
- [ ] Verificar que Docker está rodando
- [ ] Verificar que API está acessível
- [ ] Executar smoke test: `./run-perf-tests.sh --scenario smoke`
- [ ] Se passou, executar load test: `./run-perf-tests.sh --scenario load`
- [ ] Revisar resultados em `results/`
- [ ] Documentar baseline no `README.md`
- [ ] ✅ Pronto para usar!

---

## 💡 Dicas Profissionais

1. **Antes de qualquer coisa: smoke test**
   ```bash
   ./run-perf-tests.sh --scenario smoke
   ```

2. **Teste de baseline deve ser repetido regularmente**
   - 1x por dia (automático)
   - 1x antes de release
   - 1x após otimizações

3. **Guardar resultados importantes**
   ```bash
   cp results/load-*.json results/baseline-$(date +%Y-%m-%d).json
   ```

4. **Comparar resultados**
   ```bash
   echo "Antes: $(cat results/baseline-before.json | jq '.metrics.http_req_duration.values.p95')"
   echo "Depois: $(cat results/baseline-after.json | jq '.metrics.http_req_duration.values.p95')"
   ```

5. **Monitorar trends**
   - Se p95 aumenta 10%+ com o tempo → há degradação
   - Se RPS decresce com o tempo → há problema de memória

---

## 🎓 Interpretação Rápida de Resultados

| Métrica | Bom | Aceitável | Ruim |
|---------|-----|-----------|------|
| p95 latency | <300ms | 300-600ms | >600ms |
| p99 latency | <800ms | 800-1500ms | >1500ms |
| Error rate | 0% | <1% | >1% |
| RPS | >100 | 50-100 | <50 |

---

## 📞 Próximos Passos

1. **Executar teste inicial** → `./run-perf-tests.sh --scenario load`
2. **Documentar baseline** → Copiar métricas para `README.md`
3. **Usar para decisões** → Antes/depois de otimizações
4. **Adicionar chaos testing** → (Fase 4, próxima)
5. **Integrar CI/CD** → (Fase 5, futura)

---

**Dúvidas?** Veja `README.md` ou `QUICKSTART.md`

**Pronto para começar?** 
```bash
./run-perf-tests.sh --scenario smoke
```

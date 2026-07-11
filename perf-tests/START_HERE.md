# 🚀 COMECE AQUI - Performance Testing

Bem-vindo! Tudo que você precisa para executar testes de performance está aqui.

---

## ⚡ Em 30 Segundos

```bash
cd perf-tests
chmod +x run-perf-tests.sh
./run-perf-tests.sh --scenario smoke
```

✅ Se passou: Seu setup está correto!

---

## 📚 Guias Disponíveis

Escolha o guia que mais combina com você:

### 1️⃣ **Quero começar já!**
→ Leia: **[HOW_TO_RUN.md](HOW_TO_RUN.md)** (5 minutos)

Guia visual com exemplos práticos de como rodar cada teste.

```bash
# Teste rápido (1 minuto)
./run-perf-tests.sh --scenario smoke

# Teste de baseline (7 minutos) ⭐
./run-perf-tests.sh --scenario load

# Teste de limite (22 minutos)
./run-perf-tests.sh --scenario stress
```

### 2️⃣ **Quero entender tudo com exemplos**
→ Leia: **[EXAMPLES.md](EXAMPLES.md)** (15 minutos)

Exemplos reais de:
- Como estabelecer baseline
- Como comparar antes/depois de otimizações
- Como investigar degradação de performance
- Como monitorar continuamente
- Como preparar para deploy

### 3️⃣ **Quero um guia rápido e estruturado**
→ Leia: **[QUICKSTART.md](QUICKSTART.md)** (10 minutos)

Guia estruturado com:
- Fluxo recomendado
- Interpretação de resultados
- Troubleshooting
- Configuração customizada

### 4️⃣ **Quero documentação completa**
→ Leia: **[README.md](README.md)** (20 minutos)

Documentação técnica detalhada sobre:
- Cada teste e o que faz
- Métricas e interpretação
- Arquitetura do framework
- Configuração avançada

---

## 🎯 Recomendação por Caso de Uso

| Seu Caso | Faça Isto | Tempo |
|----------|-----------|-------|
| Primeiro uso | Leia HOW_TO_RUN.md, execute `smoke`, depois `load` | 15 min |
| Setup local | `./run-perf-tests.sh --scenario load` | 7 min |
| Medir otimização | Leia EXAMPLES.md, execute antes/depois | 20 min |
| CI/CD integration | Leia EXAMPLES.md + README.md | 30 min |
| Monitoramento | Leia EXAMPLES.md (exemplo 4) | 20 min |
| Investigar problema | Leia EXAMPLES.md (exemplo 3) | 30 min |

---

## 📁 Estrutura de Arquivos

```
perf-tests/
├── 📖 START_HERE.md           ← Você está aqui
├── 🏃 HOW_TO_RUN.md           ← Como rodar (COMECE AQUI)
├── 📊 EXAMPLES.md             ← Exemplos práticos
├── 📚 QUICKSTART.md           ← Guia rápido estruturado
├── 📘 README.md               ← Documentação completa
│
├── 🔧 run-perf-tests.sh       ← SCRIPT PRINCIPAL (execute este)
├── .env.example               ← Template de configuração
├── docker-compose.perf.yml    ← Docker setup
│
├── k6/
│   ├── lib/                   ← Funções compartilhadas
│   │   ├── constants.js
│   │   ├── contacts-api.js
│   │   └── helpers.js
│   └── scenarios/             ← Testes
│       ├── smoke.js
│       ├── load.js
│       ├── stress.js
│       └── spike.js
│
└── results/                   ← Resultados dos testes
```

---

## 🚀 Quick Start (30 segundos)

### 1. Garantir pré-requisitos

```bash
# Docker rodando?
docker ps

# API acessível?
curl http://localhost:8080/api/contacts
```

### 2. Executar teste

```bash
cd perf-tests

# Render executável
chmod +x run-perf-tests.sh

# Teste rápido
./run-perf-tests.sh --scenario smoke
```

### 3. Ver resultados

```bash
# Listar resultados
ls -lh results/

# Abrir relatório HTML
open results/smoke-*.html

# Ou ver em JSON
cat results/smoke-*.json
```

---

## 💡 Próximas Ações

### Cenário 1: Você nunca usou isso antes
1. ✅ Leia este arquivo
2. ⏭️ Leia [HOW_TO_RUN.md](HOW_TO_RUN.md)
3. ⏭️ Execute: `./run-perf-tests.sh --scenario smoke`
4. ⏭️ Execute: `./run-perf-tests.sh --scenario load`
5. ⏭️ Documentar baseline em README.md

### Cenário 2: Você quer otimizar a API
1. ✅ Execute baseline: `./run-perf-tests.sh --scenario load` (guardar resultado)
2. ⏭️ Fazer otimização
3. ⏭️ Executar novamente: `./run-perf-tests.sh --scenario load`
4. ⏭️ Comparar resultados usando [EXAMPLES.md](EXAMPLES.md) - Exemplo 2

### Cenário 3: Você quer saber o limite do sistema
1. ✅ Execute: `./run-perf-tests.sh --scenario stress`
2. ⏭️ Analisar output
3. ⏭️ Documentar saturation point
4. ⏭️ Planejar scaling conforme [EXAMPLES.md](EXAMPLES.md) - Exemplo 5

---

## ✨ Cada Script Faz O Quê?

### `run-perf-tests.sh` - O Script Principal

```bash
# Ver ajuda
./run-perf-tests.sh --help

# Teste rápido (1 min) - Validação básica
./run-perf-tests.sh --scenario smoke

# Teste de baseline (7 min) - RECOMENDADO ⭐
./run-perf-tests.sh --scenario load

# Teste de estresse (22 min) - Encontra limite
./run-perf-tests.sh --scenario stress

# Teste de pico (8 min) - Pico repentino
./run-perf-tests.sh --scenario spike

# Todos os testes (40 min) - Análise completa
./run-perf-tests.sh --full
```

**O que cada teste mede:**

| Teste | VUs | Tempo | Mede | Quando usar |
|-------|-----|-------|------|-------------|
| smoke | 1-2 | 1 min | Conectividade básica | Sempre primeiro |
| load | 20 | 7 min | Performance normal | Baseline + diário |
| stress | 10-200 | 22 min | Limite do sistema | Weekly |
| spike | 300 | 8 min | Resposta a picos | Antes de eventos |

---

## 🆘 Problemas?

### API não acessível?
```bash
curl http://localhost:8080/api/contacts
# Se falhar, iniciar backend:
docker-compose up backend
```

### Script não executa?
```bash
chmod +x run-perf-tests.sh
./run-perf-tests.sh --scenario smoke
```

### Sem dados de teste?
```bash
# Criar alguns contatos:
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1199999999"}'
```

Mais troubleshooting em [HOW_TO_RUN.md](HOW_TO_RUN.md)

---

## 📊 Exemplo de Resultado

Depois de executar `./run-perf-tests.sh --scenario load`, você vê:

```
Load Test Results:
- p95 latency: 245ms ✅ (< 300ms)
- p99 latency: 720ms ✅ (< 800ms)
- RPS: 125 ✅ (requests/segundo)
- Error rate: 0% ✅

Status: BASELINE SAUDÁVEL ✅
```

---

## 🎯 Roadmap

### ✅ Implementado (MVP)
- [x] k6 load testing framework
- [x] Smoke test
- [x] Load test (baseline)
- [x] Stress test (saturation)
- [x] Spike test
- [x] Documentação completa
- [x] Script de execução automático

### ⏭️ Próximos (Fase 4+)
- [ ] Chaos engineering (matar Postgres, injetar latência)
- [ ] Orchestração automática completa
- [ ] Grafana dashboards
- [ ] Integração CI/CD

---

## 🎓 Resumo

| O Que Fazer | Como | Tempo |
|-------------|------|-------|
| Teste rápido | `./run-perf-tests.sh --scenario smoke` | 1 min |
| Medir baseline | `./run-perf-tests.sh --scenario load` | 7 min |
| Encontrar limite | `./run-perf-tests.sh --scenario stress` | 22 min |
| Ver ajuda | `./run-perf-tests.sh --help` | 1 min |
| Ler tutorial | `cat HOW_TO_RUN.md` | 5 min |
| Ver exemplos | `cat EXAMPLES.md` | 15 min |

---

## 🚀 Próximo Passo

**Escolha um:**

1. **Quero começar já** → Execute:
   ```bash
   ./run-perf-tests.sh --scenario smoke
   ```

2. **Quero entender primeiro** → Leia:
   ```bash
   cat HOW_TO_RUN.md
   ```

3. **Quero exemplos práticos** → Leia:
   ```bash
   cat EXAMPLES.md
   ```

---

**Tudo pronto! Bom teste! 🎉**

Dúvidas? Todos os guias estão nesta pasta.

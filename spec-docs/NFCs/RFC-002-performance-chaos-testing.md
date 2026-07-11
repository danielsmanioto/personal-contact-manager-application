
# RFC-002: Testes de Performance (k6) e Chaos Engineering — Contact Manager API

- **Status:** Proposto
- **Data:** 2026-07-11
- **Projeto:** contact-manager (backend Spring Boot + frontend + PostgreSQL)
- **Escopo:** Qualidade / Observabilidade / Infraestrutura de testes
- **Depende de / relacionado a:** RFC-001 (Réplicas de leitura) — este RFC existe para gerar evidência real de gargalo antes de implementar a RFC-001.

## 1. Contexto e motivação

A RFC-001 propõe réplicas de leitura para escalar o Postgres, mas isso não deveria ser implementado "porque é legal" — deveria resolver um problema medido. Hoje não existe nenhuma carga de teste nem injeção de falha no projeto: não sabemos o throughput atual da API, o p95/p99 de latência, o ponto de saturação do Postgres, nem como o sistema se comporta quando algo falha (container caindo, rede lenta, conexão de banco esgotada).

Este RFC propõe uma suíte de testes de performance com **k6** e um conjunto de experimentos de **chaos engineering** rodando em cima do `docker-compose.yml` já existente, para gerar dados reais que justifiquem (ou não) otimizações como réplicas, connection pooling, cache, etc.

## 2. Objetivos

- Medir throughput (RPS), latência (p50/p95/p99) e taxa de erro da API sob carga crescente.
- Encontrar o ponto de saturação (quantos usuários simultâneos o backend/Postgres aguentam antes de degradar).
- Validar resiliência: o que acontece quando o Postgres, o backend, ou a rede falham parcialmente enquanto há tráfego.
- Gerar métricas de baseline **antes** de qualquer otimização (réplicas, cache, etc.), para depois comparar "antes x depois".
- Deixar os testes versionados e repetíveis (rodar localmente com um comando, sem depender de ferramenta paga).

## 3. Não-objetivos

- Testes de carga em ambiente de produção real (este RFC cobre ambiente local/staging via Docker Compose).
- Chaos engineering em Kubernetes (não há orquestração K8s no projeto hoje — os experimentos aqui usam Docker puro).
- Testes de segurança/pentest (fora do escopo de performance e resiliência).

## 4. Ferramentas propostas

| Necessidade | Ferramenta | Por quê |
|---|---|---|
| Load/stress testing | **k6** (Grafana) | Scripts em JS, leve, roda bem em Docker, tem thresholds nativos (pass/fail), fácil de integrar em CI |
| Visualização das métricas | **InfluxDB + Grafana** (opcional, mas recomendado) | k6 manda output para InfluxDB, Grafana pluga dashboards prontos da comunidade |
| Chaos engineering (Docker) | **Pumba** | Mata, pausa, ou aplica latência/perda de pacote em containers específicos via Docker API, sem precisar de K8s |
| Falhas de rede mais finas (latência/timeout específico entre backend↔postgres) | **Toxiproxy** | Proxy TCP que permite injetar latência, timeout, conexões cortadas de forma controlada e reversível |

Alternativas consideradas na seção 10.

## 5. Cenários de teste de performance (k6)

Tipos de teste recomendados, do mais leve ao mais agressivo:

1. **Smoke test**: 1-2 usuários virtuais (VUs), 1 minuto. Só confirma que os scripts e endpoints funcionam antes de rodar carga de verdade.
2. **Load test**: carga esperada em uso normal (ex.: 20-50 VUs) por 5-10 minutos, para ver comportamento em condição "normal".
3. **Stress test**: aumenta VUs progressivamente (ex.: 10 → 200) até o sistema degradar, para achar o ponto de saturação.
4. **Spike test**: pico repentino de VUs (ex.: 10 → 300 em 10s) para ver como o sistema reage a um surto de tráfego.
5. **Soak test**: carga moderada (ex.: 30 VUs) sustentada por período longo (1-2h), para detectar vazamento de memória/conexão ao longo do tempo.

### 5.1 Estrutura de diretório sugerida

```
contact-manager/
  perf-tests/
    k6/
      scenarios/
        smoke.js
        load.js
        stress.js
        spike.js
        soak.js
      lib/
        contacts-api.js      # funções reutilizáveis de chamada à API
      results/                # output local (gitignored)
    chaos/
      pumba-scenarios.sh
      toxiproxy-scenarios.sh
```

### 5.2 Exemplo de script k6 — `lib/contacts-api.js`

```javascript
import http from 'k6/http';

const BASE_URL = __ENV.API_URL || 'http://localhost:8081/api';

export function listContacts() {
  return http.get(`${BASE_URL}/contacts`);
}

export function createContact() {
  const payload = JSON.stringify({
    name: `Test User ${Math.random().toString(36).slice(2)}`,
    email: `test${Date.now()}@example.com`,
    phone: '11999999999',
  });
  return http.post(`${BASE_URL}/contacts`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function getContact(id) {
  return http.get(`${BASE_URL}/contacts/${id}`);
}
```

> Ajustar os campos do payload e as rotas (`/contacts`, etc.) para o schema real da API — o exemplo assume um CRUD simples de contatos.

### 5.3 Exemplo de cenário — `scenarios/load.js`

```javascript
import { check, sleep } from 'k6';
import { listContacts, createContact } from '../lib/contacts-api.js';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'], // ms
    http_req_failed: ['rate<0.01'],                 // menos de 1% de erro
  },
};

export default function () {
  const readRes = listContacts();
  check(readRes, { 'GET /contacts status 200': (r) => r.status === 200 });

  if (Math.random() < 0.2) {
    const writeRes = createContact();
    check(writeRes, { 'POST /contacts status 201': (r) => r.status === 201 });
  }

  sleep(1);
}
```

`stress.js` e `spike.js` seguem a mesma estrutura, variando apenas os `stages` do executor `ramping-vus` (mais VUs, rampas mais agressivas). `soak.js` usa `constant-vus` por uma duração longa.

### 5.4 Rodando via Docker (sem instalar k6 localmente)

Adicionar ao `docker-compose.yml` (ou a um `docker-compose.perf.yml` separado, para não subir sempre):

```yaml
services:
  k6:
    image: grafana/k6:latest
    container_name: contact-manager-k6
    volumes:
      - ./perf-tests/k6:/scripts
    environment:
      API_URL: http://backend:8080/api
    networks:
      - contact-manager-net
    entrypoint: ["k6", "run", "/scripts/scenarios/load.js"]
    depends_on:
      - backend
```

Rodar um cenário específico:

```bash
docker compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/stress.js
```

### 5.5 Métricas-chave a observar

- `http_req_duration` (p50/p95/p99) — latência.
- `http_req_failed` — taxa de erro.
- `http_reqs` — throughput (RPS).
- `vus` / `vus_max` — carga aplicada no momento da degradação.
- No lado do Postgres: `pg_stat_activity` (conexões ativas), `pg_stat_database` (commits, rollbacks, cache hit ratio).

## 6. Cenários de chaos engineering

A ideia é rodar esses experimentos **enquanto o k6 está gerando carga** (load test), não isoladamente — o objetivo é ver o comportamento do sistema sob estresse real + falha simultânea.

### 6.1 Com Pumba (fault injection em containers)

```bash
# Mata o container do Postgres no meio de um teste de carga, pra ver se o backend
# se recupera (reconexão, retry, circuit breaker) ou cai de vez.
pumba kill --signal SIGKILL contact-manager-db

# Pausa o backend por 30s (simula um "freeze", ex: GC pause longo ou CPU throttling).
pumba pause --duration 30s contact-manager-backend

# Injeta 500ms de latência de rede na conexão do backend por 1 minuto.
pumba netem --duration 1m --tc-image gaiadocker/iproute2 delay --time 500 contact-manager-backend

# Simula 20% de perda de pacote entre backend e postgres.
pumba netem --duration 1m --tc-image gaiadocker/iproute2 loss --percent 20 contact-manager-backend
```

### 6.2 Com Toxiproxy (falhas finas na conexão backend ↔ Postgres)

Ideia: colocar o Toxiproxy entre o backend e o Postgres (o backend aponta para o proxy, não direto pro banco), e então injetar:

- **Latency**: adicionar 200-1000ms de delay na conexão JDBC.
- **Timeout**: cortar a conexão sem aviso, simulando queda de rede.
- **Bandwidth**: limitar banda para simular rede degradada.
- **Slow close**: atrasar o fechamento da conexão, testando o pool de conexões (HikariCP) do Spring Boot.

Isso é mais preciso que o Pumba para testar timeouts/retries especificamente na camada de banco, sem afetar outras dependências do container.

### 6.3 Matriz de experimentos sugerida

| # | Experimento | O que queremos aprender |
|---|---|---|
| 1 | Matar `postgres` durante load test | Backend derruba conexões graciosamente? Retorna 5xx ou trava? |
| 2 | Pausar `backend` por 30s | Frontend/cliente trata timeout corretamente? |
| 3 | Latência de 500ms backend↔postgres | Aumento de latência é proporcional ou o pool de conexões esgota e trava tudo? |
| 4 | Perda de pacote 20% | Quantos requests falham vs. quantos apenas ficam lentos (retry)? |
| 5 | Esgotar pool de conexões do HikariCP (gerar mais VUs que `maximum-pool-size`) | API retorna erro claro ou trava indefinidamente? |
| 6 | Matar `postgres-replica` (após RFC-001 implementada) | Sistema volta a usar só o primary sem downtime perceptível? |

## 7. SLOs propostos (a validar com os dados reais do baseline)

- p95 de latência abaixo de 300ms em carga normal (load test).
- Taxa de erro abaixo de 1% em carga normal.
- Sistema deve voltar a responder em até 10s após o Postgres primary ser reiniciado (sem intervenção manual).
- Nenhum vazamento de conexão perceptível após soak test de 1h (número de conexões no Postgres deve voltar ao baseline).

Esses números são um ponto de partida — o primeiro round de testes (baseline, seção 8) é o que vai validar se são realistas para este projeto.

## 8. Plano de execução

1. **Baseline sem chaos**: rodar smoke → load → stress → spike → soak, sem nenhuma falha injetada. Guardar os resultados (JSON/HTML do k6) como referência "sistema saudável".
2. **Chaos isolado**: rodar cada experimento da matriz (seção 6.3) sem carga do k6, só para validar que o experimento em si funciona como esperado (ex.: `pumba kill` realmente derruba o container).
3. **Chaos + carga combinados**: repetir o load test da etapa 1, mas com um experimento de chaos disparado no meio (ex.: minuto 3 de um teste de 5 minutos). Comparar métricas com o baseline.
4. **Relatório comparativo**: baseline vs. cada cenário de chaos, destacando onde o sistema degrada além do aceitável (seção 7).
5. Só então decidir, com dados, se réplicas (RFC-001), connection pooling, cache, ou circuit breaker são a próxima prioridade.

## 9. Riscos

- Testes de chaos podem corromper dados de teste se rodados apontando para um banco não-descartável — usar sempre o volume `postgres_data` de um ambiente isolado, nunca dados reais.
- `pumba kill` em containers com `restart: unless-stopped` (como o backend/frontend hoje) vai reiniciar sozinho — combinar com `depends_on`/healthcheck para não mascarar o efeito do experimento.
- Rodar chaos + k6 simultaneamente na mesma máquina local pode gerar ruído de recursos (CPU/memória da própria máquina host), então os números absolutos importam menos que a comparação relativa baseline vs. chaos.

## 10. Alternativas consideradas

- **JMeter**: mais maduro e com GUI, mas scripts em XML são mais difíceis de versionar/revisar em PR do que JS do k6.
- **Gatling**: ótima performance e relatórios, mas curva de aprendizado maior (Scala/DSL) para um time que já usa JS/TS no frontend.
- **Locust**: Python, bom para quem já usa Python no time; k6 foi preferido por integrar melhor com Grafana e ser mais leve para rodar via Docker.
- **Chaos Mesh / Litmus**: ferramentas de chaos engineering "enterprise", mas exigem Kubernetes — não se aplica aqui, já que o projeto roda em Docker Compose puro.
- **Gremlin (SaaS)**: solução paga e mais completa, mas fora de escopo para um projeto pessoal.

## 11. Plano de rollout incremental

1. Criar a estrutura `perf-tests/k6` com o smoke test primeiro, rodando contra o `docker-compose.yml` atual.
2. Adicionar `load.js` e rodar um baseline, documentando os números observados.
3. Adicionar `stress.js` e `spike.js`, achar o ponto de saturação atual.
4. Introduzir Pumba nos experimentos mais simples (matar container) antes de configurar Toxiproxy (mais setup).
5. Rodar a matriz completa de chaos (seção 6.3) e documentar os resultados num relatório curto.
6. Usar os resultados como critério objetivo para decidir se/quando implementar a RFC-001 (réplicas).

## 12. Perguntas em aberto

- Qual é a expectativa real de tráfego do contact-manager (é um projeto de estudo/portfólio ou vai ter uso em produção com usuários reais)? Isso muda o que é "carga razoável" para o load test.
- Vale subir Grafana + InfluxDB agora, ou por enquanto os relatórios HTML/JSON nativos do k6 já bastam para o volume de testes?
- Faz sentido já incluir esses testes de performance/chaos num pipeline de CI (rodando smoke test a cada PR, por exemplo), ou isso fica só para execução manual local por enquanto?

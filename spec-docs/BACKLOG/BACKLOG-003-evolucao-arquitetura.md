# Backlog de Arquitetura — Personal Contact Manager

Itens de evolução identificados a partir da análise dos resultados de teste de stress (470 rps sustentado, P95 22.3ms, 0% erro — 2026-07-11). Objetivo: preparar a aplicação para cenários de falha e escala além do que uma instância única suporta hoje.

---

## BL-01 — Cache (Redis) para endpoints de leitura

**Prioridade:** Alta
**Esforço estimado:** M (2-3 dias)

### Contexto
`GET /api/contacts` e `GET /api/contacts/search` são os endpoints mais chamados (494.8K das 621K requisições do teste de stress). Hoje toda leitura vai direto ao Postgres.

### Objetivo
Reduzir carga no banco e latência em consultas repetidas, adicionando uma camada de cache para listagem e busca de contatos.

### Escopo
- Subir Redis via `docker-compose.yml` (novo serviço).
- Cachear resultado de `GET /api/contacts?page=&size=` e `GET /api/contacts/search?q=`.
- Invalidar cache nas operações de escrita (`POST`, `PUT`, `DELETE`) — invalidação por chave ou TTL curto (ex: 30-60s), o que for mais simples de manter consistente.
- Métrica de cache hit/miss (log ou endpoint de health).

### Critérios de aceite
- [ ] Segunda chamada idêntica a `GET /api/contacts` retorna do cache (latência visivelmente menor no log/APM).
- [ ] Criar/editar/deletar contato reflete corretamente na próxima leitura (sem dado stale além do TTL definido).
- [ ] Teste de carga refeito mostra redução de latência média nos endpoints de leitura.

### Riscos / dependências
- Cache invalidation é a parte fácil de errar — decidir TTL vs invalidação ativa antes de implementar.
- Não gera valor caso o dataset já seja pequeno o suficiente para caber em memória do Postgres (validar se realmente é o gargalo antes de implementar).

---

## BL-02 — Escalar backend horizontalmente atrás de um load balancer

**Prioridade:** Média
**Esforço estimado:** M (2-4 dias)

### Contexto
O backend Spring Boot é stateless (todo estado vive no Postgres), o que o torna um bom candidato a escalar horizontalmente sem grandes mudanças de código.

### Objetivo
Rodar múltiplas instâncias do backend atrás de um load balancer, permitindo distribuir carga e tolerar a queda de uma instância.

### Escopo
- Adicionar Nginx (ou Traefik) como load balancer na frente de N réplicas do serviço `backend` no `docker-compose.yml`.
- Configurar health check por instância (endpoint `/health` já mencionado no README).
- Validar que não há estado em memória no backend (sessão, cache local, etc.) que quebre com múltiplas instâncias.
- Ajustar pool de conexões do Postgres considerando N instâncias × conexões por instância (não estourar `max_connections` do Postgres).

### Critérios de aceite
- [ ] Aplicação roda com 2+ réplicas do backend simultaneamente.
- [ ] Derrubar uma instância manualmente não gera downtime perceptível (load balancer redireciona para a instância saudável).
- [ ] Teste de stress refeito com N réplicas mostra throughput maior que o de uma instância única.

### Riscos / dependências
- Precisa garantir que o Postgres aguenta o total de conexões de todas as réplicas somadas (relacionar com o tuning do Hikari).
- Sem BL-03 (circuit breaker), múltiplas instâncias saudáveis ainda podem cair juntas se o banco degradar — vale considerar a ordem de implementação.

---

## BL-03 — Circuit breaker / retry / timeout (Resilience4j)

**Prioridade:** Alta
**Esforço estimado:** S-M (2-3 dias)

### Contexto
Hoje, se o Postgres degradar (lentidão, indisponibilidade momentânea), as requisições ficam esperando indefinidamente, esgotando o pool de conexões e derrubando endpoints que nem dependeriam do recurso lento — efeito cascata.

### Objetivo
Fazer a aplicação falhar rápido e de forma controlada quando uma dependência (banco) está degradada, em vez de deixar requisições se acumularem.

### Escopo
- Adicionar dependência `resilience4j-spring-boot3`.
- Definir timeout explícito nas chamadas ao repositório/JPA (hoje provavelmente sem timeout configurado).
- Circuit breaker em torno das operações de banco: abrir o circuito após N falhas/timeouts consecutivos, retornar erro rápido (ex: 503) em vez de travar a thread.
- Retry com backoff apenas em operações idempotentes (leitura) — nunca em `POST`/criação sem chave de idempotência.
- Fallback simples (ex: mensagem de erro amigável) quando o circuito está aberto.

### Critérios de aceite
- [ ] Simular banco lento/indisponível (ex: `docker-compose pause postgres`) e verificar que a aplicação retorna erro em milissegundos após o circuito abrir, em vez de travar.
- [ ] Endpoints não relacionados ao banco (se houver) continuam respondendo normalmente durante a degradação simulada.
- [ ] Circuito fecha automaticamente quando o banco volta ao normal.

### Riscos / dependências
- Retry mal configurado pode agravar o problema (efeito manada no banco já degradado) — usar backoff exponencial e limite de tentativas.
- Esse item é o que mais resolve o risco discutido de "queda em cascata" sob estresse — priorizar antes ou junto do BL-02.

---

## BL-04 — Réplica de leitura no banco (read replica)

**Prioridade:** Baixa (avaliar antes de implementar)
**Esforço estimado:** M-G (3-5 dias, inclui infra)

### Contexto
Réplica de leitura só compensa quando o volume de leitura supera o que uma única instância Postgres aguenta — o que normalmente vem bem depois de cache (BL-01) e de otimização de queries/índices para uma aplicação do porte de uma agenda de contatos.

### Objetivo
Ter uma réplica de leitura (read replica) do Postgres para distribuir consultas de leitura, reservando a instância primária para escrita.

### Escopo
- **Antes de implementar:** medir se BL-01 (cache) já resolve o gargalo de leitura observado. Só seguir com este item se o teste de carga mostrar o Postgres primário saturado mesmo com cache.
- Configurar replicação (streaming replication) do Postgres via `docker-compose.yml` ou serviço gerenciado.
- Rotear leituras (`GET`) para a réplica e escritas (`POST`/`PUT`/`DELETE`) para o primário — via configuração de datasource duplo no Spring Boot (`@Transactional(readOnly = true)` + roteamento de datasource).
- Monitorar lag de replicação (réplica pode servir dado levemente desatualizado).

### Critérios de aceite
- [ ] Réplica sincronizada e servindo tráfego de leitura sem impactar a instância primária.
- [ ] Lag de replicação monitorado e dentro de um limite aceitável (definir, ex: < 1s).
- [ ] Teste de carga confirma ganho real de throughput em relação ao cenário anterior.

### Riscos / dependências
- Maior complexidade operacional (dois bancos, replicação, possível dado stale) para um ganho que pode não se justificar no tamanho atual do dataset.
- Considerar este item **só depois** de esgotar cache e otimização de query — é o item de menor prioridade dos quatro.

---

## BL-05 — Gestão de segredos com HashiCorp Vault

**Prioridade:** Alta
**Esforço estimado:** M (3-4 dias)

### Contexto
Hoje as credenciais (usuário/senha do Postgres, e qualquer outro segredo futuro — chave JWT, API keys) ficam em texto plano no `docker-compose.yml` e/ou `application.yml`, versionadas ou passadas via variável de ambiente sem nenhuma camada de proteção. Isso é o padrão mais comum de vazamento de credencial em projeto pequeno (arquivo commitado sem querer, `.env` exposto, etc.).

### Objetivo
Centralizar segredos no HashiCorp Vault, removendo credenciais em texto plano do repositório e dos arquivos de configuração — o backend passa a buscar os segredos do Vault em runtime.

### Escopo
- Adicionar serviço `vault` ao `docker-compose.yml` (imagem oficial `hashicorp/vault`), rodando em **dev mode** para ambiente local (`vault server -dev` — sobe já destravado, com token root fixo, ótimo pra estudar o fluxo sem lidar com unseal ainda).
- Guardar no Vault (KV secrets engine v2) as credenciais do Postgres (`spring.datasource.username`/`password`) e qualquer outro segredo (ex: futuro JWT signing key).
- Integrar o backend via `spring-cloud-starter-vault-config`: o Spring Boot passa a importar config do Vault com `spring.config.import: vault://` + `spring.cloud.vault.token` / `spring.cloud.vault.host` apontando pro serviço do compose.
- Remover as credenciais de `application.yml` e do `docker-compose.yml` (env var direta) — só fica a referência de onde buscar no Vault.
- Ajustar `depends_on` no compose pra o backend só subir depois do Vault estar pronto (healthcheck).
- Documentar no `DATABASE_SETUP.md` como popular o Vault localmente (`vault kv put secret/contact-manager db-username=... db-password=...`).

### Critérios de aceite
- [ ] Nenhuma credencial de banco em texto plano no `docker-compose.yml` ou `application.yml` commitados.
- [ ] Backend sobe normalmente buscando as credenciais do Vault em runtime.
- [ ] `docker-compose up` funciona do zero (Vault sobe, é populado — manual ou via script de init — e o backend consegue se conectar ao Postgres usando o segredo vindo do Vault).
- [ ] Guia documentado de como rodar localmente com Vault (inclusive como reobter o token de dev se o container reiniciar).

### Riscos / dependências
- **Dev mode não é produção**: o Vault em dev mode roda em memória (perde tudo ao reiniciar o container) e usa um token root fixo — ótimo pra aprender o conceito, mas se um dia for além do projeto pessoal, precisa estudar unseal, storage persistente (file/Postgres backend) e um método de autenticação melhor que token fixo (AppRole, por exemplo).
- Adiciona uma dependência a mais no `docker-compose up` — se o Vault não subir ou não estiver populado, o backend falha ao iniciar. Vale um healthcheck bem definido pra não mascarar o problema.
- Ordem de execução: vale fazer depois do BL-01 a BL-04 (que resolvem performance/resiliência) — Vault é uma melhoria de segurança/organização, não afeta os números de throughput/latência.

---

## Ordem sugerida de execução

1. **BL-03** — Circuit breaker (resolve o risco mais crítico: cascata de falha, menor esforço).
2. **BL-01** — Cache Redis (reduz carga no banco, ganho rápido e visível).
3. **BL-02** — Escalar horizontalmente (agora com BL-03 pronto, múltiplas instâncias não caem juntas).
4. **BL-04** — Réplica de leitura (só se, após os itens acima, o banco ainda for o gargalo).
5. **BL-05** — Vault (melhoria de segurança/organização, independente dos itens de performance acima — pode ser feita em paralelo se preferir).

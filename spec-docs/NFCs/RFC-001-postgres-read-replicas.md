
# RFC-001: Réplicas de Leitura (Streaming Replication) no PostgreSQL — Contact Manager

- **Status:** Proposto
- **Data:** 2026-07-11
- **Projeto:** contact-manager (backend Spring Boot + frontend + PostgreSQL)
- **Escopo:** Infraestrutura / Banco de Dados

## 1. Contexto e motivação

Hoje o `docker-compose.yml` do projeto sobe uma única instância do Postgres (`contact-manager-db`), usada tanto para leitura quanto para escrita pelo backend Spring Boot. Isso é suficiente para o estágio atual, mas cria dois problemas conforme o projeto cresce:

- Toda consulta (leitura ou escrita) compete pelos mesmos recursos da mesma instância.
- Não existe redundância: se o container `postgres` cair, a aplicação inteira fica sem banco.

Este RFC propõe introduzir uma réplica de leitura via streaming replication nativa do Postgres, mantendo o primary responsável por todas as escritas.

## 2. Objetivo

- Adicionar um serviço `postgres-replica` ao `docker-compose.yml`, sincronizado com o `postgres` (primary) via streaming replication assíncrona.
- Permitir que o backend direcione consultas de leitura para a réplica, reduzindo carga no primary.
- Manter o setup simples de subir localmente com `docker compose up`, sem dependências externas.

## 3. Fora de escopo (por enquanto)

- Failover automático (promoção de réplica a primary). Fica registrado na seção 7 como trabalho futuro.
- Sharding (Citus ou particionamento entre múltiplas instâncias). Não é necessário no volume atual de dados.
- Replicação síncrona (adiciona latência de escrita; não há requisito de zero data loss hoje).
- Balanceamento automático de conexões (PgBouncer/Pgpool-II). Citado como alternativa futura na seção 9.

## 4. Visão geral da arquitetura

```
                ┌────────────────────┐
   escritas     │                    │
   ──────────▶  │   postgres (primary)│
                │                    │
                └─────────┬──────────┘
                          │ streaming replication (WAL)
                          ▼
                ┌────────────────────┐
   leituras     │                    │
   ──────────▶  │  postgres-replica  │
                │   (hot standby)    │
                └────────────────────┘
```

- O **primary** recebe todo tráfego de escrita (INSERT/UPDATE/DELETE) e o tráfego de leitura que exige dado sempre atualizado.
- A **réplica** recebe apenas leitura (SELECT), com uma defasagem (replication lag) tipicamente de milissegundos.
- Backend decide, por endpoint/query, qual datasource usar (detalhado na seção 5.5).

## 5. Design detalhado

### 5.1 Conceito: Streaming Replication

O Postgres grava toda alteração no **WAL (Write-Ahead Log)** antes de aplicá-la nos arquivos de dados. Na streaming replication:

1. O primary é configurado com `wal_level = replica` e um slot de replicação.
2. A réplica faz um clone físico inicial do primary via `pg_basebackup`.
3. A réplica entra em modo *standby* e passa a receber o WAL continuamente, aplicando as mesmas mudanças em tempo quase real.
4. A réplica fica em modo `hot_standby`, o que permite executar `SELECT`s nela enquanto recebe replicação.

É assíncrona por padrão: o primary não espera confirmação da réplica para confirmar um commit. Isso é adequado para escalar leitura; não garante zero perda de dados em caso de queda do primary (ver seção 7).

### 5.2 Alterações no `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: contact-manager-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: contact_manager
      # usuário dedicado à replicação
      REPLICATION_USER: replicator
      REPLICATION_PASSWORD: replicator_pw
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/primary/init-replication.sh:/docker-entrypoint-initdb.d/init-replication.sh
      - ./db/primary/postgresql.conf:/etc/postgresql/postgresql.conf
      - ./db/primary/pg_hba.conf:/etc/postgresql/pg_hba.conf
    command: >
      postgres
      -c config_file=/etc/postgresql/postgresql.conf
      -c hba_file=/etc/postgresql/pg_hba.conf
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - contact-manager-net

  postgres-replica:
    image: postgres:15-alpine
    container_name: contact-manager-db-replica
    environment:
      PGUSER: replicator
      PGPASSWORD: replicator_pw
      PRIMARY_HOST: postgres
    volumes:
      - postgres_replica_data:/var/lib/postgresql/data
      - ./db/replica/init-replica.sh:/docker-entrypoint-initdb.d/init-replica.sh
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - contact-manager-net

  backend:
    # ... (sem mudanças estruturais, ver 5.5 para novas env vars)

volumes:
  postgres_data:
  postgres_replica_data:

networks:
  contact-manager-net:
    driver: bridge
```

Observação: a imagem oficial `postgres:15-alpine` não faz bootstrap de réplica sozinha — é preciso um script de inicialização (`init-replica.sh`) rodando `pg_basebackup`. Detalhado a seguir.

### 5.3 Configuração do primary

`db/primary/postgresql.conf` (trechos relevantes, o resto pode ficar no default gerado pela imagem):

```conf
wal_level = replica
max_wal_senders = 5
max_replication_slots = 5
hot_standby = on
```

`db/primary/pg_hba.conf` precisa liberar conexão de replicação vinda da rede do Docker:

```conf
host    replication     replicator      0.0.0.0/0               md5
host    all             all             0.0.0.0/0               md5
```

`db/primary/init-replication.sh` (roda uma vez, na criação do volume do primary):

```bash
#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD '${REPLICATION_PASSWORD}';
    SELECT pg_create_physical_replication_slot('replica_slot');
EOSQL
```

### 5.4 Bootstrap da réplica

`db/replica/init-replica.sh`:

```bash
#!/bin/bash
set -e

if [ -z "$(ls -A /var/lib/postgresql/data)" ]; then
  pg_basebackup \
    -h "$PRIMARY_HOST" \
    -D /var/lib/postgresql/data \
    -U replicator \
    -v -P \
    -R \
    --slot=replica_slot

  chmod 700 /var/lib/postgresql/data
fi
```

A flag `-R` gera automaticamente o arquivo de configuração de standby (`standby.signal` + `primary_conninfo` no `postgresql.auto.conf`), então a réplica já sobe em modo hot standby sem passos manuais adicionais.

Como esse script roda como `init` do container postgres oficial, é preciso montá-lo de forma que rode **antes** do processo normal de start — a alternativa mais simples costuma ser sobrescrever o `entrypoint` do serviço `postgres-replica` para chamar esse script e depois `exec docker-entrypoint.sh postgres`. Esse detalhe de wiring do entrypoint deve ser validado na implementação (imagens/versões variam).

### 5.5 Roteamento de leitura/escrita no backend (Spring Boot)

Opções, da mais simples à mais robusta:

1. **Dois `DataSource`s explícitos** (recomendado para começar): configurar um `DataSource` `primaryDataSource` (URL do `postgres:5432`) e outro `replicaDataSource` (URL do `postgres-replica:5432`). Endpoints/repositories de leitura pura (ex.: listagens, relatórios) usam o repositório configurado com `replicaDataSource`; todo o resto usa o primary.
2. **`AbstractRoutingDataSource` + `@Transactional(readOnly = true)`**: Spring permite rotear dinamicamente o DataSource baseado em uma flag de contexto (`TransactionSynchronizationManager`) que verifica se a transação atual é somente leitura. É mais elegante, mas exige mais boilerplate e cuidado (ex.: nunca marcar como `readOnly` uma transação que também escreve).
3. **PgBouncer/Pgpool-II na frente do banco**, fazendo o split de leitura/escrita de forma transparente para a aplicação. Adiciona uma peça de infraestrutura a mais, mas tira essa responsabilidade do código Java. Fica registrado como evolução futura (seção 9).

Novas variáveis de ambiente sugeridas para o `backend`:

```yaml
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/contact_manager
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_DATASOURCE_REPLICA_URL: jdbc:postgresql://postgres-replica:5432/contact_manager
      SPRING_DATASOURCE_REPLICA_USERNAME: postgres
      SPRING_DATASOURCE_REPLICA_PASSWORD: postgres
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
```

## 6. Plano de testes / validação

1. Subir o compose e confirmar que `postgres-replica` entra em `hot_standby`:
   ```
   docker exec contact-manager-db-replica psql -U postgres -c "SELECT pg_is_in_recovery();"
   ```
   Deve retornar `t`.
2. Validar replicação: inserir um registro no primary e conferir que aparece na réplica em poucos milissegundos.
   ```
   docker exec contact-manager-db psql -U postgres -d contact_manager -c "INSERT INTO ..."
   docker exec contact-manager-db-replica psql -U postgres -d contact_manager -c "SELECT ..."
   ```
3. Confirmar que a réplica rejeita escrita (deve dar erro `cannot execute INSERT in a read-only transaction`).
4. Checar lag de replicação:
   ```
   SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;
   ```
   (executar na réplica).
5. Teste de carga simples (ex.: k6 ou wrk) comparando throughput de leitura antes/depois de rotear os endpoints de listagem para a réplica.
6. Teste de queda: derrubar o container `postgres-replica` e confirmar que o backend continua funcionando normalmente usando só o primary (a réplica deve ser tratada como opcional, nunca crítica para o caminho principal).

## 7. Failover e alta disponibilidade (fora do escopo deste RFC, registrado para o futuro)

Streaming replication por si só **não promove automaticamente** a réplica a primary se o primary cair — isso exige uma ferramenta de orquestração como Patroni, repmgr ou pg_auto_failover. Isso deve ser tratado num RFC separado, caso o projeto evolua para precisar de alta disponibilidade real (hoje o objetivo é só escalar leitura).

## 8. Riscos e trade-offs

- **Replication lag**: leituras na réplica podem retornar dados com alguns milissegundos/segundos de atraso. Não usar a réplica para fluxos onde o usuário acabou de escrever e espera ver o resultado imediatamente (read-your-writes).
- **Complexidade operacional**: mais um container para manter, monitorar e atualizar em sincronia de versão com o primary.
- **Uso de disco**: a réplica duplica o volume de dados (mais um `postgres_replica_data`).
- **Sem failover automático**: se o primary cair, a aplicação perde escrita até intervenção manual (mitigado apenas se um RFC de HA for implementado depois).

## 9. Alternativas consideradas

- **Citus (sharding)**: descartado por ora — sharding resolve escala de escrita/volume de dados, não é o problema atual do projeto (volume pequeno/médio).
- **Pgpool-II / PgBouncer com split automático**: mais transparente para o backend, mas adiciona uma peça de infra extra. Pode ser revisitado depois que o roteamento manual (seção 5.5, opção 1) provar que o padrão de uso realmente se beneficia de leitura na réplica.
- **Read replica gerenciada (RDS/Cloud SQL)**: fora de escopo por o projeto rodar 100% em Docker local/self-hosted no momento.

## 10. Plano de rollout incremental

1. Criar os arquivos `db/primary/*` e `db/replica/*` descritos na seção 5.
2. Subir `postgres-replica` isolado e validar a replicação manualmente (seção 6, passos 1–4), sem tocar no backend ainda.
3. Adicionar o segundo `DataSource` no backend (opção 1 da seção 5.5), inicialmente usado só num endpoint de baixo risco (ex.: `GET /contacts` de listagem).
4. Medir lag e comportamento em ambiente local por um tempo antes de expandir para mais endpoints de leitura.
5. Documentar no README do projeto como subir/derrubar a réplica e como verificar seu status.

## 11. Perguntas em aberto

- Vale a pena já configurar um segundo replication slot para facilitar adicionar uma segunda réplica no futuro?
- O time quer investir em Patroni/repmgr para HA num próximo RFC, ou a réplica vai ficar só para escala de leitura por enquanto?
- Faz sentido medir o padrão real de leitura vs. escrita da aplicação antes de decidir quais endpoints migram para a réplica?

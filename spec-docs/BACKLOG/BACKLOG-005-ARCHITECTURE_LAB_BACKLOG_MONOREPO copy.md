# 🧪 Architecture Lab Backlog (Monorepo)

> Evolução arquitetural do projeto **personal-contact-manager-application**.
>
> A proposta é manter **um único repositório**, evoluindo a aplicação em pequenos incrementos até transformá-la em um laboratório de arquitetura distribuída.

---

# 🎯 Visão da Arquitetura Final

```text
                              Nginx
                                │
                         React Frontend
                                │
                          Contact API
                                │
               ┌────────────────┴────────────────┐
               │                                 │
          PostgreSQL                        Redis Cache
               │
           OUTBOX TABLE
               │
      Outbox Publisher Scheduler
               │
        LocalStack (SQS) / Kafka
               │
        Notification Service
               │
          INBOX TABLE
               │
      Fake Email Service (Mailpit)

Observabilidade
---------------
Prometheus
Grafana
Spring Boot Actuator
Micrometer
```

---

# 📁 Estrutura do Monorepo

```text
personal-contact-manager-application/
│
├── frontend/
├── contact-api/
├── services/
│   ├── notification-service/
│   ├── fake-email-service/
│   ├── fake-cep-service/
│   └── shared/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── postgres/
│   ├── redis/
│   ├── localstack/
│   ├── prometheus/
│   ├── grafana/
│   └── mailpit/
│
├── performance/
│   └── k6/
│
├── docs/
│   ├── c4/
│   ├── adr/
│   └── diagrams/
│
└── specs/
```

---

# Epic 1 — Refatoração para Monorepo

## Objetivo

Organizar o projeto para suportar múltiplos serviços mantendo um único repositório.

### Tasks

- [ ] Separar frontend e backend em módulos
- [ ] Criar pasta `services`
- [ ] Centralizar Docker Compose
- [ ] Criar documentação da arquitetura
- [ ] Atualizar README

---

# Epic 2 — Notification Service

### Tasks

- [ ] Criar Notification Service (Spring Boot)
- [ ] Endpoint para receber eventos
- [ ] Persistir histórico
- [ ] Swagger
- [ ] Docker

---

# Epic 3 — Fake Email Service

### Tasks

- [ ] Integrar Mailpit
- [ ] Serviço SMTP fake
- [ ] Simular envio
- [ ] Histórico de e-mails

---

# Epic 4 — Outbox Pattern

### Tasks

- [ ] Criar tabela OUTBOX
- [ ] Persistir eventos na mesma transação
- [ ] Scheduler Publisher
- [ ] Publicar mensagens

---

# Epic 5 — Mensageria

### Tasks

- [ ] LocalStack (SQS) ou Kafka
- [ ] Producer
- [ ] Consumer
- [ ] ACK
- [ ] Reprocessamento

---

# Epic 6 — Inbox Pattern

### Tasks

- [ ] Tabela INBOX
- [ ] MessageId
- [ ] Idempotência
- [ ] Testes de duplicidade

---

# Epic 7 — Chaos Service

## Objetivo

Criar serviços que permitam injetar falhas.

### Tasks

- [ ] Configurar latência dinâmica
- [ ] Configurar percentual de erro
- [ ] Simular timeout
- [ ] Simular indisponibilidade
- [ ] Simular mensagens duplicadas

---

# Epic 8 — Resiliência

### Tasks

- [ ] Circuit Breaker
- [ ] Retry
- [ ] Timeout
- [ ] Bulkhead
- [ ] Rate Limiter
- [ ] Fallback

---

# Epic 9 — Cache

### Tasks

- [ ] Redis
- [ ] Cache Aside
- [ ] TTL
- [ ] Invalidação

---

# Epic 10 — Banco de Dados

### Tasks

- [ ] Índices
- [ ] EXPLAIN ANALYZE
- [ ] Ajustar HikariCP
- [ ] Connection Pool
- [ ] Testes de concorrência

---

# Epic 11 — Observabilidade

### Tasks

- [ ] Spring Boot Actuator
- [ ] Micrometer
- [ ] Prometheus
- [ ] Grafana
- [ ] Dashboards
- [ ] Logs estruturados

---

# Epic 12 — Performance

### Tasks

- [ ] Load Test
- [ ] Stress Test
- [ ] Spike Test
- [ ] Soak Test
- [ ] Comparar resultados
- [ ] Publicar benchmarks

---

# Epic 13 — Escalabilidade

### Tasks

- [ ] Múltiplas instâncias da API
- [ ] Nginx Load Balancer
- [ ] Testes horizontais
- [ ] Comparar throughput

---

# Epic 14 — Documentação

### Tasks

- [ ] Diagramas C4
- [ ] ADRs
- [ ] Diagramas de sequência
- [ ] Fluxo Outbox
- [ ] Fluxo Inbox
- [ ] Fluxo de Resiliência

---

# 🏆 Objetivo Final

Ao concluir este backlog o projeto deverá demonstrar:

- ✅ Arquitetura em monorepo com múltiplos serviços
- ✅ Outbox Pattern
- ✅ Inbox Pattern
- ✅ Event Driven
- ✅ LocalStack (SQS) ou Kafka
- ✅ Fake Email Service
- ✅ Chaos Engineering
- ✅ Circuit Breaker
- ✅ Retry
- ✅ Bulkhead
- ✅ Timeout
- ✅ Rate Limiter
- ✅ Redis Cache
- ✅ Observabilidade completa
- ✅ Testes de performance com k6
- ✅ Escalabilidade horizontal
- ✅ Documentação arquitetural (C4 + ADR)

> Cada Epic pode ser implementada utilizando Spec Driven Development (SDD), criando uma pasta em `specs/` contendo `prd.md`, `design.md`, `tasks.md` e critérios de aceitação.

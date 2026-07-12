# 📋 Architecture Evolution Backlog

> Roadmap para evoluir a aplicação **Personal Contact Manager** de um
> CRUD simples para uma aplicação preparada para alta disponibilidade,
> escalabilidade, observabilidade e resiliência.

------------------------------------------------------------------------

# 🎯 Objetivo

Construir um projeto de portfólio que demonstre conhecimentos de
Backend, Arquitetura de Software, Cloud, Performance, Observabilidade e
Engenharia de Plataforma.

Cada etapa representa uma evolução incremental do sistema.

------------------------------------------------------------------------

# ✅ Epic 1 --- Observabilidade

## Objetivo

Adicionar métricas, logs e monitoramento para entender o comportamento
da aplicação.

### Tasks

-   [ ] Adicionar Spring Boot Actuator
-   [ ] Adicionar Micrometer
-   [ ] Configurar Prometheus
-   [ ] Configurar Grafana
-   [ ] Criar dashboard com:
    -   Requests por segundo
    -   Tempo médio
    -   P95
    -   P99
    -   CPU
    -   Memória
    -   JVM
    -   Garbage Collector
-   [ ] Adicionar Health Checks
-   [ ] Documentar arquitetura

### Aprendizados

-   Observabilidade
-   Golden Signals
-   SLI
-   SLO

------------------------------------------------------------------------

# ✅ Epic 2 --- Performance

## Objetivo

Medir a capacidade da aplicação.

### Tasks

-   [ ] Criar testes de carga (Load)
-   [ ] Criar testes de Stress
-   [ ] Criar testes de Spike
-   [ ] Criar testes de Soak
-   [ ] Criar testes para leitura
-   [ ] Criar testes para escrita
-   [ ] Medir throughput
-   [ ] Medir latência
-   [ ] Publicar resultados no README

### Aprendizados

-   RPS
-   Throughput
-   Latência
-   Percentis
-   Gargalos

------------------------------------------------------------------------

# ✅ Epic 3 --- Cache

## Objetivo

Reduzir carga no banco de dados.

### Tasks

-   [ ] Adicionar Redis
-   [ ] Cache para GET /contacts
-   [ ] Cache para GET /contacts/{id}
-   [ ] Invalidar cache nas alterações
-   [ ] Medir ganho de performance
-   [ ] Comparar antes/depois

### Aprendizados

-   Cache Aside
-   TTL
-   Cache Invalidation

------------------------------------------------------------------------

# ✅ Epic 4 --- Banco de Dados

## Objetivo

Melhorar performance do PostgreSQL.

### Tasks

-   [ ] Adicionar índices
-   [ ] Analisar EXPLAIN ANALYZE
-   [ ] Otimizar consultas
-   [ ] Ajustar HikariCP
-   [ ] Testar saturação do pool
-   [ ] Criar documentação

### Aprendizados

-   Índices
-   Scan
-   Locks
-   Connection Pool

------------------------------------------------------------------------

# ✅ Epic 5 --- Resiliência

## Objetivo

Preparar a aplicação para falhas.

### Tasks

-   [ ] Adicionar Resilience4j
-   [ ] Circuit Breaker
-   [ ] Retry
-   [ ] Timeout
-   [ ] Bulkhead
-   [ ] Rate Limiter
-   [ ] Criar serviço externo de exemplo
-   [ ] Testar cenários de falha

### Aprendizados

-   Cascading Failure
-   Degradação graciosa
-   Resiliência

------------------------------------------------------------------------

# ✅ Epic 6 --- Escalabilidade

## Objetivo

Escalar horizontalmente.

### Tasks

-   [ ] Executar múltiplas instâncias da API
-   [ ] Configurar Nginx como Load Balancer
-   [ ] Testar Round Robin
-   [ ] Reexecutar testes de carga
-   [ ] Comparar resultados

### Aprendizados

-   Horizontal Scaling
-   Load Balancer
-   Sticky Session

------------------------------------------------------------------------

# ✅ Epic 7 --- Mensageria

## Objetivo

Adicionar processamento assíncrono.

### Tasks

-   [ ] Adicionar Kafka
-   [ ] Publicar ContactCreated
-   [ ] Criar Consumer
-   [ ] Criar Retry
-   [ ] Criar DLQ
-   [ ] Monitorar filas

### Aprendizados

-   Event Driven
-   At Least Once
-   Idempotência

------------------------------------------------------------------------

# ✅ Epic 8 --- Segurança

## Objetivo

Fortalecer a segurança da aplicação.

### Tasks

-   [ ] JWT
-   [ ] Refresh Token
-   [ ] Password Encoder
-   [ ] Rate Limit no Login
-   [ ] HTTPS
-   [ ] Security Headers
-   [ ] Revisar OWASP Top 10

### Aprendizados

-   OAuth2
-   JWT
-   Segurança Web

------------------------------------------------------------------------

# ✅ Epic 9 --- Cloud

## Objetivo

Executar a aplicação em ambiente cloud.

### Tasks

-   [ ] Docker Registry
-   [ ] Deploy ECS ou Kubernetes
-   [ ] PostgreSQL Gerenciado
-   [ ] Redis Gerenciado
-   [ ] Load Balancer
-   [ ] Auto Scaling
-   [ ] Health Checks

### Aprendizados

-   AWS
-   ECS
-   Kubernetes

------------------------------------------------------------------------

# ✅ Epic 10 --- CI/CD

## Objetivo

Automatizar entregas.

### Tasks

-   [ ] GitHub Actions
-   [ ] Build
-   [ ] Testes Automatizados
-   [ ] SonarQube
-   [ ] Cobertura de testes
-   [ ] Docker Build
-   [ ] Docker Push
-   [ ] Deploy Automático

### Aprendizados

-   DevOps
-   Pipeline
-   Qualidade

------------------------------------------------------------------------

# ✅ Epic 11 --- Chaos Engineering

## Objetivo

Validar comportamento sob falhas.

### Tasks

-   [ ] Derrubar PostgreSQL
-   [ ] Derrubar Redis
-   [ ] Derrubar API
-   [ ] Simular Timeout
-   [ ] Simular Latência
-   [ ] Simular CPU Alta
-   [ ] Medir recuperação

### Aprendizados

-   Recovery
-   Chaos Engineering
-   Resiliência

------------------------------------------------------------------------

# ✅ Epic 12 --- Arquitetura

## Objetivo

Documentar decisões arquiteturais.

### Tasks

-   [ ] Diagramas C4
-   [ ] ADRs
-   [ ] Diagramas de Sequência
-   [ ] Modelo de Dados
-   [ ] Modelo de Domínio
-   [ ] Diagrama de Deploy
-   [ ] Diagrama de Componentes

### Aprendizados

-   C4 Model
-   ADR
-   Arquitetura Evolutiva

------------------------------------------------------------------------

# 🏁 Objetivo Final

Transformar este projeto em um portfólio de referência demonstrando:

-   Observabilidade
-   Performance
-   Escalabilidade
-   Resiliência
-   Cloud
-   DevOps
-   Arquitetura

## Critérios de Sucesso

-   [ ] Dashboards Grafana
-   [ ] Testes automatizados com k6
-   [ ] API escalando horizontalmente
-   [ ] Cache reduzindo carga do banco
-   [ ] Circuit Breaker validado
-   [ ] Pipeline CI/CD funcional
-   [ ] Deploy em Cloud
-   [ ] Diagramas C4
-   [ ] ADRs
-   [ ] README atualizado com comparativos antes/depois

------------------------------------------------------------------------

# 📁 Estrutura sugerida para SDD

``` text
specs/
├── 001-observability/
├── 002-performance-testing/
├── 003-redis-cache/
├── 004-postgresql-tuning/
├── 005-resilience/
├── 006-horizontal-scaling/
├── 007-kafka-events/
├── 008-security/
├── 009-cloud-deployment/
├── 010-cicd/
├── 011-chaos-engineering/
└── 012-architecture-documentation/
```

Cada pasta deve conter:

-   `prd.md`
-   `tasks.md`
-   `design.md`
-   `acceptance-criteria.md`
-   `adr.md` (quando aplicável)

Assim, cada evolução do sistema pode ser desenvolvida incrementalmente
utilizando Spec Driven Development (SDD) e ferramentas como Claude Code
ou Codex.

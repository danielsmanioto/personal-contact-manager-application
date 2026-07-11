
# BACKLOG-001: Criar testes automatizados E2E em toda a aplicação

- **Tipo:** Testes / Qualidade
- **Prioridade:** Alta
- **Projeto:** contact-manager (frontend + backend Spring Boot + PostgreSQL)
- **Status:** Backlog

## Descrição

Criar uma suíte de testes end-to-end (E2E) cobrindo os principais fluxos da aplicação, do frontend até o banco de dados, garantindo que os cenários críticos do usuário funcionem de ponta a ponta antes de qualquer deploy.

## Contexto

Hoje o projeto não tem cobertura de testes E2E. Antes de evoluir a infraestrutura (réplicas, testes de performance/chaos — ver RFC-001 e RFC-002), é importante ter uma rede de segurança que garanta que mudanças não quebrem os fluxos principais da aplicação.

## Escopo

- Cobrir os fluxos de CRUD de contatos (criar, listar, editar, excluir) via UI.
- Validar integração real frontend → backend → Postgres (sem mocks), rodando contra o `docker-compose.yml` do projeto.
- Cobrir casos de erro esperados (ex.: validação de campos obrigatórios, contato duplicado, contato inexistente).
- Rodar em ambiente isolado (banco de teste dedicado, não os dados de desenvolvimento).

## Fora de escopo (por ora)

- Testes de performance/carga (coberto pela RFC-002).
- Testes de resiliência/chaos engineering (coberto pela RFC-002).
- Testes cross-browser extensivos (focar em um browser principal primeiro).

## Critérios de aceite

- [ ] Ferramenta de E2E escolhida e configurada (ex.: Playwright ou Cypress).
- [ ] Suíte roda localmente com um único comando, subindo os containers necessários.
- [ ] Cobre pelo menos: criar contato, listar contatos, editar contato, excluir contato, validação de erro.
- [ ] Testes rodam contra dados isolados (setup/teardown de banco entre execuções).
- [ ] Suíte documentada no README (como rodar localmente).
- [ ] Suíte integrada ao pipeline de CI, rodando a cada PR.

## Subtarefas sugeridas

1. Escolher e configurar a ferramenta de E2E (Playwright/Cypress).
2. Criar ambiente de teste isolado (banco de dados dedicado para E2E, via docker-compose).
3. Implementar testes do fluxo de criação de contato.
4. Implementar testes do fluxo de listagem/busca de contatos.
5. Implementar testes do fluxo de edição de contato.
6. Implementar testes do fluxo de exclusão de contato.
7. Implementar testes de validação/erro (campos obrigatórios, duplicidade, etc.).
8. Integrar a suíte ao CI.
9. Documentar como rodar os testes localmente.

## Estimativa

A definir (sugestão: quebrar em tarefas menores por subtarefa acima antes de estimar).

## Dependências

Nenhuma bloqueante — pode ser feito em paralelo às RFC-001 e RFC-002.

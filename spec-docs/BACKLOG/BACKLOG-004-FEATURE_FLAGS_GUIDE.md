# Guia: Feature Flag com Togglz (Spring Boot 3 + Postgres)

Objetivo vai ser criar um botao de se cadastrar, e ai vou ter opcao de escolher se quero ou nao liberar.
e sempre vai chamar um endpoint novo. 
claro o fluxo vcai dar erro se tiver desabilitado e nao erro desabilitado so isso,

Togglz é uma lib Java feita pra isso: liga/desliga funcionalidade em runtime, sem precisar reiniciar a aplicação, e já vem com uma console web (checkbox) — literalmente o "botão" que você quer. Guia abaixo assume o stack do teu projeto (Spring Boot 3.3, Java 21, Postgres).

Referência oficial: [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)

---

## 1. Dependências (pom.xml)

```xml
<dependency>
  <groupId>org.togglz</groupId>
  <artifactId>togglz-spring-boot-starter</artifactId>
  <version>4.6.2</version>
</dependency>

<!-- Console admin (o "botão" com UI) -->
<dependency>
  <groupId>org.togglz</groupId>
  <artifactId>togglz-console</artifactId>
  <version>4.6.2</version>
</dependency>
```

O starter já traz `togglz-core` e configura o `FeatureManager` automaticamente. O `togglz-console` registra a UI web pra ligar/desligar flags.

---

## 2. Declarar as features

Crie um enum com as funcionalidades que você quer poder ligar/desligar:

```java
package com.contactmanager.config;

import org.togglz.core.Feature;
import org.togglz.core.annotation.EnabledByDefault;
import org.togglz.core.annotation.Label;
import org.togglz.core.context.FeatureContext;

public enum AppFeatures implements Feature {

    @Label("Busca avançada de contatos")
    ADVANCED_SEARCH,

    @Label("Exportar contatos (CSV/PDF)")
    EXPORT_CONTACTS;

    public boolean isActive() {
        return FeatureContext.getFeatureManager().isActive(this);
    }
}
```

E registrar no `application.yml`:

```yaml
togglz:
  enabled: true
  feature-enums: com.contactmanager.config.AppFeatures
```

---

## 3. Persistir o estado da flag no Postgres

Por padrão o Togglz guarda o estado das flags em memória — some quando a aplicação reinicia. Como você já tem Postgres, o certo é persistir lá com `JDBCStateRepository`:

```java
package com.contactmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.togglz.core.repository.StateRepository;
import org.togglz.core.repository.jdbc.JDBCStateRepository;

import javax.sql.DataSource;

@Configuration
public class TogglzConfig {

    @Bean
    public StateRepository stateRepository(DataSource dataSource) {
        return new JDBCStateRepository(dataSource);
    }
}
```

Cria a tabela via migration Flyway (você já usa Flyway, então isso se encaixa bem no seu setup):

```sql
-- backend/src/main/resources/db/migration/V__create_togglz_features.sql
CREATE TABLE TOGGLZ (
  FEATURE_NAME VARCHAR(100) PRIMARY KEY,
  FEATURE_ENABLED INTEGER,
  STRATEGY_ID VARCHAR(200),
  STRATEGY_PARAMS VARCHAR(2000)
);
```

Assim, quando você liga/desliga a flag pelo botão, o estado sobrevive a restart e a múltiplas instâncias do backend (todas leem do mesmo Postgres).

---

## 4. Habilitar a console (o botão)

No `application.yml`:

```yaml
togglz:
  console:
    enabled: true
    path: /togglz-console
    secured: false   # true em produção — ver seção de segurança abaixo
```

Com a aplicação rodando, acesse:

```
http://localhost:8081/togglz-console
```

Vai aparecer uma tabela com cada feature do enum e um checkbox pra ligar/desligar — em tempo real, sem redeploy.

---

## 5. Usar a flag no código

Injeta o `FeatureManager` (ou usa o método `isActive()` do enum) onde quiser condicionar o comportamento:

```java
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final FeatureManager featureManager;

    public ContactController(FeatureManager featureManager) {
        this.featureManager = featureManager;
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q) {
        if (featureManager.isActive(AppFeatures.ADVANCED_SEARCH)) {
            return ResponseEntity.ok(advancedSearchService.search(q));
        }
        return ResponseEntity.ok(basicSearchService.search(q));
    }
}
```

Ou, de forma mais simples usando o enum diretamente:

```java
if (AppFeatures.EXPORT_CONTACTS.isActive()) {
    // lógica de exportação
}
```

---

## 6. Alternativa sem UI: toggle via API (actuator)

Se não quiser nem a console web, o starter já expõe um endpoint actuator por padrão:

```bash
# Ver estado de todas as flags
curl http://localhost:8081/actuator/togglz

# Ligar uma flag
curl -X POST http://localhost:8081/actuator/togglz/ADVANCED_SEARCH \
  -H "Content-Type: application/json" \
  -d '{"name":"ADVANCED_SEARCH","enabled":true}'
```

Útil se quiser controlar a flag por script ou por um botão no teu próprio frontend React, chamando esse endpoint.

---

## 7. Segurança da console

Com `togglz.console.secured: false` qualquer pessoa que acessar a URL liga/desliga suas features — ok pra desenvolvimento local, **não** pra produção exposta.

Em produção, duas opções:
- Adicionar Spring Security e usar `togglz.console.feature-admin-authority: ROLE_ADMIN` (a console passa a exigir essa role).
- Deixar `secured: true` sem Spring Security no classpath, o que bloqueia a console por completo — controle só via actuator com autenticação já existente na tua API.

---

## Resumo do fluxo

1. Declara a feature no enum `AppFeatures`.
2. Estado persiste no Postgres via `JDBCStateRepository` (migration Flyway).
3. Acessa `/togglz-console`, marca o checkbox — liga ou desliga na hora.
4. No código, `featureManager.isActive(AppFeatures.X)` decide o comportamento.

Isso te dá exatamente o "botão liga/desliga" no backend, sem precisar de serviço externo (Unleash, LaunchDarkly) — tudo roda dentro do teu próprio Postgres + Spring Boot.

Sources:
- [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)
- [Maven Repository: togglz-spring-boot-starter](https://mvnrepository.com/artifact/org.togglz/togglz-spring-boot-starter)

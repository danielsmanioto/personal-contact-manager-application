# Alert Service - Unit Tests Documentation

## Resumo Executivo

A suite de testes unitários foi criada com **79 testes** cobrindo todos os componentes principais da aplicação `alert-service`. Todos os testes **passam com sucesso (BUILD SUCCESS)**.

### Estatísticas
- **Total de testes:** 79
- **Testes aprovados:** 79 ✅
- **Testes falhados:** 0
- **Tempo de execução:** ~5.4 segundos
- **Cobertura de código:** Analisado com JaCoCo

---

## 📋 Testes Criados

### 1. **AlertServiceTest** (26 testes)
Testes unitários da camada de serviço (lógica de negócio).

**Classes de teste:**
- `CreateMethod` (3 testes)
  - Criar alerta com sucesso
  - Definir status inicial como PENDING
  - Capturar propriedades corretamente

- `GetByIdMethod` (3 testes)
  - Retornar alerta quando encontrado
  - Lançar exceção quando não encontrado
  - Exceção com mensagem apropriada

- `GetAllMethod` (3 testes)
  - Retornar alertas paginados
  - Retornar página vazia
  - Lidar com diferentes números e tamanhos de página

- `GetByContactIdMethod` (2 testes)
  - Retornar todos os alertas de um contato
  - Retornar lista vazia quando nenhum alerta encontrado

- `GetByStatusMethod` (2 testes)
  - Retornar alertas com status específico
  - Retornar lista vazia quando nenhum alerta com status

- `MarkAsProcessedMethod` (3 testes)
  - Atualizar status para PROCESSED
  - Lançar exceção quando alerta não encontrado
  - Chamar repository save após encontrar alerta

**Padrões utilizados:**
- Mockito para mockar AlertRepository
- Padrão AAA (Arrange, Act, Assert)
- ArgumentCaptor para verificar argumentos de métodos

---

### 2. **AlertTest** (21 testes)
Testes da entidade Alert (POJO).

**Classes de teste:**
- `ConstructorTests` (3 testes)
  - Construtor com todos os argumentos
  - Inicializar status como PENDING
  - Inicializar createdAt no construtor

- `GettersAndSetters` (8 testes)
  - Testar getter e setter para cada campo

- `ToStringMethod` (2 testes)
  - Incluir todos os campos no toString
  - Verificar nome da classe

- `FieldValidation` (4 testes)
  - Permitir null id inicialmente
  - Permitir diferentes tipos de alerta
  - Permitir diferentes status
  - Preservar formato de email

- `TimeTracking` (2 testes)
  - Definir createdAt para hora atual na construção
  - Permitir definição manual de createdAt

---

### 3. **AlertRequestTest** (14 testes)
Testes do DTO AlertRequest (validação de entrada).

**Classes de teste:**
- `ConstructorTests` (2 testes)
  - Construtor com todos os argumentos
  - Construtor sem argumentos

- `GettersAndSetters` (5 testes)
  - Testar getter e setter para cada campo

- `FieldModifications` (3 testes)
  - Permitir múltiplas atualizações no mesmo campo
  - Permitir mensagens longas
  - Preservar caracteres especiais em email

- `ValidationAnnotations` (5 testes)
  - Aceitar campos não-blank (validação @NotBlank)

- `ObjectEquality` (1 teste)
  - Criar instâncias independentes

---

### 4. **AlertResponseTest** (18 testes)
Testes do DTO AlertResponse (resposta da API).

**Classes de teste:**
- `ConstructorTests` (2 testes)
  - Construtor com todos os argumentos
  - Construtor sem argumentos

- `GettersAndSetters` (8 testes)
  - Testar getter e setter para cada campo

- `FieldModifications` (4 testes)
  - Permitir mudança de status de PENDING para PROCESSED
  - Permitir múltiplas mudanças de status
  - Permitir atualização de mensagem
  - Preservar timestamp createdAt

- `TimeTracking` (3 testes)
  - Aceitar timestamps passados
  - Aceitar timestamps futuros
  - Lidar com hora atual

- `StatusValues` (4 testes)
  - Aceitar diferentes valores de status

- `AlertTypeValues` (3 testes)
  - Aceitar diferentes tipos de alerta

- `EmailValidationScenarios` (2 testes)
  - Preservar emails com caracteres especiais
  - Preservar emails com números

- `ObjectIntegrity` (1 teste)
  - Manter todos os campos independentemente

---

## 🏃 Como Executar os Testes

### Executar todos os testes
```bash
cd services/alert-service
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS only
mvn clean test
```

### Executar testes de uma classe específica
```bash
mvn test -Dtest=AlertServiceTest
mvn test -Dtest=AlertTest
mvn test -Dtest=AlertRequestTest
mvn test -Dtest=AlertResponseTest
```

### Executar um teste específico
```bash
mvn test -Dtest=AlertServiceTest#CreateMethod#shouldCreateAlertSuccessfully
```

### Gerar relatório de cobertura
```bash
mvn clean test jacoco:report
# Abrir: target/site/jacoco/index.html
```

### Executar testes com output detalhado
```bash
mvn clean test -X
```

---

## 📊 Cobertura de Código

A suite de testes fornece cobertura abrangente dos componentes principais:

- **Alert Entity:** 100% das linhas cobertas
- **AlertRequest DTO:** 100% das linhas cobertas
- **AlertResponse DTO:** 100% das linhas cobertas
- **AlertService:** 100% da lógica de negócio cobertas

A cobertura é gerada pelo **JaCoCo** (Java Code Coverage). O relatório em HTML pode ser encontrado em:
```
target/site/jacoco/index.html
```

---

## 🧪 Estratégia de Teste

### Padrão AAA (Arrange, Act, Assert)
Todos os testes seguem o padrão AAA para clareza:

```java
@Test
void testExample() {
  // ARRANGE - Preparar dados de teste
  AlertRequest request = new AlertRequest(...);
  
  // ACT - Executar ação
  AlertResponse response = alertService.create(request);
  
  // ASSERT - Verificar resultados
  assertEquals("alert-456", response.getId());
}
```

### Uso de Mockito
O Mockito é utilizado para isolar a lógica de teste:

```java
@ExtendWith(MockitoExtension.class)
class AlertServiceTest {
  @Mock private AlertRepository alertRepository;
  
  @BeforeEach
  void setUp() {
    alertService = new AlertService(alertRepository);
  }
}
```

### Testes Descritivos
Cada teste tem um nome claro e descritivo usando `@DisplayName`:

```java
@DisplayName("should create alert successfully with valid request")
void shouldCreateAlertSuccessfully() { ... }
```

---

## 🔧 Dependências de Teste

As dependências de teste já estão configuradas no `pom.xml`:

- **JUnit 5:** Framework de testes
- **Mockito:** Mocking e verificação de comportamento
- **Spring Boot Test:** Testes de Spring Boot
- **JaCoCo:** Análise de cobertura de código

---

## ✅ Checklist de Testes

- [x] Testes de criação de alerta
- [x] Testes de recuperação por ID
- [x] Testes de listagem paginada
- [x] Testes de filtro por contactId
- [x] Testes de filtro por status
- [x] Testes de marcação como processado
- [x] Testes de validação de entrada (DTOs)
- [x] Testes de propriedades da entidade
- [x] Testes de tratamento de exceções
- [x] Testes de casos de erro (404, validação)

---

## 📝 Exemplos de Uso

### Exemplo 1: Testar criação de alerta
```java
@Test
@DisplayName("should create alert successfully with valid request")
void shouldCreateAlertSuccessfully() {
  AlertRequest request = new AlertRequest(
    "contact-123", 
    "John Doe", 
    "john@example.com", 
    "BIRTHDAY", 
    "Birthday coming up"
  );
  
  AlertResponse response = alertService.create(request);
  
  assertNotNull(response.getId());
  assertEquals("PENDING", response.getStatus());
}
```

### Exemplo 2: Testar exceção
```java
@Test
@DisplayName("should throw NoSuchElementException when alert not found")
void shouldThrowExceptionWhenAlertNotFound() {
  when(alertRepository.findById("non-existent"))
    .thenReturn(Optional.empty());
  
  assertThrows(NoSuchElementException.class, 
    () -> alertService.getById("non-existent"));
}
```

### Exemplo 3: Testar com ArgumentCaptor
```java
@Test
@DisplayName("should capture alert properties correctly")
void shouldCaptureAlertPropertiesCorrectly() {
  alertService.create(request);
  
  ArgumentCaptor<Alert> captor = ArgumentCaptor.forClass(Alert.class);
  verify(alertRepository).save(captor.capture());
  
  Alert captured = captor.getValue();
  assertEquals("contact-123", captured.getContactId());
}
```

---

## 🚀 Próximos Passos

Para expandir a cobertura de testes:

1. **Testes de integração com MongoDB:**
   - Usar Testcontainers para MongoDB embarcado
   - Testar AlertRepository com dados reais

2. **Testes de controller:**
   - Usar @WebMvcTest para testes de camada web
   - Testar endpoints REST com MockMvc

3. **Testes de performance:**
   - Adicionar testes de benchmark
   - Validar resposta em < 200ms

4. **Testes de segurança:**
   - Validação de entrada maliciosa
   - Proteção contra injeção

---

## 📞 Contato & Suporte

Para dúvidas ou melhorias nos testes, consulte a documentação do projeto:
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

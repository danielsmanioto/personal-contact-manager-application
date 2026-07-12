# Alert Service

Microserviço de gerenciamento de alertas para o Contact Manager.

## Visão Geral

O Alert Service é um microserviço responsável por:
- ✅ Criar e gerenciar alertas de contactos
- ✅ Armazenar alertas em MongoDB
- ✅ Disponibilizar endpoints REST para consulta
- ✅ Registar logs de todas as operações

## Tech Stack

- **Framework:** Spring Boot 3.3
- **Language:** Java 21
- **Database:** MongoDB 5.0+
- **Build Tool:** Maven 3.9
- **Documentation:** Swagger UI (OpenAPI 3.0)

## Estrutura do Projeto

```
alert-service/
├── src/
│   ├── main/
│   │   ├── java/com/alertmanager/
│   │   │   ├── AlertManagerApplication.java
│   │   │   ├── controller/AlertController.java
│   │   │   ├── service/AlertService.java
│   │   │   ├── repository/AlertRepository.java
│   │   │   ├── entity/Alert.java
│   │   │   └── dto/
│   │   │       ├── AlertRequest.java
│   │   │       └── AlertResponse.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/com/alertmanager/
├── pom.xml
├── Dockerfile
└── README.md
```

## Endpoints

### Base URL
```
http://localhost:8082/api
```

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/alerts` | Criar novo alerta |
| GET | `/alerts?page=0&size=10` | Listar alertas (paginado) |
| GET | `/alerts/{id}` | Obter alerta por ID |
| GET | `/alerts/contact/{contactId}` | Listar alertas de um contacto |
| GET | `/alerts/status/{status}` | Listar alertas por status |
| PUT | `/alerts/{id}/mark-processed` | Marcar alerta como processado |

## Executando Localmente

### Pré-requisitos

- Java 21+
- Maven 3.9+
- MongoDB 5.0+

### Sem Docker

1. **Inicie MongoDB:**
   ```bash
   # Localmente
   mongod
   
   # Ou via Docker
   docker run -d -p 27017:27017 --name mongo mongo:5.0
   ```

2. **Compile e execute:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Acesse:**
   - API: http://localhost:8082/api/alerts
   - Swagger: http://localhost:8082/swagger-ui.html
   - Health: http://localhost:8082/actuator/health

### Com Docker Compose

```bash
# Inicie todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f alert-service
```

## Configuração

### application.yml

```yaml
server:
  port: 8082

spring:
  data:
    mongodb:
      uri: mongodb://mongo:27017/alert_manager
```

### Variáveis de Ambiente

```bash
MONGO_URI=mongodb://mongo:27017/alert_manager
SERVER_PORT=8082
```

## Banco de Dados (MongoDB)

### Colection: alerts

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | ObjectId | ID único do alerta |
| `contact_id` | String | UUID do contacto |
| `contact_name` | String | Nome do contacto |
| `contact_email` | String | Email do contacto |
| `alert_type` | String | Tipo de alerta (CREATE, UPDATE, DELETE) |
| `message` | String | Mensagem do alerta |
| `status` | String | Status (PENDING, PROCESSED) |
| `created_at` | LocalDateTime | Data/hora de criação |

### Exemplo de Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "contact_id": "550e8400-e29b-41d4-a716-446655440000",
  "contact_name": "João Silva",
  "contact_email": "joao@example.com",
  "alert_type": "CREATE",
  "message": "Novo contacto criado",
  "status": "PENDING",
  "created_at": ISODate("2026-07-12T10:30:00Z")
}
```

## API Examples

### Criar Alerta

```bash
curl -X POST "http://localhost:8082/api/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "contactName": "João Silva",
    "contactEmail": "joao@example.com",
    "alertType": "CREATE",
    "message": "Novo contacto criado com sucesso"
  }'
```

### Listar Alertas

```bash
curl -X GET "http://localhost:8082/api/alerts?page=0&size=10"
```

### Obter Alerta por ID

```bash
curl -X GET "http://localhost:8082/api/alerts/507f1f77bcf86cd799439011"
```

### Listar Alertas por Contacto

```bash
curl -X GET "http://localhost:8082/api/alerts/contact/550e8400-e29b-41d4-a716-446655440000"
```

### Marcar como Processado

```bash
curl -X PUT "http://localhost:8082/api/alerts/507f1f77bcf86cd799439011/mark-processed"
```

## Testes

```bash
# Executar todos os testes
mvn test

# Testes com cobertura
mvn test jacoco:report
# Relatório em: target/site/jacoco/index.html
```

## Logging

Logs são salvos em:
- **Console:** INFO level
- **Package `com.alertmanager`:** DEBUG level

### Visualizar Logs

```bash
# Localmente
tail -f logs/alert-service.log

# Docker
docker-compose logs -f alert-service
```

## Integração com Backend Principal

O backend principal (Contact Manager) chama este serviço quando um contacto é criado/atualizado:

```java
// Em ContactService.create()
alertClient.createAlert(new AlertRequest(
    contactId,
    contact.getName(),
    contact.getEmail(),
    "CREATE",
    "Novo contacto criado"
));
```

Usa **Feign Client** para comunicação inter-serviços.

## Performance

- **Response Time:** < 50ms (avg)
- **Max Documents:** ~1M por collecton
- **Indexing:** Automático em `contact_id`, `status`, `alert_type`

## Health Check

```bash
curl http://localhost:8082/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "components": {
    "mongo": {
      "status": "UP"
    }
  }
}
```

## Documentação Completa

Veja `docs/services/alert-service/` para:
- `endpoints.md` - Documentação detalhada de todos os endpoints
- `postman-collection.json` - Coleção Postman pronta
- `POSTMAN-SETUP.md` - Guia de setup

## Troubleshooting

### MongoDB Connection Error
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongo

# Reiniciar MongoDB
docker-compose restart mongo
```

### Port Already in Use
```bash
# Usar porta alternativa
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8083"
```

### Tests Failing
```bash
# Limpar cache
mvn clean test

# Com logs detalhados
mvn test -X
```

## Desenvolvimento

### Code Style

```bash
# Verificar estilo
mvn checkstyle:check

# Auto-formatar
mvn spotless:apply
```

### Build

```bash
# Compilar
mvn clean compile

# Gerar JAR
mvn clean package
```

## Deploy

### Docker Build

```bash
docker build -t alert-service:1.0.0 .
```

### Docker Run

```bash
docker run -d \
  -p 8082:8082 \
  -e MONGO_URI=mongodb://mongo:27017/alert_manager \
  --name alert-service \
  alert-service:1.0.0
```

## Licença

MIT

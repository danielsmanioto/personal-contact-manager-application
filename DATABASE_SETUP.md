# Database Setup Manual Guide

## 📋 Automatic Setup (Preferred)

O banco de dados é criado automaticamente via Flyway quando o backend inicia:

```bash
# Inicia tudo com Docker
docker-compose up -d

# Verifica logs do backend para confirmar migrations
docker logs contact-manager-backend
```

---

## 🔧 Manual Setup (If Needed)

### 1. Connect to PostgreSQL

```bash
# Via Docker (if running)
docker exec -it contact-manager-db psql -U postgres -d contact_manager

# Via Local PostgreSQL (if installed)
psql -U postgres -d contact_manager
```
DATABASE: contact_manager
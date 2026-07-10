# ⚡ Quick Start - Personal Contact Manager

## 🚀 Iniciar Aplicação (Um Comando!)

```bash
./start.sh
```

Pronto! A aplicação está rodando com:
- ✅ PostgreSQL (banco de dados)
- ✅ Backend (Spring Boot na porta 8080)
- ✅ Frontend (React na porta 80)

## 🌐 Acessar a Aplicação

Após executar `./start.sh`, acesse:

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8080/api |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **Database** | localhost:5432 (postgres/postgres) |

## 🛑 Parar Aplicação

```bash
./stop.sh
```

## 🔄 Resetar Tudo (Limpar Dados)

```bash
./reset.sh
```

⚠️ **Aviso**: Esta ação deleta todos os dados do banco de dados!

## 📊 Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f postgres
```

## ✅ Validar se está Funcionando

Após `./start.sh`, execute:

```bash
# Verificar se backend está respondendo
curl http://localhost:8080/api/contacts

# Deve retornar algo como:
# {"content":[],"pageNumber":0,"pageSize":10,"totalElements":0,"totalPages":0}
```

## 🆘 Troubleshooting

### Porta já está em uso
```bash
# Liberar porta 8080
lsof -i :8080
kill -9 <PID>
```

### Banco de dados não inicializa
```bash
# Parar e resetar
docker-compose down -v
./start.sh
```

### Frontend não carrega
```bash
# Verificar se nginx está rodando
docker-compose ps

# Ver logs
docker-compose logs frontend
```

## 📚 Mais Informações

Para documentação completa, veja `README.md`

---

**Resumo**: 3 comandos = Aplicação completa funcionando! 🎉

```bash
./start.sh   # Iniciar
./stop.sh    # Parar
./reset.sh   # Resetar
```

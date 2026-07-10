#!/bin/bash

# Start all services
echo "🚀 Starting Personal Contact Manager..."

docker-compose up -d

echo "✅ Services started!"
echo ""
echo "📍 Access the application:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:8080/api"
echo "  - Swagger UI: http://localhost:8080/swagger-ui.html"
echo "  - Database: localhost:5432"
echo ""
echo "💡 To view logs: docker-compose logs -f"
echo "💡 To stop: ./scripts/stop.sh"

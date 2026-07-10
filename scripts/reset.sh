#!/bin/bash

# Reset all services (remove volumes and rebuild)
echo "🔄 Resetting Personal Contact Manager..."

echo "Stopping services..."
docker-compose down -v

echo "Rebuilding images..."
docker-compose build --no-cache

echo "Starting fresh..."
docker-compose up -d

echo "✅ Reset complete!"
echo ""
echo "📍 Access the application:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost:8080/api"
echo "  - Database: localhost:5432 (fresh instance)"

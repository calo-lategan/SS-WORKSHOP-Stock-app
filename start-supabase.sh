#!/bin/bash
set -e

echo "🚀 Starting Supabase local development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the services with docker-compose
echo "📦 Starting PostgreSQL with docker-compose..."
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 3

# Check if database is running
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is ready!"
else
    echo "❌ Database failed to start"
    docker-compose logs postgres
    exit 1
fi

# Display information
echo ""
echo "✅ Services started! Here's what you have:"
echo ""
docker-compose ps
echo ""
echo "📍 Database Access:"
echo "   • Connection URL: postgres://postgres:postgres@localhost:5432/postgres"
echo "   • Host: localhost"
echo "   • Port: 5432"
echo "   • User: postgres"
echo "   • Password: postgres"
echo "   • Database: postgres"
echo ""
echo "🛑 To stop services, run: docker-compose down"
echo "🔄 To view logs, run: docker-compose logs -f postgres"
echo "🗑️  To reset everything, run: docker-compose down -v"
echo ""
echo "💡 Tip: You can now run 'npm run dev' to start your development server"


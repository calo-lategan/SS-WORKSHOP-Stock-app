# Setting Up Local Supabase for Development

## Overview
This project uses PostgreSQL with Supabase for backend services. This guide helps you set up a local PostgreSQL database for development.

## Prerequisites
- Docker Desktop (or Docker Engine) installed and running
- Docker Compose installed (usually included with Docker Desktop)
- ~100MB disk space for the PostgreSQL image

## Quick Start

### ✅ Option 1: Using the Provided Start Script (Recommended)

```bash
chmod +x start-supabase.sh
./start-supabase.sh
```

This will:
1. Check if Docker is running
2. Start PostgreSQL database
3. Display access information

### Option 2: Manual Start

```bash
docker-compose up -d
```

### Option 3: Start with Visible Logs

```bash
docker-compose up
```

Press `Ctrl+C` when done (database continues running in background).

## ✅ Verification

After starting, verify the database is running:

```bash
docker-compose exec postgres pg_isready -U postgres
```

You should see: `/var/run/postgresql:5432 - accepting connections`

## Database Access

### Connection Information
- **Host:** localhost
- **Port:** 5432
- **Database:** postgres
- **User:** postgres
- **Password:** postgres
- **Connection URL:** `postgres://postgres:postgres@localhost:5432/postgres`

### Access via CLI
```bash
# Using psql
psql postgres://postgres:postgres@localhost:5432/postgres

# Or:
docker-compose exec postgres psql -U postgres -d postgres
```

### Access via GUI Tools
Use any PostgreSQL client (pgAdmin, DBeaver, DataGrip, etc.):
- Connection string: `postgres://postgres:postgres@localhost:5432/postgres`
- Or use individual connection parameters above

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your preferred settings (optional - defaults work for local dev)

3. Start your app:
   ```bash
   npm install
   npm run dev
   ```

## Common Commands

### View Database Logs
```bash
docker-compose logs -f postgres
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services (Keep Data)
```bash
docker-compose stop
```

### Stop Services (Delete Data)
```bash
docker-compose down -v
```

### Connect to Database
```bash
# Command line
docker-compose exec postgres psql -U postgres

# Create a new database
docker-compose exec postgres createdb -U postgres myapp_db

# Run SQL file
docker-compose exec postgres psql -U postgres -d postgres -f migration.sql
```

## Troubleshooting

### ❌ "docker: command not found"
**Solution:** Docker is not installed. Install Docker Desktop from https://www.docker.com/products/docker-desktop

### ❌ "Cannot connect to Docker daemon"
**Solution:** Docker is not running. Start Docker Desktop and try again.

### ❌ "Connection refused on port 5432"
**Solution:** PostgreSQL container isn't running. Run:
```bash
docker-compose ps  # Check if postgres container is listed
docker-compose up -d  # Start it
```

### ❌ "Port 5432 already in use"
**Solution:** Another PostgreSQL instance is using the port. Either:
1. Stop the other PostgreSQL service, or
2. Change the port in docker-compose.yml (change `5432:5432` to `5433:5432`)

### ❌ Slow Performance
**Solution:** Allocate more Docker resources:
1. Open Docker Desktop Settings
2. Go to Resources
3. Increase CPU and Memory allocation
4. Restart Docker

### ❌ Out of Disk Space
**Solution:** Cleanup Docker volumes:
```bash
docker-compose down -v  # Removes volumes
docker image prune      # Removes unused images
docker volume prune     # Removes unused volumes
```

##  Cloud Deployment (Optional)

For production or team deployment, use [Supabase Cloud](https://supabase.com):

1. Create an account at https://supabase.com
2. Create a new project
3. Get your Supabase URL and API keys
4. Update `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-key
   ```

## Database Migrations

If you have database migration files in `supabase/migrations/`:

```bash
# Migrations run automatically when starting for the first time
docker-compose up

# Or manually run a migration:
docker-compose exec postgres psql -U postgres < supabase/migrations/001_init.sql
```

## Persistence

Your database data is stored in a Docker volume that persists across container restarts. To clear it:

```bash
docker-compose down -v  # This deletes the volume
docker-compose up -d    # Start fresh database
```

## Additional Information

- **Docker Images:**
  - PostgreSQL 15 Alpine (lightweight, ~40MB)
  - Supabase compatible schema

- **Ports Used:**
  - 5432 → PostgreSQL

- **Performance:**
  - Typical startup time: 3-5 seconds
  - First migrations may be slower on first run

##  Next Steps

1. ✅ Ensure Supabase is running: `./start-supabase.sh`
2. Start your app: `npm run dev`
3. Open http://localhost:5173 in your browser
4. Open http://localhost:3000/api for database administration (when using cloud Supabase)

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Supabase Documentation](https://supabase.com/docs)
- [Local Development Best Practices](https://12factor.net/)


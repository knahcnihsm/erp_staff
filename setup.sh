#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[ERROR]${NC} $1"; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo ""
echo -e "${BOLD}${CYAN}===================================================${NC}"
echo -e "${BOLD}${CYAN}   ERP Staff Portal - One-Time Setup Script${NC}"
echo -e "${BOLD}${CYAN}===================================================${NC}"
echo ""

# --------------------------------------------------
# 1. Check Java
# --------------------------------------------------
info "[1/6] Checking Java..."
if ! command -v java &>/dev/null; then
    fail "Java is NOT installed."
    echo "  Please install JDK 17+: https://adoptium.net/"
    exit 1
fi
JAVA_VER=$(java -version 2>&1 | head -n1 | awk -F '"' '{print $2}')
ok "Java found: $JAVA_VER"

# --------------------------------------------------
# 2. Check Node.js
# --------------------------------------------------
info "[2/6] Checking Node.js..."
if ! command -v node &>/dev/null; then
    fail "Node.js is NOT installed."
    echo "  Please install Node.js v18+: https://nodejs.org/"
    exit 1
fi
NODE_VER=$(node -v)
ok "Node.js found: $NODE_VER"

# --------------------------------------------------
# 3. Check PostgreSQL
# --------------------------------------------------
info "[3/6] Checking PostgreSQL..."
if command -v pg_isready &>/dev/null; then
    if pg_isready -q 2>/dev/null; then
        ok "PostgreSQL is running."
    else
        warn "PostgreSQL is installed but may not be running."
    fi
else
    warn "pg_isready not found. Ensure PostgreSQL is installed and running."
fi

# --------------------------------------------------
# 4. Copy .env files
# --------------------------------------------------
info "[4/6] Setting up environment files..."

if [ ! -f ".env" ]; then
    cp ".env.example" ".env"
    ok "Created root .env"
else
    info "Root .env already exists, skipping."
fi

if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    ok "Created backend/.env"
else
    info "backend/.env already exists, skipping."
fi

# --------------------------------------------------
# 5. Create PostgreSQL database
# --------------------------------------------------
info "[5/6] Creating PostgreSQL database..."

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-erp_staff}"
DB_USERNAME="${DB_USERNAME:-postgres}"

# Parse backend/.env if it exists (override defaults)
if [ -f "backend/.env" ]; then
    while IFS='=' read -r key val; do
        case "$key" in
            DB_HOST)     DB_HOST="$val" ;;
            DB_PORT)     DB_PORT="$val" ;;
            DB_NAME)     DB_NAME="$val" ;;
            DB_USERNAME) DB_USERNAME="$val" ;;
        esac
    done < <(grep -v '^#' backend/.env | grep -v '^$')
fi

info "Target database: $DB_NAME on $DB_HOST:$DB_PORT"

DB_EXISTS=$(PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -tc \
    "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null | tr -d '[:space:]') || true

if [ "$DB_EXISTS" = "1" ]; then
    ok "Database '$DB_NAME' already exists."
else
    if PGPASSWORD=postgres psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
        ok "Database '$DB_NAME' created successfully."
    else
        warn "Could not auto-create database. Please run manually:"
        echo "  psql -U postgres -c \"CREATE DATABASE $DB_NAME;\""
    fi
fi

# --------------------------------------------------
# 6. Install frontend dependencies
# --------------------------------------------------
info "[6/6] Installing frontend dependencies..."
if [ -d "node_modules" ]; then
    info "node_modules already exists, skipping."
else
    npm install
    ok "Frontend dependencies installed."
fi

# --------------------------------------------------
# Done
# --------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}===================================================${NC}"
echo -e "${BOLD}${GREEN}   Setup Complete!${NC}"
echo -e "${BOLD}${GREEN}===================================================${NC}"
echo ""
echo "  To start the project, run:"
echo "    python run_project.py"
echo ""
echo "  Or start manually:"
echo "    Backend:  cd backend && ./mvnw spring-boot:run"
echo "    Frontend: npm run dev"
echo ""
echo "  App URL:  http://localhost:5173"
echo "  API URL:  http://localhost:8080"
echo -e "${BOLD}${GREEN}===================================================${NC}"
echo ""

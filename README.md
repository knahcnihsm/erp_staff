# ERP Staff Portal

## Quick Start (One-Click Setup)

### Prerequisites
- **Java JDK 17+** — [Download](https://adoptium.net/)
- **Node.js v18+** — [Download](https://nodejs.org/)
- **PostgreSQL** — [Download](https://www.postgresql.org/download/) (default user: `postgres`, password: `postgres`)
- **Python 3** (optional, for `run_project.py` launcher)

### Setup

**Windows:**
```
setup.bat
```

**Linux / macOS:**
```
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Verify all prerequisites are installed
2. Create `.env` files from `.env.example` templates
3. Create the PostgreSQL database (`erp_staff`) if it doesn't exist
4. Install frontend (`npm install`) dependencies
5. Hibernate auto-creates all tables on first backend start

### Run

**One-click launcher (starts both backend + frontend):**
```
python run_project.py
```

**Manual start:**
```
# Backend (port 8080)
cd backend
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows

# Frontend (port 5173) — in a separate terminal
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- API: http://localhost:8080

### Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `erp_staff` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |

Edit `backend/.env` to change database credentials.
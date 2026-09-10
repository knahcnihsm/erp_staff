@echo off
setlocal EnableDelayedExpansion

echo.
echo ====================================================
echo   ERP Staff Portal - One-Time Setup Script
echo ====================================================
echo.

:: --------------------------------------------------
:: 1. Check Java
:: --------------------------------------------------
echo [1/6] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Java is NOT installed or not in PATH.
    echo   Please install JDK 17+ from https://adoptium.net/
    echo.
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do set JAVA_VER=%%~g
echo   [OK] Java found: !JAVA_VER!

:: --------------------------------------------------
:: 2. Check Node.js
:: --------------------------------------------------
echo [2/6] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Node.js is NOT installed or not in PATH.
    echo   Please install Node.js v18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f %%g in ('node -v') do set NODE_VER=%%g
echo   [OK] Node.js found: !NODE_VER!

:: --------------------------------------------------
:: 3. Check PostgreSQL
:: --------------------------------------------------
echo [3/6] Checking PostgreSQL...
pg_isready >nul 2>&1
if errorlevel 1 (
    echo   [WARNING] PostgreSQL is NOT running or 'pg_isready' is not in PATH.
    echo   Please ensure PostgreSQL is installed and running on port 5432.
    echo   Download: https://www.postgresql.org/download/windows/
    echo.
) else (
    echo   [OK] PostgreSQL is running.
)

:: --------------------------------------------------
:: 4. Copy .env files
:: --------------------------------------------------
echo [4/6] Setting up environment files...

if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo   [CREATED] Root .env
) else (
    echo   [EXISTS] Root .env already exists
)

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo   [CREATED] backend\.env
) else (
    echo   [EXISTS] backend\.env already exists
)

:: --------------------------------------------------
:: 5. Create PostgreSQL database
:: --------------------------------------------------
echo [5/6] Creating PostgreSQL database...

:: Read DB config from backend\.env
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=erp_staff
set DB_USERNAME=postgres

if exist "backend\.env" (
    for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
        set "key=%%a"
        set "val=%%b"
        if "!key!"=="DB_HOST" set "DB_HOST=!val!"
        if "!key!"=="DB_PORT" set "DB_PORT=!val!"
        if "!key!"=="DB_NAME" set "DB_NAME=!val!"
        if "!key!"=="DB_USERNAME" set "DB_USERNAME=!val!"
    )
)

echo   Target database: !DB_NAME! on !DB_HOST!:!DB_PORT!

:: Create the database if it doesn't exist
set PGPASSWORD=postgres
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USERNAME! -tc "SELECT 1 FROM pg_database WHERE datname='!DB_NAME!'" 2>nul | findstr /q "1" >nul
if errorlevel 1 (
    psql -h !DB_HOST! -p !DB_PORT! -U !DB_USERNAME! -c "CREATE DATABASE !DB_NAME!;" 2>nul
    if errorlevel 1 (
        echo   [WARNING] Could not auto-create database. Please run manually:
        echo     psql -U postgres -c "CREATE DATABASE !DB_NAME!;"
    ) else (
        echo   [CREATED] Database '!DB_NAME!' created successfully.
    )
) else (
    echo   [EXISTS] Database '!DB_NAME!' already exists.
)

:: --------------------------------------------------
:: 6. Install frontend dependencies
:: --------------------------------------------------
echo [6/6] Installing frontend dependencies...
if exist "node_modules" (
    echo   [EXISTS] node_modules already exists, skipping.
) else (
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo   [OK] Frontend dependencies installed.
)

:: --------------------------------------------------
:: Done
:: --------------------------------------------------
echo.
echo ====================================================
echo   Setup Complete!
echo ====================================================
echo.
echo   To start the project, run:
echo     python run_project.py
echo.
echo   Or start manually:
echo     Backend:  cd backend ^& mvnw.cmd spring-boot:run
echo     Frontend: npm run dev
echo.
echo   App URL:  http://localhost:5173
echo   API URL:  http://localhost:8080
echo ====================================================
echo.
pause

@echo off
REM NoobBlog Database Setup Script for Windows
REM This sets up your Neon PostgreSQL database via Prisma

echo ================================================
echo   NoobBlog Database Setup
echo ================================================
echo.

echo Step 1: Checking environment variables...
if exist .env.local (
    echo [OK] .env.local found
    findstr /C:"DATABASE_URL" .env.local >nul
    if %errorlevel% equ 0 (
        echo [OK] DATABASE_URL is configured
    ) else (
        echo [ERROR] DATABASE_URL not found in .env.local
        echo Please add your Neon database URL to .env.local
        pause
        exit /b 1
    )
) else (
    echo [WARNING] .env.local not found
    echo Copying from .env.example...
    copy .env.example .env.local
    echo [WARNING] Please edit .env.local and add your DATABASE_URL
    pause
    exit /b 1
)

echo.
echo Step 2: Installing dependencies...
call pnpm install

echo.
echo Step 3: Generating Prisma Client...
cd packages\database
call pnpm db:generate

echo.
echo Step 4: Pushing schema to Neon database...
echo This will create all 16 tables in your Neon database
call pnpm db:push

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   DATABASE SETUP COMPLETE!
    echo ================================================
    echo.
    echo Your Neon database now has:
    echo   * 16 tables (User, Post, Comment, etc.)
    echo   * All indexes and relations configured
    echo   * Ready for production use
    echo.
    echo Next steps:
    echo   1. Run 'pnpm dev:web' to start the blog
    echo   2. Run 'pnpm dev:admin' to start the admin dashboard
    echo   3. (Optional) Run 'pnpm db:seed' to add sample data
    echo   4. (Optional) Run 'pnpm db:studio' to view data in browser
) else (
    echo.
    echo [ERROR] Database setup failed
    echo Please check your DATABASE_URL in .env.local
    pause
    exit /b 1
)

pause

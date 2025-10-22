@echo off
echo Setting up NoobBlog development environment...
echo.

echo Installing dependencies...
call pnpm install

echo.
echo Setting up database...
cd packages\database
call pnpm prisma generate
call pnpm prisma db push
cd ..\..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env and update values
echo 2. Run 'pnpm dev:web' to start the main blog
echo 3. Run 'pnpm dev:admin' to start the admin dashboard
echo.
echo Happy blogging!
pause

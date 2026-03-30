@echo off
echo 🌱 RG ACADEMY: CORE SYNCHRONIZATION PROTOCOL (PHASE 18.6)
echo --------------------------------------------------------
echo [1/3] Generating Industrial Prisma Client...
call npx prisma generate

echo [2/3] Synchronizing Physical Database Ledger (Profile.aiReadiness)...
call npx prisma db push --accept-data-loss

echo [3/3] Re-initializing Masterclass Curriculum (Seeding)...
npm run seed

echo --------------------------------------------------------
echo ✅ CORE ALIGNMENT SUCCESSFUL. RESTART DEV SERVER.
pause

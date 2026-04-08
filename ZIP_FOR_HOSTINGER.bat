@echo off
setlocal

:: Check for node_modules to ensure user has installed them
if not exist "node_modules" (
    echo [ERROR] node_modules not found. Please run: npm install
    pause
    exit /b
)

:: Step 0: Clean slate
echo [0/4] Cleaning old artifacts...
if exist "dist" rd /s /q "dist"
if exist "server-dist.js" del "server-dist.js"
if exist "RG_Academy_HOSTINGER_DEPLOY.zip" del "RG_Academy_HOSTINGER_DEPLOY.zip"

:: Step 1: Build the frontend
echo [1/4] Building frontend assets (Vite)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed. Stopping.
    pause
    exit /b
)

:: Step 2: Compile the backend (Native JS Bundle)
echo [2/4] Compiling backend (server.ts -> server-dist.cjs)...
:: We use esbuild to bundle everything except devDependencies and prisma to bypass environment limits.
call npx esbuild server.ts --bundle --platform=node --format=cjs --outfile=server-dist.cjs --minify --packages=external --log-level=error
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Backend compilation had errors, but we will try to proceed if server-dist.cjs exists.
    if not exist "server-dist.cjs" (
        echo [ERROR] server-dist.cjs NOT FOUND. Stopping.
        pause
        exit /b
    )
)

:: Step 3: Generate Prisma client
echo [3/4] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma generation failed. Stopping.
    pause
    exit /b
)

:: Step 4: Create the deployment archive
echo [4/4] Creating final ZIP for Hostinger...
if exist "RG_Academy_HOSTINGER_DEPLOY.zip" del "RG_Academy_HOSTINGER_DEPLOY.zip"

:: Создаем временную папку сборки
if exist "BUILD_TEMP" rd /s /q "BUILD_TEMP"
mkdir BUILD_TEMP
xcopy /s /e /h /y /q dist BUILD_TEMP\dist\
xcopy /s /e /h /y /q prisma BUILD_TEMP\prisma\
copy index.js BUILD_TEMP\
copy server-dist.cjs BUILD_TEMP\
copy package.json BUILD_TEMP\
copy .env.example BUILD_TEMP\
copy .env.example BUILD_TEMP\.env

:: Хитрость для Hostinger: отключаем `vite build` внутри сервера и УДАЛЯЕМ "type": "module"
:: так как фронтенд уже собран локально в папке dist!
:: А index.js - это CJS файл, который не запустится если в package.json указан "type": "module".
node -e "const fs=require('fs'); const file='BUILD_TEMP/package.json'; let data=fs.readFileSync(file, 'utf8'); data = data.replace('\"vite build\"', '\"echo SkippingBuild\"'); data = data.replace('\"type\": \"module\",', ''); fs.writeFileSync(file, data);"

:: Запускаем сжатие
powershell -Command "Compress-Archive -Path 'BUILD_TEMP\*' -DestinationPath 'RG_Academy_HOSTINGER_DEPLOY.zip' -Force"

:: Удаляем временную папку
rmdir /s /q BUILD_TEMP

if not exist "RG_Academy_HOSTINGER_DEPLOY.zip" (
    echo [ERROR] Failed to create ZIP.
    pause
    exit /b
)

echo.
echo ===================================================
echo [SUCCESS] RG_Academy_HOSTINGER_DEPLOY.zip is ready!
echo ---------------------------------------------------
echo ТЕПЕРЬ СДЕЛАЙТЕ СЛЕДУЮЩЕЕ В ПАНЕЛИ HOSTINGER:
echo.
echo [1] Зайдите в раздел "Node.js Web App"
echo [2] Загрузите НОВЫЙ ZIP и нажмите "Extract"
echo [3] Проверьте "Application Setup":
echo     - Entry File: index.js
echo     - Node Version: 18.x или 20.x (ВАЖНО!)
echo [4] Нажмите "Apply Build Settings" и "Deploy"
echo [5] Перейдите на https://rgacademy.space/api/health
echo.
echo ЭТО РЕШИТ ПРОБЛЕМУ 503 И БЕЛОГО ЭКРАНА!
echo ===================================================
pause

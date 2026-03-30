@echo off
setlocal

:: Check for node_modules to ensure user has installed them
if not exist "node_modules" (
    echo [ERROR] node_modules not found. Please run: npm install
    pause
    exit /b
)

:: Step 1: Build the frontend
echo [1/3] Building frontend assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed. Stopping.
    pause
    exit /b
)

:: Step 2: Generate Prisma client
echo [2/3] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma generation failed. Stopping.
    pause
    exit /b
)

:: Step 3: Create the deployment archive
echo [3/3] Creating minimal ZIP for Hostinger...
if exist "RG_Academy_HOSTINGER_DEPLOY.zip" del "RG_Academy_HOSTINGER_DEPLOY.zip"

:: Создаем временную папку сборки
mkdir BUILD_TEMP
xcopy /s /e /h /y /q dist BUILD_TEMP\dist\
xcopy /s /e /h /y /q api BUILD_TEMP\api\
xcopy /s /e /h /y /q src BUILD_TEMP\src\
xcopy /s /e /h /y /q prisma BUILD_TEMP\prisma\
copy index.js BUILD_TEMP\
copy server.ts BUILD_TEMP\
copy ecosystem.config.cjs BUILD_TEMP\
copy package.json BUILD_TEMP\
copy .env.example BUILD_TEMP\

:: Хитрость для Hostinger: отключаем `vite build` внутри сервера,
:: так как фронтенд уже собран локально в папке dist!
node -e "const fs=require('fs'); const file='BUILD_TEMP/package.json'; const data=fs.readFileSync(file, 'utf8'); fs.writeFileSync(file, data.replace('\"vite build\"', '\"echo Prebuilt\"'));"

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
echo ===========================================
echo [SUCCESS] RG_Academy_HOSTINGER_DEPLOY.zip is ready!
echo -------------------------------------------
echo ТЕПЕРЬ СДЕЛАЙТЕ СЛЕДУЮЩЕЕ В ПАНЕЛИ HOSTINGER:
echo.
echo [1] Зайдите в Node.js Web App
echo [2] Загрузите RG_Academy_HOSTINGER_DEPLOY.zip и нажмите "Extract"
echo [3] Выберите файл "package.json" или "index.js" в настройках
echo [4] Добавьте в Environment variables вашу БД (DATABASE_URL=...)
echo [5] Нажмите "Install Dependencies" (Это обязательный шаг)
echo [6] Добавьте "Start command": npm start
echo [7] Нажмите "Start"
echo.
echo Для наката БД на сервере откройте SSH или Terminal и введите:
echo npx prisma migrate deploy
echo ===========================================
pause

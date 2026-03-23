# Dockerfile для воспроизводимого аудита RG_Academy
FROM node:20-alpine

# Установка зависимостей
WORKDIR /app
COPY package*.json ./
RUN npm install

# Копирование исходного кода проекта
COPY . .

# Установка дополнительных инструментов аудита
RUN npm install -g eslint jest ts-node

# Скрипты для запуска аудита
RUN mkdir -p /audit/results

# Точка входа: запуск аудиторского скрипта
CMD ["node", "audit/scripts/audit_sast.js"]

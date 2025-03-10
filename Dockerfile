# Используем официальный образ Puppeteer
FROM ghcr.io/puppeteer/puppeteer:latest

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Указываем команду для запуска теста
CMD ["node", "test.js"]
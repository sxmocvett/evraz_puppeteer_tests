import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

// загружаем переменные окружения из .env файла
dotenv.config();

(async () => {
    let browser;
    try {
        // запускаем браузер (с отключенной песочницей
        console.log('Браузер запускается...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('Браузер запущен.');

        const page = await browser.newPage();
        console.log('Новая страница открыта.');

        // логируем консоль браузера
        page.on('console', (msg) => console.log('Консоль браузера:', msg.text()));

        // формируем URL из переменных окружения и выполняем переход на страницу
        const baseUrl = process.env.VITE_API_HOST;
        console.log(`Переход на страницу: ${baseUrl}`);
        // ждём завершения всех сетевых запросов
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        console.log('Переход на страницу выполнен.');

        // скриншот страницы после загрузки
        await page.screenshot({ path: '/app/screenshots/after-load.png' });
        console.log('Скриншот после загрузки сохранён в after-load.png.');

        // формируем логин-пароль из переменных окружения для аутентификации
        const keycloakLogin = process.env.KEYCLOAK_LOGIN;
        const keycloakPassword = process.env.KEYCLOAK_PASSWORD;

        // ожидание формы входа Keycloak
        await page.waitForSelector('#username', { visible: true, timeout: 60000 });
        console.log('Форма входа Keycloak загружена.');

        // ввод логина и пароля
        await page.type('#username', keycloakLogin);
        await page.type('#password', keycloakPassword);

        // нажатие кнопки "Sign In"
        await page.click('#kc-login');
        console.log('Аутентификация выполнена.');

        // ожидание завершения аутентификации
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('Аутентификация завершена, перенаправление на целевую страницу.');

        // скриншот после аутентификации
        await page.screenshot({ path: '/app/screenshots/after-auth.png' });
        console.log('Скриншот после аутентификации сохранён в after-auth.png.');

        // ожидание загрузки кнопки
        const buttonSelector = '[data-testid="schema_legend_button"]';
        console.log(`Ожидание элемента с селектором: ${buttonSelector}`);
        await page.waitForSelector(buttonSelector, { visible: true, timeout: 60000 });
        console.log('Кнопка data-testid="schema_legend_button" загружена.');

        // скриншот перед нажатием кнопки
        await page.screenshot({ path: '/app/screenshots/before-click.png' });
        console.log('Скриншот перед нажатием кнопки сохранён в before-click.png.');

        // нажатие на кнопку
        await page.click(buttonSelector);
        console.log('Кнопка нажата.');

        // скриншот после нажатия кнопки
        await page.screenshot({ path: '/app/screenshots/after-click.png' });
        console.log('Скриншот после нажатия кнопки сохранён в after-click.png.');

        // проверка значения data-is-rotate
        const isRotate = await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (!button) {
                throw new Error(`Кнопка с селектором ${selector} не найдена`);
            }
            return button.getAttribute('data-is-rotate') === 'true';
        }, buttonSelector);

        // вывод результата теста
        if (isRotate) {
            console.log('Тест пройден: isRotate = true');
        } else {
            throw new Error('Тест не пройден: isRotate = false');
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);

        // Скриншот в случае ошибки
        if (page) {
            await page.screenshot({ path: '/app/screenshots/error.png' });
            console.log('Скриншот в случае ошибки сохранён в error.png.');
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('Браузер закрыт.');
        }
    }
})();
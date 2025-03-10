import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

// Загружаем переменные окружения
dotenv.config();

(async () => {
	let browser;
	try {
		// Запуск браузера
		console.log('Браузер запускается...');
		browser = await puppeteer.launch({ headless: false });
		console.log('Браузер запущен.');

		const page = await browser.newPage();
		console.log('Новая страница открыта.');

		// Формируем URL из переменных окружения
		const baseUrl = process.env.VITE_API_HOST || 'http://localhost:5174';
		console.log(`VITE_API_HOST: ${process.env.VITE_API_HOST}`);

		// Переход на страницу
		console.log(`Переход на страницу: ${baseUrl}`);
		await page.goto(baseUrl, { waitUntil: 'networkidle0' });
		console.log('Переход на страницу выполнен.');

		// Ожидание загрузки кнопки
		const buttonSelector = '[data-testid="schema_legend_button"]';
		await page.waitForSelector(buttonSelector, { timeout: 30000 });
		console.log('Кнопка data-testid="schema_legend_button" загружена.');

		// Нажатие на кнопку
		await page.click(buttonSelector);
		console.log('Кнопка нажата.');

		// Проверка значения data-is-rotate
		const isRotate = await page.evaluate((selector) => {
			const button = document.querySelector(selector);
			return button.getAttribute('data-is-rotate') === 'true';
		}, buttonSelector);

		// Вывод результата теста
		console.log(
			isRotate
				? 'Тест пройден: isRotate = true'
				: 'Тест не пройден: isRotate = false',
		);
	} catch (error) {
		console.error('Произошла ошибка:', error.message);
	} finally {
		// Закрытие браузера
		if (browser) {
			await browser.close();
			console.log('Браузер закрыт.');
		}
	}
})();

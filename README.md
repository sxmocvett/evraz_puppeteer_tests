# Запуск тестов

Для запуска тестов необходимо:

* создать в корне проекта .env файл, где указать VITE_API_HOST - url нужной веб-страницы,
KEYCLOAK_LOGIN и KEYCLOAK_PASSWORD - логин и пароль для аутентификации
* выполнить docker-compose up --build

# Результаты работы тестов

Результатами успешного прохождения тестов являются:

* появление скриншотов страниц в puppeteer-screenshots
* логи об успешном выполнении

*puppeteer-test | Скриншот после аутентификации сохранён в after-auth.png.*

*puppeteer-test | Ожидание элемента с селектором: [data-testid="schema_legend_button"]*

*puppeteer-test | Кнопка data-testid="schema_legend_button" загружена.*

*puppeteer-test | Скриншот перед нажатием кнопки сохранён в before-click.png.*

*puppeteer-test | Кнопка нажата.*

*puppeteer-test | Скриншот после нажатия кнопки сохранён в after-click.png.*

*puppeteer-test | Тест пройден: isRotate = true*

*puppeteer-test | Браузер закрыт.*
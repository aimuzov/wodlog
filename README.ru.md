<p align="center">
	<a href="README.md"><img src="https://img.shields.io/badge/English-555?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCI+PGNsaXBQYXRoIGlkPSJ0Ij48cGF0aCBkPSJNMzAsMTVoMzB2MTV6djE1aC0zMHpoLTMwdi0xNXp2LTE1aDMweiIvPjwvY2xpcFBhdGg+PHBhdGggZD0iTTAsMHYzMGg2MHYtMzB6IiBmaWxsPSIjMDEyMTY5Ii8+PHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+PHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIgc3Ryb2tlPSIjQzgxMDJFIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNDODEwMkUiIHN0cm9rZS13aWR0aD0iNiIvPjwvc3ZnPg==" alt="English"></a>
	<img src="https://img.shields.io/badge/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9-0066cc?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5IDYiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoOXYzSDB6Ii8+PHBhdGggZmlsbD0iIzAwMzlhNiIgZD0iTTAgMmg5djJIMHoiLz48cGF0aCBmaWxsPSIjZDUyYjFlIiBkPSJNMCA0aDl2MkgweiIvPjwvc3ZnPg==" alt="Русский">
</p>

<!-- Раскомментировать, когда в .github/assets появится banner.jpg.
<p align="center">
	<a href="https://wodlog.aimuzov.online"><img src=".github/assets/banner.jpg" alt="WODlog: WODlog — тренировка дня с доски, личные результаты, рейтинг зала и таймер для кроссфита" width="100%"></a>
</p>
-->

<p align="center">
	<a href="https://github.com/aimuzov/wodlog/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/aimuzov/wodlog/deploy.yml?branch=main&label=release" alt="Release"></a>
	<a href="https://wodlog.aimuzov.online"><img src="https://img.shields.io/website?url=https%3A%2F%2Fwodlog.aimuzov.online&label=site" alt="Site status"></a>
	<a href="package.json"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Faimuzov%2Fwodlog%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=nodedotjs&logoColor=white&color=5fa04e" alt="Node"></a>
	<a href="https://astro.build"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov/wodlog/astro?logo=astro&logoColor=white&color=bc52ee" alt="Astro"></a>
	<a href="https://svelte.dev"><img src="https://img.shields.io/github/package-json/dependency-version/aimuzov/wodlog/svelte?logo=svelte&logoColor=white&color=ff3e00" alt="Svelte"></a>
	<a href="LICENSE"><img src="https://img.shields.io/github/license/aimuzov/wodlog" alt="License"></a>
</p>

<h3 align="center">WODlog — тренировка дня с доски, личные результаты, рейтинг зала и таймер для кроссфита</h3>

<!-- Раскомментировать, когда в .github/assets появятся скриншоты.
<table>
	<tr>
		<td width="50%" align="center"><img src=".github/assets/home.jpg" alt="Главная"><br><b>Главная</b> для посетителей</td>
		<td width="50%" align="center"><img src=".github/assets/screen.jpg" alt="Второй экран"><br><b>Экран</b> что на нём</td>
	</tr>
</table>
-->

<p>Telegram Mini App <a href="https://t.me/wodlogrobot">@wodlogrobot</a> на весь экран и PWA на <a href="https://wodlog.aimuzov.online">wodlog.aimuzov.online</a>. Фронт на <a href="https://astro.build">Astro</a> и <a href="https://svelte.dev">Svelte</a>, API на голом Node с SQLite.</p>

## Что внутри

- **Тренировка дня.** Одна на зал и дату. Кто-то переносит с доски разминку и комплексы (AMRAP, EMOM, For Time, силовая), и тренировка появляется у всего зала. Править её может любой участник.
- **Результаты.** В каждом комплексе свой результат: RX или Scaled, раунды и повторы, время или кап, рабочий вес, а ещё вес и инвентарь по каждому движению.
- **Рейтинг.** Лидерборд комплекса и сводная таблица зала за неделю, месяц и всё время: очко за участие плюс 10, 8, 6, 5, 4, 3, 2, 1 за места. Правила подсчёта — в [`src/shared/scoring.ts`](src/shared/scoring.ts).
- **Открытый и закрытый профиль.** Закрытый ведёт статистику только для себя и в таблицы не попадает.
- **Залы по приглашению.** Ссылка `t.me/wodlogrobot?startapp=gym_<код>` сразу добавляет человека в зал.
- **Таймер.** For Time, AMRAP, EMOM, Tabata и интервалы со звуком, вибрацией и неспящим экраном. Работает без входа и офлайн. Из комплекса запускается с параметрами с доски.
- **Профиль.** История результатов и личные рекорды по движениям.

## Как устроено

Всё лежит в `src/`:

- [`src/frontend`](src/frontend): Astro, это `srcDir` в `astro.config.mjs`. Приложение — один Svelte-остров на главной ([`components/app.svelte`](src/frontend/components/app.svelte)), экраны переключаются без роутера ([`state/app.svelte.ts`](src/frontend/state/app.svelte.ts)). Обвязка Telegram (fullscreen, safe area, тема, «Назад», вибрация) — в [`lib/telegram.ts`](src/frontend/lib/telegram.ts).
- [`src/backend`](src/backend): API на `node:http` и `node:sqlite`, Node запускает TypeScript сам, без сборки и зависимостей. Вход — подписанный initData Mini App или Telegram Login Widget в браузере, дальше сессионный токен. Бот живёт в том же процессе: забирает апдейты long polling и отвечает на `/start` кнопкой Mini App.
- [`src/shared`](src/shared): типы, нормализация тренировки и результата, подсчёт рейтинга и логика таймера. Нужны обеим сторонам, все с тестами.

Всё про сервер — в [`deploy`](deploy): Dockerfile фронта и API, compose, nginx.

Все файлы, компоненты тоже, называются в kebab-case: `base.astro`, `section-photo.astro`. Имя в разметке задаёт импорт (`import Base from '#frontend/layouts/base.astro'`), а за файлами следит правило `unicorn/filename-case` в oxlint.

## Запуск

Стек и раскладка — из [infra-site-template](https://github.com/aimuzov/infra-site-template): Astro + Svelte 5, Prettier, oxlint, stylelint (BEM), `node --test` для unit-тестов, Playwright для e2e. Конфиги Prettier, stylelint, oxlint и Playwright и шаги CI берутся из [infra-site-kit](https://github.com/aimuzov/infra-site-kit). Node берётся из [`mise.toml`](mise.toml), эта же версия закреплена в `package.json` и в [`deploy/frontend.Dockerfile`](deploy/frontend.Dockerfile).

```sh
cp .env.example .env   # BOT_TOKEN обязателен, для входа без Telegram: DEV_LOGIN=1 и DATA_DIR=./data
npm ci
npm run api            # API на :8787
npm run dev            # фронт, /api проксируется на API
```

Перед коммитом — те же проверки, что в CI:

```sh
npm run format:check && npm run lint:js && npm run lint:css && npm run check && npm test
```

E2E-тесты в [`e2e`](e2e) собирают сайт и открывают его в Chromium: каждая страница из sitemap отвечает без ошибок в консоли и проходит axe, таймер Tabata проходит подготовку, работу, отдых и паузу. Браузер ставится один раз через `npx playwright install chromium`.

```sh
npm run test:e2e
```

## Мобильная версия

Safari на iPhone сам приближает страницу, когда встаёшь в поле ввода с текстом мельче 16px, и обратно не отдаляет. Поэтому у `input`, `textarea` и `select` на сенсорных экранах (`@media (--touch)`) шрифт не меньше `1rem`: базовое правило лежит в [`global.css`](src/frontend/styles/global.css), а компоненту со своим `font-size` у поля нужно повторить его у себя.

Зум целиком через `maximum-scale=1` или `user-scalable=no` в viewport не выключаем: тогда мелкий текст нечем увеличить тем, кто плохо видит.

## Content Security Policy

Сборка кладёт в каждую страницу CSP с хешами скриптов и стилей Astro (настройка `security.csp` в `astro.config.mjs`). В `npm run dev` политики нет, поэтому нарушения видны только после `npm run build && npm run preview` и на проде.

- Никаких атрибутов `style=""` и обработчиков вроде `onclick`: стили задаются классами и правилами в `<style>`, обработчики живут в `<script>`.
- Внешний скрипт, картинку или запрос (виджет, карту, шрифт с CDN) сначала нужно разрешить в `security.csp`. Сейчас там только Telegram: SDK Mini App и Login Widget с `telegram.org`, окно виджета с `oauth.telegram.org` и аватарки с `t.me`.
- Встраивание в iframe Telegram Web разрешает не CSP страницы, а Caddy: `frame-ancestors` в `sites/wodlog.caddy` infra-server.
- После таких правок стоит открыть консоль браузера в `npm run preview`: всё заблокированное браузер пишет туда.

## Выкладка

Сервер проектов из [infra-server](https://github.com/aimuzov/infra-server): мерж релизного PR, который ведёт release-please, запускает `deploy.yml`, он гоняет проверки и заходит по SSH. Шаги обоих берутся из [infra-site-kit](https://github.com/aimuzov/infra-site-kit), там же адрес сервера и его строка `known_hosts`. Там ключ запускает общий [`deploy/site.sh`](https://github.com/aimuzov/infra-server/blob/main/deploy/site.sh) из infra-server, который подтягивает `main` и пересобирает контейнеры `wodlog` (nginx со статикой) и `wodlog-api` из [`deploy/docker-compose.yml`](deploy/docker-compose.yml). Домен и TLS держит общий Caddy, `/api/*` он отдаёт в `wodlog-api`. База и кэш аватарок лежат в volume `wodlog-data`. В Telegram и Sentry API ходит через `vpn:3128` из infra-server. Ошибки API и браузера уходят в проект `wodlog` в Sentry, если в `.env` заданы `SENTRY_DSN` и `PUBLIC_SENTRY_DSN`. `.env` лежит на сервере в `/srv/wodlog`, образец — [`.env.example`](.env.example).

### Бот

В [@BotFather](https://t.me/BotFather) для `@wodlogrobot`:

- `/newapp` или Bot Settings → Configure Mini App: Main Mini App с адресом `https://wodlog.aimuzov.online`. Тогда работают ссылки `t.me/wodlogrobot?startapp=…`.
- `/setdomain` → `wodlog.aimuzov.online`: без этого Login Widget в браузере пишет «Bot domain invalid».

Остальное API делает само при старте: снимает webhook, ставит кнопку меню с Mini App и забирает апдейты long polling. Webhook здесь не работает: соединения от серверов Telegram до сервера в России не доходят, а исходящие идут через `vpn:3128`. Локально бот выключается через `BOT_POLLING=0`, иначе dev отбирает апдейты у прода.

Job выкладки запускается, только когда переменная репозитория `DEPLOY_ENABLED` равна `true`, так что пока сервер не готов, релиз гоняет одни проверки.

Быстро откатиться — запустить Release вручную с прошлым тегом: `gh workflow run deploy.yml -f tag=v1.2.3`. Исправление плохого коммита выезжает через релизный PR, как любое изменение.

## Лицензия

Код распространяется по лицензии [MIT](LICENSE). Содержимое сайта (тексты, изображения, имена и контакты) под неё не подпадает: все права защищены.

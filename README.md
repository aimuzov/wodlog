<p align="center">
	<img src="https://img.shields.io/badge/English-0066cc?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCI+PGNsaXBQYXRoIGlkPSJ0Ij48cGF0aCBkPSJNMzAsMTVoMzB2MTV6djE1aC0zMHpoLTMwdi0xNXp2LTE1aDMweiIvPjwvY2xpcFBhdGg+PHBhdGggZD0iTTAsMHYzMGg2MHYtMzB6IiBmaWxsPSIjMDEyMTY5Ii8+PHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+PHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIgc3Ryb2tlPSIjQzgxMDJFIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNDODEwMkUiIHN0cm9rZS13aWR0aD0iNiIvPjwvc3ZnPg==" alt="English">
	<a href="README.ru.md"><img src="https://img.shields.io/badge/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9-555?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5IDYiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoOXYzSDB6Ii8+PHBhdGggZmlsbD0iIzAwMzlhNiIgZD0iTTAgMmg5djJIMHoiLz48cGF0aCBmaWxsPSIjZDUyYjFlIiBkPSJNMCA0aDl2MkgweiIvPjwvc3ZnPg==" alt="Русский"></a>
</p>

<!-- Uncomment once .github/assets/banner.en.jpg is in place.
<p align="center">
	<a href="https://wodlog.aimuzov.online"><img src=".github/assets/banner.en.jpg" alt="WODlog: WODlog keeps the workout of the day from the board, personal results, the gym leaderboard and a timer for CrossFit" width="100%"></a>
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

<h3 align="center">WODlog keeps the workout of the day from the board, personal results, the gym leaderboard and a timer for CrossFit</h3>

<!-- Uncomment once the screenshots are in .github/assets.
<table>
	<tr>
		<td width="50%" align="center"><img src=".github/assets/home.jpg" alt="Home page"><br><b>Home</b> for visitors</td>
		<td width="50%" align="center"><img src=".github/assets/screen.jpg" alt="Second screen"><br><b>Screen</b> what it shows</td>
	</tr>
</table>
-->

<p>A full-screen Telegram Mini App <a href="https://t.me/wodlogrobot">@wodlogrobot</a> and a PWA at <a href="https://wodlog.aimuzov.online">wodlog.aimuzov.online</a>. The front end is <a href="https://astro.build">Astro</a> and <a href="https://svelte.dev">Svelte</a>, the API is plain Node with SQLite.</p>

The app is in Russian, so the names below are translated.

## What's inside

- **Workout of the day.** One per gym and date. Someone copies the warm-up and the parts (AMRAP, EMOM, For Time, strength) from the board, and the whole gym gets the workout. Any member can edit it.
- **Results.** Each part has its own result: RX or Scaled, rounds and reps, time or cap, working weight, plus the weight and equipment per movement.
- **Leaderboards.** One per part and a gym table for the week, month and all time: a point for taking part plus 10, 8, 6, 5, 4, 3, 2, 1 for places. Scoring rules are in [`src/shared/scoring.ts`](src/shared/scoring.ts).
- **Public and private profiles.** A private one keeps stats for its owner only and stays out of the tables.
- **Invite-only gyms.** The link `t.me/wodlogrobot?startapp=gym_<code>` adds a person to the gym right away.
- **Timer.** For Time, AMRAP, EMOM, Tabata and intervals with sound, vibration and the screen kept on. Works without signing in and offline. A part starts it with the numbers from the board.
- **Profile.** Result history and personal records per movement.

## How it is built

Everything lives in `src/`:

- [`src/frontend`](src/frontend): Astro, the `srcDir` in `astro.config.mjs`. The app is one Svelte island on the home page ([`components/app.svelte`](src/frontend/components/app.svelte)), screens switch without a router ([`state/app.svelte.ts`](src/frontend/state/app.svelte.ts)). The Telegram glue (fullscreen, safe area, theme, Back button, haptics) is in [`lib/telegram.ts`](src/frontend/lib/telegram.ts).
- [`src/backend`](src/backend): the API on `node:http` and `node:sqlite`, Node runs the TypeScript itself, no build and no dependencies. Sign-in is the signed Mini App initData or the Telegram Login Widget in a browser, then a session token. The bot lives in the same process: it fetches updates with long polling and answers `/start` with a Mini App button.
- [`src/shared`](src/shared): types, workout and result normalization, scoring and the timer logic. Both sides use them, all are tested.

Everything about the server is in [`deploy`](deploy): Dockerfiles of the front end and the API, compose, nginx.

Every file, components included, is named in kebab-case: `base.astro`, `section-photo.astro`. The name used in markup comes from the import (`import Base from '#frontend/layouts/base.astro'`), and the `unicorn/filename-case` rule in oxlint keeps file names in line.

## Running

Stack and layout follow [infra-site-template](https://github.com/aimuzov/infra-site-template): Astro + Svelte 5, Prettier, oxlint, stylelint (BEM), `node --test` for unit tests, Playwright for e2e. The Prettier, stylelint, oxlint and Playwright configs and the CI steps come from [infra-site-kit](https://github.com/aimuzov/infra-site-kit). Node comes from [`mise.toml`](mise.toml), the same version is pinned in `package.json` and [`deploy/frontend.Dockerfile`](deploy/frontend.Dockerfile).

```sh
cp .env.example .env   # BOT_TOKEN is required; to sign in without Telegram: DEV_LOGIN=1 and DATA_DIR=./data
npm ci
npm run api            # API on :8787
npm run dev            # front end, /api is proxied to the API
```

Before committing, the same checks as in CI:

```sh
npm run format:check && npm run lint:js && npm run lint:css && npm run check && npm test
```

E2E tests in [`e2e`](e2e) build the site and open it in Chromium: every sitemap page answers without console errors and passes axe, and the Tabata timer goes through prep, work, rest and pause. The browser is installed once with `npx playwright install chromium`.

```sh
npm run test:e2e
```

## Mobile

Safari on iPhone zooms the page in when you tap a field whose text is under 16px, and never zooms back out. So `input`, `textarea` and `select` on touch screens (`@media (--touch)`) get at least `1rem`: the base rule lives in [`global.css`](src/frontend/styles/global.css), and a component that sets its own `font-size` on a field has to repeat it.

Zoom as a whole is not turned off with `maximum-scale=1` or `user-scalable=no` in the viewport: that leaves people with poor eyesight no way to enlarge small text.

## Content Security Policy

The build puts a CSP with hashes of Astro's scripts and styles into every page (the `security.csp` option in `astro.config.mjs`). `npm run dev` has no policy, so violations only show up after `npm run build && npm run preview` and in production.

- No `style=""` attributes or handlers like `onclick`: styles go through classes and rules in `<style>`, handlers live in `<script>`.
- An external script, image or request (a widget, a map, a font from a CDN) has to be allowed in `security.csp` first. Right now only Telegram is there: the Mini App SDK and the Login Widget from `telegram.org`, the widget window from `oauth.telegram.org` and avatars from `t.me`.
- Embedding into the Telegram Web iframe is allowed by Caddy, not by the page CSP: `frame-ancestors` in `sites/wodlog.caddy` of infra-server.
- After such changes, check the browser console in `npm run preview`: the browser reports everything it blocks there.

## Deployment

The projects server from [infra-server](https://github.com/aimuzov/infra-server): merging the release PR that release-please keeps open runs `deploy.yml`, which runs the checks and logs in over SSH. The steps of both come from [infra-site-kit](https://github.com/aimuzov/infra-site-kit), which also holds the server address and its `known_hosts` line. There the key runs the shared [`deploy/site.sh`](https://github.com/aimuzov/infra-server/blob/main/deploy/site.sh) of infra-server, which pulls `main` and rebuilds the `wodlog` (nginx with the static site) and `wodlog-api` containers from [`deploy/docker-compose.yml`](deploy/docker-compose.yml). The domain and TLS are handled by the shared Caddy, which sends `/api/*` to `wodlog-api`. The database and the avatar cache live in the `wodlog-data` volume. The API reaches Telegram, and Sentry, through `vpn:3128` of infra-server. Errors of the API and the browser go to the `wodlog` project in Sentry when `SENTRY_DSN` and `PUBLIC_SENTRY_DSN` are set in `.env`. `.env` lives on the server in `/srv/wodlog`, the template is [`.env.example`](.env.example).

### Bot

In [@BotFather](https://t.me/BotFather) for `@wodlogrobot`:

- `/newapp` or Bot Settings → Configure Mini App: the Main Mini App at `https://wodlog.aimuzov.online`. That makes `t.me/wodlogrobot?startapp=…` links work.
- `/setdomain` → `wodlog.aimuzov.online`: without it the Login Widget in a browser says "Bot domain invalid".

The API does the rest on start: it drops the webhook, sets the menu button with the Mini App and fetches updates with long polling. A webhook doesn't work here: connections from Telegram's servers never reach a server in Russia, while outgoing requests go through `vpn:3128`. Locally `BOT_POLLING=0` turns the bot off, otherwise dev takes updates away from production.

The deploy job runs only when the repository variable `DEPLOY_ENABLED` is `true`, so until the server is set up, a release only runs the checks.

To roll back fast, run Release by hand with the previous tag: `gh workflow run deploy.yml -f tag=v1.2.3`. A fix of the bad commit goes out through the release PR like any change.

## License

The code is licensed under [MIT](LICENSE). Site content (texts, images, names and contacts) is not covered by it: all rights reserved.

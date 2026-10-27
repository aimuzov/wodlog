import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'

import pwa from './src/frontend/integrations/pwa.ts'

export default defineConfig({
	// Фронт в `src/frontend`, API в `src/backend`, общие типы и логика в `src/shared`.
	srcDir: './src/frontend',
	// Абсолютные URL в canonical, og:url и sitemap.
	site: 'https://wodlog.aimuzov.online',
	// CSS немного, и встроенный в HTML он не блокирует первую отрисовку
	// отдельным запросом.
	build: { inlineStylesheets: 'always' },
	// Приложение -- один Svelte-остров на главной, сервис-воркер для офлайна собирает pwa().
	integrations: [svelte(), sitemap(), pwa()],
	// Подсветка Shiki несовместима с CSP.
	markdown: { syntaxHighlight: false },
	// В dev API крутится отдельно (`npm run api`), Vite пробрасывает к нему запросы.
	vite: {
		// API_PORT -- когда 8787 занят вторым checkout'ом того же проекта.
		server: { proxy: { '/api': `http://localhost:${process.env.API_PORT || 8787}` } },
	},
	// Astro кладёт в `<meta>` страницы CSP с хешами своих скриптов и стилей.
	// `frame-ancestors` в `<meta>` не работает, встраивание в Telegram разрешает Caddy.
	security: {
		csp: {
			// SDK Mini App и Login Widget грузятся с telegram.org.
			scriptDirective: { resources: ["'self'", 'https://telegram.org'] },
			directives: [
				"default-src 'self'",
				// Аватарки отдаёт наш же API, см. src/backend/avatars.ts.
				"img-src 'self' data:",
				// Ошибки браузера уходят в Sentry, см. src/frontend/lib/sentry.ts.
				"connect-src 'self' https://*.ingest.de.sentry.io",
				// Окно Login Widget.
				'frame-src https://oauth.telegram.org',
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			],
		},
	},
})

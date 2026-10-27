// Именованный импорт: в бандл попадает только версия, а не весь package.json.
import { version } from '#package.json'
import { dataCollection } from '#shared/sentry.ts'

/**
 * Отправляет ошибки браузера в Sentry, в общий с API проект, с тегом `component: site`.
 * Только ошибки, без трейсинга и Replay.
 *
 * DSN вшивается при сборке из `PUBLIC_SENTRY_DSN`. Без него и в dev SDK не грузится вовсе,
 * а с ним приезжает отдельным чанком после загрузки страницы и не тормозит первую отрисовку.
 * Ошибки до этого момента в Sentry не попадут.
 */
export function sentry() {
	const dsn = import.meta.env.PUBLIC_SENTRY_DSN

	if (!import.meta.env.PROD || !dsn) return

	const start = async () => {
		// Деструктуризация прямо в импорте: бандлер выбрасывает из чанка всё, кроме `init`.
		const { init } = await import('@sentry/browser')

		init({
			dsn,
			environment: 'production',
			release: `wodlog@${version}`,
			initialScope: { tags: { component: 'site' } },
			dataCollection,
			// Без сессий: иначе SDK стучится в Sentry на каждый заход, а не только при ошибке.
			integrations: (defaults) => defaults.filter(({ name }) => name !== 'BrowserSession'),
		})
	}

	if (document.readyState === 'complete') void start()
	else addEventListener('load', () => void start(), { once: true })
}

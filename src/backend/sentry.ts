/**
 * Ошибки API уходят в Sentry, в общий с фронтом проект `wodlog`, их различает тег `component`.
 * Только ошибки, без трейсинга. Без `SENTRY_DSN` (локально, в тестах) SDK не включается,
 * а `captureException` ничего не делает.
 *
 * server.ts импортирует модуль первым: тогда необработанные исключения ловятся с самого старта.
 */

import * as Sentry from '@sentry/node'

import pkg from '#package.json' with { type: 'json' }

if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: 'production',
		release: `wodlog@${pkg.version}`,
		// SDK смотрит только на `https_proxy` в нижнем регистре, а compose задаёт `HTTPS_PROXY`.
		transportOptions: { proxy: process.env.HTTPS_PROXY },
		initialScope: { tags: { component: 'api' } },
	})
}

export const { captureException } = Sentry

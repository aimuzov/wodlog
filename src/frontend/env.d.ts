/// <reference types="astro/client" />

// Только interface: переменные добавляются к типу Astro через declaration merging.
// oxlint-disable-next-line typescript/consistent-type-definitions
interface ImportMetaEnv {
	/** Имя бота без @: для Login Widget и ссылок-приглашений. */
	readonly PUBLIC_BOT_USERNAME?: string
	/** DSN проекта wodlog в Sentry для ошибок браузера, без него Sentry выключен. */
	readonly PUBLIC_SENTRY_DSN?: string
}

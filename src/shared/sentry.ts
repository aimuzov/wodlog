/**
 * Что Sentry не собирает ни в браузере, ни в API: в событие идут только ошибка и её стек.
 *
 * В SDK v11 нет `sendDefaultPii`, а по умолчанию `dataCollection` забирает всё подряд:
 * пользователя, cookies, заголовки с токеном сессии, тела запросов с результатами.
 */
export const dataCollection = {
	userInfo: false,
	cookies: false,
	httpHeaders: false,
	httpBodies: [],
	urlQueryParams: false,
	genAI: { inputs: false, outputs: false },
	stackFrameVariables: false,
}

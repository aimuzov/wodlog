/**
 * API WODlog: вход через Telegram, залы, тренировки дня, результаты и рейтинг.
 *
 * Node запускает файл сам, без сборки, из зависимостей только `@sentry/node`. Фронт -- статика
 * в соседнем контейнере, Caddy отдаёт сюда только `/api/*`.
 */

// Первым: Sentry должен успеть включиться до остального кода.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { join } from 'node:path'

import { verifyInitData, verifyLoginWidget } from '#backend/auth.ts'
import { AvatarCache, download, isTelegramImage, type Download, type Image } from '#backend/avatars.ts'
import { Db, type TelegramUser } from '#backend/db.ts'
import { captureException } from '#backend/sentry.ts'
import { botApi, runBot } from '#backend/telegram.ts'
import type { RatingPeriod, RxWeights, Visibility } from '#shared/types.ts'
import { InvalidInput, resultInput, text, withRxLoad, workoutDraft } from '#shared/workout.ts'

// Самое большое тело -- тренировка из редактора, это килобайты.
export const BODY_LIMIT = 1024 * 1024

export type Settings = {
	botToken: string
	appUrl: string
	dataDir: string
	/** Часовой пояс залов: по нему считается «сегодня» в рейтинге. */
	timeZone: string
	/** Вход без Telegram для локальной разработки и e2e, на проде выключен. */
	devLogin: boolean
}

type Json = [status: number, body: unknown]
type Raw = { status: number; type: string; body: Buffer; headers?: Record<string, string> }
type Reply = Json | Raw

type Context = {
	request: IncomingMessage
	params: string[]
	query: URLSearchParams
	/** id пользователя по сессии, бросает 401 без неё. */
	user: () => number
	body: () => Promise<Record<string, unknown>>
}

/**
 * Ошибка с HTTP-статусом для клиента.
 *
 * Статус и сообщение уходят в ответ как есть. Любая другая ошибка пишется в лог
 * и отдаётся с кодом 500.
 */
export class HttpError extends Error {
	// Без parameter properties: Node только стирает типы и такой синтаксис не запустит.
	readonly status: number

	constructor(status: number, message: string) {
		super(message)
		this.status = status
	}
}

/** Тело запроса как JSON-объект. 413, если оно больше `limit`, 400, если это не объект. */
export async function readJson(request: AsyncIterable<Buffer>, limit = BODY_LIMIT): Promise<Record<string, unknown>> {
	const chunks: Buffer[] = []

	let size = 0

	for await (const chunk of request) {
		size += chunk.length

		if (size > limit) throw new HttpError(413, 'Слишком большой запрос')

		chunks.push(chunk)
	}

	try {
		const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')

		if (typeof body === 'object' && body !== null && !Array.isArray(body)) return body
	} catch {
		// Ответим так же, как на не-объект.
	}

	throw new HttpError(400, 'Тело запроса не JSON-объект')
}

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function today(timeZone: string, at = new Date()) {
	// en-CA форматирует дату как YYYY-MM-DD.
	return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at)
}

function date(value: string) {
	if (!DATE.test(value) || Number.isNaN(Date.parse(value))) throw new HttpError(400, 'Дата в формате YYYY-MM-DD')

	return value
}

export function createApp(db: Db, settings: Settings, fetchImage: Download = download) {
	const avatars = new AvatarCache(join(settings.dataDir, 'avatars'), fetchImage)

	/** Проверяет членство в зале и возвращает его id. 404, а не 403: чужие залы не светим. */
	function member(userId: number, raw: string) {
		const gymId = Number(raw)

		if (!db.role(gymId, userId)) throw new HttpError(404, 'Нет такого зала')

		return gymId
	}

	function login(user: TelegramUser) {
		db.upsertUser(user)

		return { token: db.createSession(user.id), me: db.me(user.id), gyms: db.gyms(user.id) }
	}

	const routes: [method: string, pattern: RegExp, handler: (ctx: Context) => Promise<Reply> | Reply][] = [
		['GET', /^\/api\/health$/, () => [200, { ok: true }]],

		// Без входа: `<img>` не умеет слать токен, а аватарка и так видна всем в Telegram.
		[
			'GET',
			/^\/api\/avatars\/(\d+)$/,
			async ({ params }) => {
				const photoUrl = db.photoUrl(Number(params[0]))

				if (!photoUrl || !isTelegramImage(photoUrl)) throw new HttpError(404, 'Аватарки нет')

				let image: Image

				try {
					image = await avatars.get(photoUrl)
				} catch (error) {
					console.error('avatar', (error as Error).message)

					throw new HttpError(502, 'Telegram не отдал аватарку')
				}

				return {
					status: 200,
					...image,
					headers: {
						// Адрес с версией фото, поэтому кэшировать можно надолго.
						'cache-control': 'public, max-age=604800, immutable',
						// Аватарки бывают SVG: открытые напрямую, они не должны исполнять скрипты.
						'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
					},
				}
			},
		],

		[
			'POST',
			/^\/api\/auth\/telegram$/,
			async ({ body }) => {
				const signed = verifyInitData(text((await body()).initData, 8192), settings.botToken)

				if (!signed) throw new HttpError(401, 'Telegram не подтвердил вход, откройте приложение заново')

				return [200, { ...login(signed.user), startParam: signed.startParam }]
			},
		],

		[
			'POST',
			/^\/api\/auth\/widget$/,
			async ({ body }) => {
				const user = verifyLoginWidget(await body(), settings.botToken)

				if (!user) throw new HttpError(401, 'Telegram не подтвердил вход')

				return [200, login(user)]
			},
		],

		[
			'POST',
			/^\/api\/auth\/dev$/,
			async ({ body }) => {
				if (!settings.devLogin) throw new HttpError(404, 'Нет такой ручки')

				const raw = await body()

				return [200, login({ id: Number(raw.id) || 1, first_name: text(raw.name, 60) || 'Dev' })]
			},
		],

		['GET', /^\/api\/me$/, ({ user }) => [200, { me: db.me(user()), gyms: db.gyms(user()) }]],

		[
			'PATCH',
			/^\/api\/me$/,
			async ({ user, body }) => {
				const patch = await body()

				if ('visibility' in patch) {
					if (patch.visibility !== 'public' && patch.visibility !== 'private')
						throw new HttpError(400, 'Видимость: public или private')

					db.setVisibility(user(), patch.visibility as Visibility)
				}

				if ('rxWeights' in patch) {
					if (patch.rxWeights !== 'm' && patch.rxWeights !== 'f' && patch.rxWeights !== null)
						throw new HttpError(400, 'RX-веса: m, f или null')

					db.setRxWeights(user(), patch.rxWeights as RxWeights | null)
				}

				return [200, db.me(user())]
			},
		],

		['GET', /^\/api\/me\/history$/, ({ user }) => [200, db.history(user())]],

		[
			'POST',
			/^\/api\/gyms$/,
			async ({ user, body }) => {
				const name = text((await body()).name, 80)

				if (!name) throw new HttpError(400, 'Как называется зал?')

				return [201, db.createGym(user(), name)]
			},
		],

		[
			'POST',
			/^\/api\/gyms\/join$/,
			async ({ user, body }) => {
				const gym = db.joinGym(user(), text((await body()).code, 40).toLowerCase())

				if (!gym) throw new HttpError(404, 'Приглашение не найдено или устарело')

				return [200, gym]
			},
		],

		[
			'PATCH',
			/^\/api\/gyms\/(\d+)$/,
			async ({ user, params, body }) => {
				const gymId = member(user(), params[0])
				const name = text((await body()).name, 80)

				if (db.role(gymId, user()) !== 'admin') throw new HttpError(403, 'Переименовать зал может только админ')

				if (!name) throw new HttpError(400, 'Как называется зал?')

				db.renameGym(gymId, name)

				return [200, db.gym(gymId, user())]
			},
		],

		[
			'DELETE',
			/^\/api\/gyms\/(\d+)\/membership$/,
			({ user, params }) => {
				db.leaveGym(user(), member(user(), params[0]))

				return [200, { ok: true }]
			},
		],

		[
			'GET',
			/^\/api\/gyms\/(\d+)\/workouts\/([\d-]+)$/,
			({ user, params }) => {
				const gymId = member(user(), params[0])

				return [200, { workout: db.workout(gymId, date(params[1])), dates: db.workoutDates(gymId) }]
			},
		],

		[
			'PUT',
			/^\/api\/gyms\/(\d+)\/workouts\/([\d-]+)$/,
			async ({ user, params, body }) => {
				const gymId = member(user(), params[0])
				const day = date(params[1])
				const draft = workoutDraft(await body())

				if (!draft.warmup && draft.parts.length === 0) throw new HttpError(400, 'Пустая тренировка')

				return [200, db.saveWorkout(gymId, day, user(), draft)]
			},
		],

		[
			'GET',
			/^\/api\/gyms\/(\d+)\/rating$/,
			({ user, params, query }) => {
				const gymId = member(user(), params[0])
				const period = query.get('period') as RatingPeriod

				if (!['week', 'month', 'all'].includes(period)) throw new HttpError(400, 'Период: week, month или all')

				return [200, db.rating(gymId, period, today(settings.timeZone))]
			},
		],

		[
			'GET',
			/^\/api\/parts\/(\d+)\/results$/,
			({ user, params }) => {
				const info = db.partInfo(Number(params[0]))

				if (!info || !db.role(info.gymId, user())) throw new HttpError(404, 'Нет такого комплекса')

				return [200, db.leaderboard(Number(params[0]), info.kind, user())]
			},
		],

		[
			'PUT',
			/^\/api\/parts\/(\d+)\/results$/,
			async ({ user, params, body }) => {
				const partId = Number(params[0])
				const info = db.partInfo(partId)

				if (!info || !db.role(info.gymId, user())) throw new HttpError(404, 'Нет такого комплекса')

				const input = resultInput(await body(), info.kind)

				db.saveResult(partId, user(), withRxLoad(input, info.movements, db.me(user())!.rxWeights))

				return [200, db.leaderboard(partId, info.kind, user())]
			},
		],

		[
			'DELETE',
			/^\/api\/parts\/(\d+)\/results$/,
			({ user, params }) => {
				const partId = Number(params[0])
				const info = db.partInfo(partId)

				if (!info || !db.role(info.gymId, user())) throw new HttpError(404, 'Нет такого комплекса')

				db.deleteResult(partId, user())

				return [200, db.leaderboard(partId, info.kind, user())]
			},
		],
	]

	return async function handle(request: IncomingMessage, response: ServerResponse) {
		const url = new URL(request.url ?? '/', 'http://localhost')

		let reply: Reply

		try {
			const found = routes
				.filter(([method]) => method === request.method)
				.map(([, pattern, handler]) => [url.pathname.match(pattern), handler] as const)
				.find(([match]) => match)

			if (!found) throw new HttpError(404, 'Нет такой ручки')

			const [match, handler] = found
			const header = request.headers.authorization ?? ''

			let userId: number | null | undefined

			reply = await handler({
				request,
				params: match!.slice(1),
				query: url.searchParams,
				user: () => {
					userId ??= header.startsWith('Bearer ') ? db.sessionUser(header.slice(7)) : null

					if (userId === null) throw new HttpError(401, 'Нужно войти заново')

					return userId
				},
				body: () => readJson(request),
			})
		} catch (error) {
			const known = error instanceof HttpError || error instanceof InvalidInput

			if (!known) {
				console.error(error)
				captureException(error)
			}

			const status = error instanceof HttpError ? error.status : known ? 422 : 500

			reply = [status, { error: known ? (error as Error).message : 'Что-то сломалось на сервере' }]
		}

		if (Array.isArray(reply)) {
			response.writeHead(reply[0], {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': 'no-store',
			})

			response.end(JSON.stringify(reply[1]))
		} else {
			response.writeHead(reply.status, {
				'content-type': reply.type,
				'cache-control': 'private, max-age=86400',
				...reply.headers,
			})

			response.end(reply.body)
		}
	}
}

// Тесты собирают приложение сами, сервер поднимается только при запуске файла.
if (import.meta.main) {
	const env = process.env
	const dataDir = env.DATA_DIR || './data'
	const appUrl = env.APP_URL || 'http://localhost:4321'

	if (!env.BOT_TOKEN) throw new Error('BOT_TOKEN не задан')

	const settings: Settings = {
		botToken: env.BOT_TOKEN,
		appUrl,
		dataDir,
		timeZone: env.APP_TIMEZONE || 'Europe/Moscow',
		devLogin: env.NODE_ENV !== 'production' && env.DEV_LOGIN === '1',
	}
	const db = new Db(join(dataDir, 'wodlog.db'))
	const port = Number(env.PORT || 8787)

	createServer(createApp(db, settings)).listen(port, () => console.log(`api: http://localhost:${port}`))

	// Локально бот обычно не нужен: два процесса с одним токеном отбирали бы друг у друга апдейты.
	if (env.BOT_POLLING !== '0') void runBot(botApi(env.BOT_TOKEN), appUrl)
}

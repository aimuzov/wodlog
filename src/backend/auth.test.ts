import assert from 'node:assert/strict'
import { createHash, createHmac } from 'node:crypto'
import { test } from 'node:test'

import { verifyInitData, verifyLoginWidget } from '#backend/auth.ts'
import { signInitData as sign } from '#backend/testing.ts'

const TOKEN = '123:test-token'
const NOW = 1_800_000_000

const checkString = (fields: Record<string, string>) =>
	Object.keys(fields)
		.sort()
		.map((k) => `${k}=${fields[k]}`)
		.join('\n')

const signInitData = (fields: Record<string, string>) => sign(fields, TOKEN)

const user = JSON.stringify({ id: 42, first_name: 'Ann', username: 'ann' })

test('accepts signed initData with the invite start param', () => {
	const login = verifyInitData(signInitData({ auth_date: String(NOW), user, start_param: 'gym_abc' }), TOKEN, NOW)

	assert.equal(login?.user.id, 42)
	assert.equal(login?.startParam, 'gym_abc')
})

test('rejects tampered, foreign or stale initData', () => {
	const signed = signInitData({ auth_date: String(NOW), user })

	assert.equal(verifyInitData(signed.replace('Ann', 'Bob'), TOKEN, NOW), null)
	assert.equal(verifyInitData(signed, 'other:token', NOW), null)
	assert.equal(verifyInitData(signed, TOKEN, NOW + 2 * 24 * 3600), null)
	assert.equal(verifyInitData('', TOKEN, NOW), null)
})

test('accepts a Login Widget payload', () => {
	const fields = { id: '42', first_name: 'Ann', auth_date: String(NOW) }
	const secret = createHash('sha256').update(TOKEN).digest()
	const hash = createHmac('sha256', secret).update(checkString(fields)).digest('hex')

	assert.equal(verifyLoginWidget({ ...fields, id: 42, hash }, TOKEN, NOW)?.id, 42)
	assert.equal(verifyLoginWidget({ ...fields, id: 43, hash }, TOKEN, NOW), null)
	assert.equal(verifyLoginWidget({ ...fields, hash }, TOKEN, NOW + 2 * 24 * 3600), null)
})

test('rejects malformed Mini App dates and keeps the existing future-date policy', () => {
	for (const auth_date of ['', 'bad', '0', '1.2'])
		assert.equal(verifyInitData(signInitData({ auth_date, user }), TOKEN, NOW), null)

	assert.equal(
		verifyInitData(signInitData({ auth_date: String(NOW + 60), user, signature: 'ed25519' }), TOKEN, NOW)?.user.id,
		42,
	)
})

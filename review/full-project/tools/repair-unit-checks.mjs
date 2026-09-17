// Focused, non-network unit checks for repair wave findings 4 (Remember Me) and 5 (card expiry).
// Run from repo root: node review/full-project/tools/repair-unit-checks.mjs
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}

const { default: api, TOKEN_KEY } = await import('../../../src/api/axiosInstance.js')
const { loginUser, verifyToken, storeToken } = await import('../../../src/store/actions/clientActions.js')
const { isCardExpired } = await import('../../../src/utils/validators.js')

let failures = 0
const check = (name, ok, details = '') => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${details ? ` — ${details}` : ''}`)
}
const header = () => api.defaults.headers.common.Authorization
const actions = []
const dispatch = (action) => (typeof action === 'function' ? action(dispatch) : actions.push(action))

// ---- Finding 4: Remember Me ----
api.post = async () => ({ data: { token: 'new-token', name: 'Test', email: 't@example.com', role_id: '3' } })

store.set(TOKEN_KEY, 'old-token')
await dispatch(loginUser({ email: 't@example.com', password: 'x', rememberMe: false }))
check('R4.1 pre-existing token + login rememberMe=false -> localStorage token removed', localStorage.getItem(TOKEN_KEY) === null, `stored=${localStorage.getItem(TOKEN_KEY)}`)
check('R4.2 session axios header still gets the new token', header() === 'new-token')
check('R4.3 header has no Bearer prefix', !String(header()).startsWith('Bearer'))
check('R4.4 user saved without token field', actions.some((a) => a.type === 'client/SET_USER' && a.payload.email === 't@example.com' && !('token' in a.payload)))

store.set(TOKEN_KEY, 'old-token')
storeToken('direct-token', false)
check('R4.5 storeToken(token, false) removes stored token', localStorage.getItem(TOKEN_KEY) === null)

await dispatch(loginUser({ email: 't@example.com', password: 'x', rememberMe: true }))
check('R4.6 login rememberMe=true -> token stored', localStorage.getItem(TOKEN_KEY) === 'new-token')

// T11 regression: verify renews token in storage + header
api.get = async (url) => {
  if (url !== '/verify') throw new Error('unexpected url')
  if (header() !== 'new-token') throw Object.assign(new Error('401'), { response: { status: 401 } })
  return { data: { name: 'Test', email: 't@example.com', role_id: '3', token: 'renewed-token' } }
}
const user = await dispatch(verifyToken())
check('T11.1 verify success renews localStorage token', localStorage.getItem(TOKEN_KEY) === 'renewed-token')
check('T11.2 verify success renews axios header (raw, no Bearer)', header() === 'renewed-token')
check('T11.3 verify success returns user', user?.email === 't@example.com')

store.set(TOKEN_KEY, 'bad-token')
const failed = await dispatch(verifyToken())
check('T11.4 verify failure removes localStorage token', localStorage.getItem(TOKEN_KEY) === null)
check('T11.5 verify failure removes axios header', header() === undefined)
check('T11.6 verify failure returns null', failed === null)

store.delete(TOKEN_KEY)
check('T11.7 no stored token -> no verify, resolves null', (await dispatch(verifyToken())) === null)

// ---- Finding 5: card expiry (fixed "now" values) ----
const sept2026 = new Date(2026, 8, 17)
const jan2026 = new Date(2026, 0, 5)
const cases = [
  ['current year, earlier month (08/2026 in Sep 2026) is expired', isCardExpired(8, 2026, sept2026), true],
  ['current year, current month (09/2026 in Sep 2026) is valid', isCardExpired(9, 2026, sept2026), false],
  ['current year, later month (12/2026) is valid', isCardExpired(12, 2026, sept2026), false],
  ['future year, earlier month (01/2027) is valid', isCardExpired(1, 2027, sept2026), false],
  ['past year (12/2025) is expired', isCardExpired(12, 2025, sept2026), true],
  ['string inputs from <select> ("8", "2026") are expired', isCardExpired('8', '2026', sept2026), true],
  ['January edge: 01/2026 in Jan 2026 is valid', isCardExpired(1, 2026, jan2026), false],
  ['incomplete pair (month missing) is not flagged', isCardExpired('', 2026, sept2026), false],
]
cases.forEach(([name, got, expected]) => check(`R5 ${name}`, got === expected, `got=${got}`))

console.log(failures ? `${failures} FAILED` : 'ALL PASS')
process.exit(failures ? 1 : 0)

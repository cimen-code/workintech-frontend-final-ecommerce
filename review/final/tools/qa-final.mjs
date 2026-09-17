// Final strict repair — focused browser QA against `vite preview` (production build).
// Backend safety: no users/addresses/orders are written. POST /order is intercepted in the browser and answered
// locally (DevTools Fetch domain). One temporary card is created to reach the payment step and deleted again.
// Public T10 test account only; tokens are never printed or saved.
import { mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { launch, sleep } from '../../full-project/tools/cdp.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const API = 'https://workintech-fe-ecommerce.onrender.com'
const OUT = new URL('../screenshots/', import.meta.url).pathname
const EVIDENCE = new URL('../evidence/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
mkdirSync(EVIDENCE, { recursive: true })

const checks = []
const record = (id, name, pass, details = '') => {
  checks.push({ id, name, pass, details })
  console.log(`${pass ? 'PASS' : 'FAIL'} [${id}] ${name}${details ? ` — ${details}` : ''}`)
}

const c = await launch(9360)
const text = () => c.eval('document.body.innerText')
const headerText = () => c.eval('document.querySelector("header").innerText')
const noOverflow = () => c.eval('document.documentElement.scrollWidth <= window.innerWidth')
const brokenImages = () => c.eval('[...document.images].filter(i => i.complete && i.naturalWidth === 0).length')
const countButtons = (label) => c.eval(`[...document.querySelectorAll('button')].filter(b => b.textContent.trim() === ${JSON.stringify(label)}).length`)
const productRequests = () => c.requests.filter((r) => r.method === 'GET' && r.url.startsWith(`${API}/products?`)).map((r) => r.url.replace(API, ''))
const cartCountText = () => c.eval(`(() => { const s = document.querySelector('header button[aria-label="Shopping cart"] span'); return s ? s.textContent : '' })()`)
// client-side navigation (keeps in-memory Redux state such as the cart and a non-remembered session)
const spaGo = async (path, waitMs = 1500) => {
  await c.eval(`window.history.pushState({}, '', ${JSON.stringify(path)}); window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))`)
  await sleep(waitMs)
  await c.waitFor(`!document.querySelector('[role="status"]')`, 60000).catch(() => {})
  await sleep(300)
}
const shotJpg = async (name) => {
  const { data } = await c.send('Page.captureScreenshot', { format: 'png' })
  const png = `${OUT}${name}.png`
  writeFileSync(png, Buffer.from(data, 'base64'))
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '75', png, '--out', `${OUT}${name}.jpg`], { stdio: 'ignore' })
  execFileSync('rm', ['-f', png])
}
const widthsOverflow = async (label) => {
  const result = {}
  for (const width of [414, 768, 1024, 1440]) {
    await c.viewport(width)
    await sleep(500)
    result[width] = (await noOverflow()) && (await brokenImages()) === 0
  }
  record('RESP', `${label}: no horizontal overflow / broken images at 414, 768, 1024, 1440`, Object.values(result).every(Boolean), JSON.stringify(result))
}
const login = async (rememberMe) => {
  await c.goto(`${BASE}/login`, 1500)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', '123456')
  if (rememberMe) await c.eval(`document.querySelector('input[name="rememberMe"]').click()`)
  await c.click('button[type="submit"]')
  await c.waitFor(`location.pathname !== '/login'`, 30000)
  await sleep(1000)
}

// /order interception (answered locally, never reaches the backend)
// POST → {} (no real order). GET → real backend unless `mockOrdersBody` is set (T23 table check on an empty account).
const intercepted = []
let mockOrdersBody = null
// every non-GET request to the API during the whole run (never cleared)
const allApiWrites = []
c.on((msg) => {
  if (msg.method === 'Network.requestWillBeSent') {
    const { method, url } = msg.params.request
    if (url.startsWith(API) && method !== 'GET' && method !== 'OPTIONS') allApiWrites.push(`${method} ${url.replace(API, '')}`)
  }
})
c.on(async (msg) => {
  if (msg.method !== 'Fetch.requestPaused') return
  const { requestId, request } = msg.params
  try {
    if (request.method === 'POST') {
      intercepted.push({ url: request.url, body: request.postData ? JSON.parse(request.postData) : null })
      await c.send('Fetch.fulfillRequest', {
        requestId,
        responseCode: 201,
        responseHeaders: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Access-Control-Allow-Origin', value: new URL(BASE).origin },
        ],
        body: Buffer.from('{}').toString('base64'),
      })
    } else if (mockOrdersBody && request.method === 'GET') {
      await c.send('Fetch.fulfillRequest', {
        requestId,
        responseCode: 200,
        responseHeaders: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Access-Control-Allow-Origin', value: new URL(BASE).origin },
        ],
        body: Buffer.from(JSON.stringify(mockOrdersBody)).toString('base64'),
      })
    } else {
      await c.send('Fetch.continueRequest', { requestId })
    }
  } catch { /* request already gone */ }
})

try {
  // ================= A. public pages =================
  for (const width of [1440, 414]) {
    await c.viewport(width)
    await c.eval('localStorage.clear()').catch(() => {})
    c.requests.length = 0
    await c.goto(`${BASE}/`, 2500)
    const body = await text()
    record('T02', `Home ${width}: no /products request (bestsellers are static)`, productRequests().length === 0, JSON.stringify(productRequests()))
    record('T02', `Home ${width}: 8 static Figma bestseller cards`, (body.match(/Graphic Design/g) || []).length === 8 && (body.match(/\$16\.48/g) || []).length >= 8 && (body.match(/\$6\.48/g) || []).length === 8)
    record('T02', `Home ${width}: no invented slide copy`, !/WINTER 2021|NEW SEASON|\$24\.90/.test(body))
    record('T02', `Home ${width}: no extra SHOP BY CATEGORY block`, !/SHOP BY CATEGORY|Top Categories/i.test(body))
    record('T02', `Home ${width}: one header, one footer, no overflow, no broken images`, (await c.eval('document.querySelectorAll("header").length === 1 && document.querySelectorAll("footer").length === 1')) && (await noOverflow()) && (await brokenImages()) === 0)
    await c.screenshot(`${OUT}home-${width}.png`)
  }

  for (const width of [1440, 414]) {
    await c.viewport(width)
    await c.goto(`${BASE}/team`, 2000)
    const body = await text()
    const names = await c.eval(`(() => { const section = [...document.querySelectorAll('main section')].find(x => x.querySelector('h2')?.textContent.includes('Meet Our Team')); return [...section.querySelectorAll('h5')].map(h => h.textContent.trim()) })()`)
    record('T06', `Team ${width}: only Gökhan Özdemir (Project Manager) and Hakan Çimen (Full Stack Developer)`, JSON.stringify(names) === JSON.stringify(['Gökhan Özdemir', 'Hakan Çimen']) && (body.match(/Project Manager/g) || []).length === 1 && (body.match(/Full Stack Developer/g) || []).length === 1 && !/Teammate|Role pending|Team Member|Workintech Student/.test(body), JSON.stringify(names))
    await c.screenshot(`${OUT}team-${width}.png`)
  }
  await c.viewport(1440)
  await c.goto(`${BASE}/about`, 2000)
  const aboutNames = await c.eval(`[...document.querySelectorAll('main h5')].map(h => h.textContent.trim()).filter(t => /Özdemir|Çimen|Teammate|Username/.test(t))`)
  record('T06', 'About "Meet Our Team" shows the same two people only', JSON.stringify(aboutNames) === JSON.stringify(['Gökhan Özdemir', 'Hakan Çimen']), JSON.stringify(aboutNames))

  for (const width of [1440, 414]) {
    await c.viewport(width)
    await c.goto(`${BASE}/shop`, 2500)
    record('T13', `Shop ${width}: products listed from API`, /Showing 25 of \d+ results/.test(await text()))
    await c.screenshot(`${OUT}shop-${width}.png`)
  }

  // T14 literal behaviour
  await c.viewport(1440)
  await c.goto(`${BASE}/shop/kadin/ayakkabi/2?sort=price:desc`, 2500)
  await c.eval(`(() => { const el = document.querySelector('#shop-filter'); el.dataset.qaMarker = 'same-node'; el.focus(); })()`)
  c.requests.length = 0
  let typed = ''
  for (const ch of 'siyah') {
    typed += ch
    await c.eval(`(() => { const el = document.querySelector('#shop-filter'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${JSON.stringify(typed)}); el.dispatchEvent(new Event('input', { bubbles: true })); })()`)
    await sleep(150)
  }
  await sleep(2500)
  await c.waitFor(`!document.querySelector('[role="status"]')`, 60000).catch(() => {})
  let reqs = productRequests()
  record('T14', 'typing in filter input sends GET on filter state change (no Filter click)', reqs.length >= 1 && reqs[reqs.length - 1].includes('filter=siyah'), `${reqs.length} GETs, last=${reqs[reqs.length - 1]}`)
  record('T14', 'filter request keeps category + sort', reqs[reqs.length - 1]?.includes('category=2') && reqs[reqs.length - 1]?.includes('sort=price%3Adesc'))
  record('T14', 'input keeps focus and is not remounted while typing', await c.eval(`(() => { const el = document.querySelector('#shop-filter'); return el.dataset.qaMarker === 'same-node' && document.activeElement === el && el.value === 'siyah' })()`))
  record('T14', 'filtered results rendered', /Showing \d+ of \d+ results/.test(await text()) && (await c.eval(`location.search`)).includes('filter=siyah'))

  c.requests.length = 0
  await c.fill('#shop-sort', 'price:asc')
  await sleep(1200)
  record('T14', 'selecting a sort option alone does not change the sort state (needs Filter click)', !productRequests().some((u) => u.includes('sort=price%3Aasc')))
  await c.click('text=Filter')
  await sleep(2500)
  reqs = productRequests()
  record('T14', 'Filter click → sort state change → GET keeps category + filter', reqs.some((u) => u.includes('category=2') && u.includes('filter=siyah') && u.includes('sort=price%3Aasc')), reqs[reqs.length - 1])

  c.requests.length = 0
  await c.eval(`(() => { const a = [...document.querySelectorAll('main a[href^="/shop/"]')].find(x => !x.getAttribute('href').includes('/2?') && !x.getAttribute('href').endsWith('/2') && x.querySelector('img') && x.getAttribute('href').split('/').length === 5); a.click(); })()`)
  await sleep(2500)
  reqs = productRequests()
  record('T14', 'category change keeps filter + sort', reqs.some((u) => u.includes('filter=siyah') && u.includes('sort=price%3Aasc') && !u.includes('category=2&')), reqs[0])

  c.requests.length = 0
  await c.eval(`(() => { const el = document.querySelector('#shop-filter'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ''); el.dispatchEvent(new Event('input', { bubbles: true })); })()`)
  await sleep(2500)
  reqs = productRequests()
  record('T14', 'clearing filter sends GET without filter, category + sort kept', reqs.some((u) => !u.includes('filter=') && u.includes('category=') && u.includes('sort=price%3Aasc')), reqs[reqs.length - 1])

  for (const width of [1440, 414]) {
    await c.viewport(width)
    await c.goto(`${BASE}/shop/kadin/ceket/3/gri-regular-astar/322`, 2500)
    record('T16', `Product detail ${width}: real product rendered`, (await text()).includes('Gri Regular Astar'))
    await c.screenshot(`${OUT}product-detail-${width}.png`)
  }

  // T17 no persistence
  await c.viewport(1440)
  await c.click('text=Add to Cart')
  await sleep(500)
  record('T17', 'add to cart updates Redux cart (header count 1)', (await cartCountText()) === '1')
  record('T17', 'cart is not written to localStorage', await c.eval(`localStorage.getItem('cart') === null`))
  await c.goto(`${BASE}/`, 2000)
  record('T17', 'cart is not restored after reload', (await cartCountText()) === '0' && (await c.eval(`localStorage.getItem('cart') === null`)))

  // ================= B. auth =================
  await c.goto(`${BASE}/login`, 1500)
  await c.eval(`localStorage.setItem('token', 'stale-token-seeded-after-load')`)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', '123456')
  await c.click('button[type="submit"]')
  await c.waitFor(`location.pathname !== '/login'`, 30000)
  await sleep(1000)
  record('T10', 'Remember Me off: stale stored token removed, session logged in', (await c.eval(`localStorage.getItem('token') === null`)) && /Cust Omer/.test(await headerText()))
  c.requests.length = 0
  await spaGo('/orders', 2500)
  const ordersReq = c.requests.find((r) => r.method === 'GET' && r.url === `${API}/order`)
  record('T11', 'in-session authorised request uses raw token (no Bearer)', ordersReq?.authorization === '<RAW TOKEN REDACTED>', ordersReq?.authorization)
  await c.goto(`${BASE}/`, 2500)
  record('T10', 'Remember Me off: reload → logged out', !/Cust Omer/.test(await headerText()))

  await login(true)
  record('T10', 'Remember Me on: token stored', await c.eval(`!!localStorage.getItem('token')`))
  c.requests.length = 0
  await c.goto(`${BASE}/`, 3000)
  const verify = c.requests.find((r) => r.method === 'GET' && r.url === `${API}/verify`)
  record('T11', 'reload → GET /verify with raw token (no Bearer) → auto login', verify?.authorization === '<RAW TOKEN REDACTED>' && /Cust Omer/.test(await headerText()), verify?.authorization)

  // ================= C. cart / checkout (in-memory cart → client-side navigation only) =================
  await spaGo('/shop/kadin/ceket/3/gri-regular-astar/322', 2500)
  await c.click('text=Add to Cart')
  await sleep(300)
  await c.click('text=Add to Cart')
  await sleep(300)
  await spaGo('/shop/kadin/tisort/1/siyah-100-pamuk/2', 2500)
  await c.click('text=Add to Cart')
  await sleep(500)
  record('T17', 'cart holds 2 lines / 3 items', (await cartCountText()) === '3')

  await spaGo('/cart', 1000)
  const cartBody = await text()
  record('T19', 'Cart summary shows products total, shipping, discount, grand total', ['Products Total', 'Shipping', 'Discount', 'Grand Total'].every((s) => cartBody.includes(s)))
  record('T19', 'exactly one Create Order action', (await countButtons('Create Order')) === 1, `buttons=${await countButtons('Create Order')}`)
  await widthsOverflow('Cart (logged in, 2 lines)')
  await c.viewport(414)
  await c.screenshot(`${OUT}cart-414.png`)
  await c.viewport(1440)
  await c.screenshot(`${OUT}cart-1440.png`)

  await c.click('text=Create Order')
  await sleep(2000)
  record('T20', 'Create Order navigates to protected /order', (await c.eval('location.pathname')) === '/order')
  await c.waitFor(`document.body.innerText.includes('Add Address')`, 30000)
  await sleep(1500)
  const hasAddress = !(await text()).includes('You have no saved addresses yet.')
  record('T20', 'saved address available on public account (pre-existing; none created)', hasAddress)
  record('T19', 'exactly one summary action on address step', (await countButtons('Save and Continue')) === 1)
  await c.screenshot(`${OUT}checkout-address-1440.png`)
  await c.click('text=Save and Continue')
  await c.waitFor(`document.body.innerText.includes('Add New Card')`, 30000)

  // T21 card expiry (never submitted)
  const now = new Date()
  const year = String(now.getFullYear())
  const nextYear = String(now.getFullYear() + 1)
  const currentMonth = now.getMonth() + 1
  const expired = () => c.eval(`document.body.innerText.includes('Card is expired')`)
  await c.click('text=Add New Card')
  await sleep(400)
  await c.fill('#card-no', '4111111111111111')
  await c.fill('#card-name', 'QA Final Temp')
  if (currentMonth > 1) {
    await c.fill('#card-month', String(currentMonth - 1))
    await c.fill('#card-year', year)
    await sleep(400)
    const flaggedA = await expired()
    c.requests.length = 0
    await c.click('text=Save')
    await sleep(1200)
    const blocked = !c.requests.some((r) => r.method === 'POST' && r.url === `${API}/user/card`)
    await c.fill('#card-month', String(currentMonth))
    await sleep(400)
    const clearedByMonth = !(await expired())
    await c.fill('#card-month', String(currentMonth - 1))
    await sleep(300)
    await c.fill('#card-year', nextYear)
    await sleep(400)
    const clearedByYear = !(await expired())
    await c.fill('#card-year', year)
    await sleep(400)
    const reflagged = await expired()
    record('T21', 'expiry: past month flagged, submit blocked, month or year change re-evaluates', flaggedA && blocked && clearedByMonth && clearedByYear && reflagged, JSON.stringify({ flaggedA, blocked, clearedByMonth, clearedByYear, reflagged }))
  } else {
    record('T21', 'expiry browser case', true, 'skipped in January; covered by unit test')
  }

  // temporary card (deleted below)
  await c.fill('#card-month', '12')
  await c.fill('#card-year', nextYear)
  await sleep(300)
  await c.click('text=Save')
  await c.waitFor(`[...document.querySelectorAll('div.rounded-md.border-2')].some(d => d.innerText.includes('QA Final Temp'))`, 30000)
  await sleep(800)
  await c.eval(`(() => { const box = [...document.querySelectorAll('div.rounded-md.border-2')].find(d => d.innerText.includes('QA Final Temp')); box.querySelector('input[type=radio]').click() })()`)
  await c.fill('#ccv', '123')
  await sleep(300)
  const payBody = await text()
  record('T21', 'no invented 1/3/6 installment choices', !/3 installments|6 installments|installments\s*\$|\/ month/i.test(payBody) && (await c.eval(`document.querySelectorAll('input[name="installment"]').length === 0`)))
  record('T21', 'single payment (Tek Çekim) row with grand total', payBody.includes('Single Payment (Tek Çekim)') && (await c.eval(`document.querySelectorAll('input[name="payment-option"]').length === 1`)))
  record('T19', 'exactly one Complete Order action', (await countButtons('Complete Order')) === 1)
  await widthsOverflow('Checkout payment step')
  await c.viewport(414)
  await c.screenshot(`${OUT}checkout-payment-414.png`)
  await c.viewport(1440)
  await c.screenshot(`${OUT}checkout-payment-1440.png`)

  // T22 with intercepted POST /order
  await c.send('Fetch.enable', { patterns: [{ urlPattern: '*workintech-fe-ecommerce.onrender.com/order*', requestStage: 'Request' }] })
  await c.click('text=Complete Order')
  await c.waitFor(`document.body.innerText.includes('Congratulations')`, 30000).catch(() => {})
  await sleep(800)
  await c.send('Fetch.disable')
  const orderBody = intercepted[0]?.body || {}
  const expectedKeys = ['address_id', 'order_date', 'card_no', 'card_name', 'card_expire_month', 'card_expire_year', 'card_ccv', 'price', 'products']
  record('T22', 'POST /order payload has exactly the task keys (answered locally, not sent to backend)', intercepted.length === 1 && JSON.stringify(Object.keys(orderBody)) === JSON.stringify(expectedKeys), JSON.stringify(Object.keys(orderBody)))
  record('T22', 'payload products shape {product_id, count, detail}', Array.isArray(orderBody.products) && orderBody.products.length === 2 && orderBody.products.every((p) => JSON.stringify(Object.keys(p)) === JSON.stringify(['product_id', 'count', 'detail'])), JSON.stringify((orderBody.products || []).map((p) => [p.product_id, p.count])))
  record('T22', 'success screen congratulates the client', (await text()).includes('Congratulations'))
  await c.screenshot(`${OUT}order-success-1440.png`)
  record('T22', 'cart reset after success (header count 0)', (await cartCountText()) === '0')
  await spaGo('/cart', 800)
  record('T22', 'cart page empty after success', (await text()).includes('Your cart is empty'))

  const removed = await c.eval(`(async () => {
    const h = { Authorization: localStorage.getItem('token') };
    const cards = await fetch('${API}/user/card', { headers: h }).then(r => r.json());
    const temp = cards.filter(x => String(x.name_on_card).startsWith('QA Final Temp'));
    for (const x of temp) await fetch('${API}/user/card/' + x.id, { method: 'DELETE', headers: h });
    const after = await fetch('${API}/user/card', { headers: h }).then(r => r.json());
    return { deleted: temp.map(x => x.id), remaining: after.filter(x => String(x.name_on_card).startsWith('QA Final Temp')).length };
  })()`)
  record('SAFETY', 'temporary card deleted', removed.remaining === 0, JSON.stringify(removed))

  // T23 — live account first (the shared backend was reset since the builder run and currently has 0 orders)
  c.requests.length = 0
  await spaGo('/orders', 3000)
  const liveOrders = await c.eval(`fetch('${API}/order', { headers: { Authorization: localStorage.getItem('token') } }).then(r => r.json()).then(d => d.length)`)
  const liveBody = await text()
  record('T23', 'protected Previous Orders page loads GET /order for the logged-in user', c.requests.some((r) => r.method === 'GET' && r.url === `${API}/order` && r.authorization === '<RAW TOKEN REDACTED>'), `live orders on account: ${liveOrders}`)
  record('T23', 'live response rendered (table when orders exist, empty state otherwise)', liveOrders > 0 ? /#\d+/.test(liveBody) : liveBody.includes('You have not placed any orders yet.'))
  await c.screenshot(`${OUT}orders-live-empty-1440.png`)

  // table + collapsible details with a MOCKED GET /order response in the real response shape
  // (shape captured from the live API during the builder run; products use real /products data)
  const [p322, p2] = await c.eval(`Promise.all([fetch('${API}/products/322').then(r => r.json()), fetch('${API}/products/2').then(r => r.json())])`)
  mockOrdersBody = [{
    id: 9001, user_id: 0, address_id: 3, order_date: '2026-09-17T15:00:00', card_no: '4111111111111111', card_name: 'QA MOCK RESPONSE',
    card_expire_month: 12, card_expire_year: Number(nextYear), price: Number((p322.price * 2 + p2.price + 29.99 - 29.99).toFixed(2)),
    products: [
      { id: p322.id, name: p322.name, description: p322.description, price: p322.price, count: 2, images: p322.images },
      { id: p2.id, name: p2.name, description: p2.description, price: p2.price, count: 1, images: p2.images },
    ],
  }]
  await c.send('Fetch.enable', { patterns: [{ urlPattern: '*workintech-fe-ecommerce.onrender.com/order*', requestStage: 'Request' }] })
  await spaGo('/cart', 500)
  await spaGo('/orders', 2500)
  record('T23', 'data table renders orders (mocked GET /order response, real shape)', /#9001/.test(await text()) && (await c.eval(`!!document.querySelector('main table')`)))
  await c.click('text=Details')
  await sleep(500)
  record('T23', 'collapsible order details show products', (await text()).includes(p322.name) && (await text()).includes(p2.name))
  await widthsOverflow('Previous Orders (details open)')
  await c.viewport(414)
  await shotJpg('orders-mocked-414-viewport')
  await c.viewport(1440)
  await c.screenshot(`${OUT}orders-mocked-1440.png`)
  await c.send('Fetch.disable')
  mockOrdersBody = null

  // logout
  await c.click('header button[aria-expanded]')
  await sleep(300)
  await c.click('text=Logout')
  await sleep(800)
  record('T10', 'logout clears stored token', await c.eval(`localStorage.getItem('token') === null`))
  await c.goto(`${BASE}/orders`, 2000)
  record('T23', 'protected /orders redirects to /login when logged out', (await c.eval('location.pathname')) === '/login')

  const counts = allApiWrites.reduce((acc, w) => ({ ...acc, [w.replace(/\/\d+$/, '/:id')]: (acc[w.replace(/\/\d+$/, '/:id')] || 0) + 1 }), {})
  const allowed = allApiWrites.every((w) => /^POST \/login$|^POST \/user\/card$|^DELETE \/user\/card\/\d+$|^POST \/order$/.test(w))
  record('SAFETY', 'all API writes in the run: only login, 1 temporary card create + delete, POST /order (intercepted locally)', allowed && counts['POST /user/card'] === 1 && counts['DELETE /user/card/:id'] === 1 && (counts['POST /order'] || 0) === intercepted.length, JSON.stringify(counts))
} catch (error) {
  record('SCRIPT', 'final QA script error', false, error.message)
} finally {
  writeFileSync(`${EVIDENCE}qa-final.json`, JSON.stringify({ checks, consoleErrors: c.consoleErrors }, null, 2))
  console.log(`console errors: ${c.consoleErrors.length}${c.consoleErrors.length ? ' ' + JSON.stringify(c.consoleErrors.slice(0, 5)) : ''}`)
  await c.close()
  process.exit(0)
}

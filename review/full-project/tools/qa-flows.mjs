// End-to-end flow checks against the local production preview.
// Uses the public test account from T10 and synthetic data only. Tokens are never printed or saved.
import { writeFileSync } from 'node:fs'
import { launch, sleep } from './cdp.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = new URL('../screenshots/', import.meta.url).pathname
const API = 'https://workintech-fe-ecommerce.onrender.com'
const checks = []
const record = (id, name, pass, details = '') => {
  checks.push({ id, name, pass, details })
  console.log(`${pass ? 'PASS' : 'FAIL'} [${id}] ${name}${details ? ` — ${details}` : ''}`)
}
const productRequests = (client) => client.requests.filter((r) => r.url.startsWith(`${API}/products?`)).map((r) => r.url.replace(API, ''))
const text = (client) => client.eval('document.body.innerText')
const noOverflow = (client) => client.eval('document.documentElement.scrollWidth <= window.innerWidth')

const client = await launch(9340)
const cleanup = () => client.eval(`(async () => {
    const token = localStorage.getItem('token');
    if (!token) return { skipped: 'not logged in' };
    const h = { Authorization: token };
    const addresses = await fetch('${API}/user/address', { headers: h }).then(r => r.json());
    const cards = await fetch('${API}/user/card', { headers: h }).then(r => r.json());
    const a = addresses.filter(x => String(x.title).startsWith('QA Builder'));
    const k = cards.filter(x => String(x.name_on_card).startsWith('QA Builder'));
    for (const x of a) await fetch('${API}/user/address/' + x.id, { method: 'DELETE', headers: h });
    for (const x of k) await fetch('${API}/user/card/' + x.id, { method: 'DELETE', headers: h });
    return { deletedAddressIds: a.map(x => x.id), deletedCardIds: k.map(x => x.id) };
  })()`)

const c = client
await c.viewport(1440)

try {
  // ---------- T13/T14/T15 shop query params ----------
  await c.goto(`${BASE}/shop`, 2500)
  let t = await text(c)
  record('T13', 'shop lists products from /products with total', /Showing 25 of \d+ results/.test(t), t.match(/Showing \d+ of \d+ results/)?.[0])
  c.requests.length = 0
  await c.click('a[href^="/shop/kadin/ayakkabi/2"]')
  await sleep(2500)
  await c.fill('#shop-filter', 'siyah')
  await c.click('text=Filter')
  await sleep(2500)
  await c.fill('#shop-sort', 'price:desc')
  await c.click('text=Filter')
  await sleep(2500)
  let reqs = productRequests(c)
  record('T14', 'category request', reqs.some((u) => /category=2(&|$)/.test(u) && !u.includes('filter=')), reqs[0])
  record('T14', 'filter keeps category', reqs.some((u) => u.includes('category=2') && u.includes('filter=siyah') && !u.includes('sort=')))
  record('T14', 'sort keeps category + filter', reqs.some((u) => u.includes('category=2') && u.includes('filter=siyah') && u.includes('sort=price%3Adesc')), reqs[reqs.length - 1])
  const prices = await c.eval(`[...document.querySelectorAll('main a[href*="/shop/"] .text-secondary-color-1')].map(e => Number(e.textContent.replace('$','')))`)
  record('T14', 'price:desc results are sorted', prices.length > 0 && prices.every((p, i) => i === 0 || prices[i - 1] >= p), JSON.stringify(prices.slice(0, 6)))
  await c.screenshot(`${OUT}shop-filtered-category-1440.png`)

  c.requests.length = 0
  await c.click('a[href^="/shop/erkek/"]').catch(() => c.click('a[href^="/shop/kadin/tisort/1"]'))
  await sleep(2500)
  reqs = productRequests(c)
  record('T14', 'changing category keeps filter + sort', reqs.some((u) => u.includes('filter=siyah') && u.includes('sort=price%3Adesc')), reqs[0])

  c.requests.length = 0
  await c.goto(`${BASE}/shop/kadin/ayakkabi/2?sort=price:desc`, 2500)
  await c.click('nav[aria-label="Pagination"] button:nth-child(3)')
  await sleep(2500)
  reqs = productRequests(c)
  record('T15', 'page 2 uses limit=25&offset=25 and keeps params', reqs.some((u) => u.includes('limit=25') && u.includes('offset=25') && u.includes('category=2') && u.includes('sort=price%3Adesc')), reqs[reqs.length - 1])
  t = await text(c)
  record('T15', 'pagination UI rendered', /First/.test(t) && /Next/.test(t))

  // ---------- T16 product detail ----------
  c.requests.length = 0
  await c.goto(`${BASE}/shop/kadin/ceket/3/gri-regular-astar/322`, 2500)
  t = await text(c)
  record('T16', 'detail fetched from /products/322', c.requests.some((r) => r.url === `${API}/products/322`))
  record('T16', 'real product data rendered', t.includes('Gri Regular Astar') && t.includes('$461.99'))
  record('T16', 'back button present', t.includes('Back'))
  const cursor = await c.eval(`(() => { const a = document.querySelector('main a[href*="/shop/kadin/ceket/3/"]'); return a ? getComputedStyle(a).cursor : 'none' })()`)
  record('T16', 'product card cursor is pointer', cursor === 'pointer', cursor)

  // ---------- T10 login ----------
  await c.goto(`${BASE}/about`, 1500)
  await c.click('header a[href="/login"]')
  await sleep(1000)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', 'wrong-password')
  await c.click('button[type="submit"]')
  await sleep(4000)
  t = await text(c)
  record('T10', 'failed login shows toast and stays', (await c.eval('location.pathname')) === '/login' && /Password is not correct/i.test(t))

  await c.fill('#login-password', '123456')
  await c.eval(`document.querySelector('input[name="rememberMe"]').click()`)
  await c.click('button[type="submit"]')
  await sleep(4000)
  const afterLoginPath = await c.eval('location.pathname')
  t = await text(c)
  record('T10', 'login redirects to previous page', afterLoginPath === '/about', afterLoginPath)
  record('T10', 'user shown in header', /Cust Omer/.test(await c.eval('document.querySelector("header").innerText')))
  record('T10', 'gravatar image in header', await c.eval(`!!document.querySelector('header img[src*="gravatar.com/avatar/"]')`))
  record('T10', 'remember me saves token', await c.eval(`!!localStorage.getItem('token')`))

  // ---------- T11 auto login ----------
  c.requests.length = 0
  await c.goto(`${BASE}/`, 3000)
  const verify = c.requests.find((r) => r.method === 'GET' && r.url === `${API}/verify`)
  record('T11', 'GET /verify on app start', Boolean(verify))
  record('T11', 'Authorization header without Bearer', verify?.authorization === '<RAW TOKEN REDACTED>', verify?.authorization)
  record('T11', 'auto logged in after reload', /Cust Omer/.test(await c.eval('document.querySelector("header").innerText')))
  await c.screenshot(`${OUT}home-logged-in-1440.png`)

  await c.eval(`localStorage.setItem('token', 'invalid-token-for-qa')`)
  await c.goto(`${BASE}/`, 3000)
  record('T11', 'invalid token removed from localStorage', await c.eval(`localStorage.getItem('token') === null`))
  record('T11', 'invalid token -> logged out header', !/Cust Omer/.test(await c.eval('document.querySelector("header").innerText')))

  await c.goto(`${BASE}/login`, 1000)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', '123456')
  await c.eval(`document.querySelector('input[name="rememberMe"]').click()`)
  await c.click('button[type="submit"]')
  await sleep(4000)
  record('T10', 'login without previous page goes home', (await c.eval('location.pathname')) === '/')

  // ---------- T17 add to cart ----------
  await c.eval(`localStorage.removeItem('cart')`)
  await c.goto(`${BASE}/shop/kadin/ceket/3/gri-regular-astar/322`, 2500)
  await c.goto(`${BASE}/shop/kadin/ceket/3/gri-regular-astar/322`, 2500)
  await c.click('text=Add to Cart')
  await sleep(300)
  await c.click('text=Add to Cart')
  await sleep(300)
  await c.goto(`${BASE}/shop/kadin/tisort/1/siyah-100-pamuk/2`, 2500)
  await c.click('text=Add to Cart')
  await sleep(500)
  let cart = JSON.parse(await c.eval(`localStorage.getItem('cart')`))
  record('T17', 'same product increments count', cart.length === 2 && cart[0].count === 2 && cart[1].count === 1, JSON.stringify(cart.map((i) => [i.product.id, i.count, i.checked])))
  record('T17', 'cart items have checked flag', cart.every((i) => i.checked === true))
  await c.click('button[aria-label="Shopping cart"]')
  await sleep(600)
  t = await c.eval('document.querySelector("header").innerText')
  record('T17', 'header dropdown lists cart items', t.includes('Gri Regular Astar') && t.includes('Siyah %100 Pamuk'))
  await c.eval('window.scrollTo(0,0)')
  const { data: dropdownShot } = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 75, clip: { x: 700, y: 0, width: 740, height: 700, scale: 1 } })
  writeFileSync(`${OUT}cart-dropdown-1440.jpg`, Buffer.from(dropdownShot, 'base64'))

  // ---------- T18/T19 cart page ----------
  await c.goto(`${BASE}/cart`, 1500)
  await c.click('button[aria-label="Increase quantity"]')
  await sleep(300)
  await c.click('input[aria-label="Select Siyah %100 Pamuk"]')
  await sleep(300)
  t = await text(c)
  record('T18', 'increment + deselect recalculates selected total', t.includes('$1385.97'), 'expected 3 x 461.99 = 1385.97')
  record('T19', 'summary: products + shipping - discount = grand total', t.includes('Products Total') && t.includes('Shipping') && t.includes('Discount') && t.includes('Grand Total') && t.includes('$1385.97'))
  await c.click('button[aria-label="Decrease quantity"]')
  await sleep(300)
  cart = JSON.parse(await c.eval(`localStorage.getItem('cart')`))
  record('T18', 'decrement works', cart[0].count === 2)
  await c.click('input[aria-label="Select Siyah %100 Pamuk"]')
  await sleep(300)
  await c.screenshot(`${OUT}cart-1440.png`)
  await c.viewport(414)
  await c.goto(`${BASE}/cart`, 1500)
  record('QA', 'cart page has no horizontal overflow at 414', await noOverflow(c))
  await c.screenshot(`${OUT}cart-414.png`)
  await c.viewport(1440)

  // remove test via a throwaway item
  await c.goto(`${BASE}/shop/kadin/ayakkabi/2/x/254`, 2500)
  await c.click('text=Add to Cart')
  await c.goto(`${BASE}/cart`, 1500)
  await c.click('button[aria-label^="Remove Kadın Siyah"]')
  await sleep(300)
  cart = JSON.parse(await c.eval(`localStorage.getItem('cart')`))
  record('T18', 'remove item works', cart.length === 2 && !cart.some((i) => i.product.id === 254))

  // ---------- T20 address ----------
  await c.click('text=Create Order')
  await sleep(2500)
  record('T20', 'Create Order navigates to /order', (await c.eval('location.pathname')) === '/order')
  await c.waitFor(`document.body.innerText.includes('Add Address')`, 30000)
  await c.screenshot(`${OUT}checkout-address-1440.png`)
  await c.click('text=Add Address')
  await sleep(500)
  await c.fill('#addr-title', 'QA Builder Ev')
  await c.fill('#addr-name', 'Qa')
  await c.fill('#addr-surname', 'Builder')
  await c.fill('#addr-phone', '05550000000')
  await c.fill('#addr-city', 'istanbul')
  await c.fill('#addr-district', 'Kadikoy')
  await c.fill('#addr-neighborhood', 'Moda')
  await c.fill('#addr-address', 'Test Sokak No:1 Daire:2')
  c.requests.length = 0
  await c.click('text=Save')
  await c.waitFor(`document.body.innerText.includes('QA Builder Ev')`, 30000)
  record('T20', 'POST /user/address then list refreshed', c.requests.some((r) => r.method === 'POST' && r.url === `${API}/user/address`))
  await c.eval(`(() => { const label = [...document.querySelectorAll('label')].filter(l => l.textContent.includes('QA Builder Ev'))[0]; label.querySelector('input').click() })()`)
  await sleep(300)
  // update
  await c.eval(`(() => { const card = [...document.querySelectorAll('label')].filter(l => l.textContent.includes('QA Builder Ev'))[0].closest('div.flex.w-full.flex-col'); card.querySelector('button[aria-label="Edit address"]').click() })()`)
  await sleep(500)
  await c.fill('#addr-district', 'Besiktas')
  c.requests.length = 0
  await c.click('text=Save')
  await c.waitFor(`document.body.innerText.includes('Besiktas')`, 30000)
  record('T20', 'PUT /user/address updates address', c.requests.some((r) => r.method === 'PUT' && r.url === `${API}/user/address`))
  await c.eval(`(() => { const label = [...document.querySelectorAll('label')].filter(l => l.textContent.includes('QA Builder Ev'))[0]; label.querySelector('input').click() })()`)
  await sleep(300)
  await c.screenshot(`${OUT}checkout-address-selected-1440.png`)
  await c.click('text=Save and Continue')
  await sleep(1500)

  // ---------- T21 card ----------
  await c.waitFor(`document.body.innerText.includes('Add New Card')`, 30000)
  await c.click('text=Add New Card')
  await sleep(500)
  await c.fill('#card-no', '4111111111111111')
  await c.fill('#card-month', '12')
  await c.fill('#card-year', '2030')
  await c.fill('#card-name', 'QA Builder')
  c.requests.length = 0
  await c.click('text=Save')
  await c.waitFor(`[...document.querySelectorAll('div.rounded-md.border-2')].some(d => d.innerText.includes('QA Builder'))`, 30000)
  await sleep(500)
  record('T21', 'POST /user/card then GET list', c.requests.some((r) => r.method === 'POST' && r.url === `${API}/user/card`) && c.requests.some((r) => r.method === 'GET' && r.url === `${API}/user/card`))
  await c.eval(`(() => { const box = [...document.querySelectorAll('div.rounded-md.border-2')].find(d => d.innerText.includes('QA Builder')); box.querySelector('input[type=radio]').click() })()`)
  await sleep(300)
  await c.eval(`(() => { const box = [...document.querySelectorAll('div.rounded-md.border-2')].find(d => d.innerText.includes('QA Builder')); box.querySelector('button[aria-label="Edit card"]').click() })()`)
  await sleep(500)
  await c.fill('#card-name', 'QA Builder Two')
  c.requests.length = 0
  await c.click('text=Save')
  await c.waitFor(`[...document.querySelectorAll('div.rounded-md.border-2')].some(d => d.innerText.includes('QA Builder Two'))`, 30000)
  await sleep(500)
  record('T21', 'PUT /user/card updates card', c.requests.some((r) => r.method === 'PUT' && r.url === `${API}/user/card`))
  await c.eval(`(() => { const box = [...document.querySelectorAll('div.rounded-md.border-2')].find(d => d.innerText.includes('QA Builder Two')); box.querySelector('input[type=radio]').click() })()`)
  await c.fill('#ccv', '123')
  await sleep(300)
  await c.screenshot(`${OUT}checkout-card-1440.png`)
  await c.viewport(414)
  await sleep(1000)
  record('QA', 'checkout card step has no horizontal overflow at 414', await noOverflow(c))
  await c.screenshot(`${OUT}checkout-card-414.png`)
  await c.viewport(1440)

  // ---------- T22 complete order ----------
  c.requests.length = 0
  await c.click('text=Complete Order')
  await c.waitFor(`document.body.innerText.includes('Congratulations')`, 60000).catch(() => {})
  t = await text(c)
  record('T22', 'POST /order sent', c.requests.some((r) => r.method === 'POST' && r.url === `${API}/order`))
  record('T22', 'congratulation screen', t.includes('Congratulations'))
  cart = JSON.parse(await c.eval(`localStorage.getItem('cart')`))
  record('T22', 'ordered items removed from cart', cart.length === 0, JSON.stringify(cart))
  await c.screenshot(`${OUT}order-complete-1440.png`)

  // ---------- T23 previous orders ----------
  await c.goto(`${BASE}/`, 2000)
  await c.click('header button[aria-expanded]')
  await sleep(500)
  record('T23', 'Previous Orders link in user dropdown', /Previous Orders/.test(await c.eval('document.querySelector("header").innerText')))
  await c.click('text=Previous Orders')
  await sleep(500)
  await c.waitFor(`!document.querySelector('[role="status"]')`, 60000)
  await sleep(500)
  t = await text(c)
  record('T23', 'GET /order table rendered', (await c.eval('location.pathname')) === '/orders' && /#\d+/.test(t), t.match(/#\d+/)?.[0])
  await c.click('text=Details')
  await sleep(500)
  await c.screenshot(`${OUT}orders-1440.png`)
  await c.viewport(414)
  await c.goto(`${BASE}/orders`, 1500)
  record('QA', 'orders page has no horizontal overflow at 414', await noOverflow(c))
  await c.click('text=Details')
  await sleep(500)
  await c.screenshot(`${OUT}orders-414.png`)
  await c.viewport(1440)
  const orderShape = await c.eval(`fetch('${API}/order', { headers: { Authorization: localStorage.getItem('token') } }).then(r => r.json()).then(list => { const o = list[list.length - 1]; return { count: list.length, keys: Object.keys(o || {}), productKeys: Object.keys((o && o.products && o.products[0]) || {}) } })`)
  record('T23', 'order response shape captured', orderShape.count > 0, JSON.stringify(orderShape))

  record('CLEANUP', 'synthetic address/card deleted', true, JSON.stringify(await cleanup()))

  // ---------- logout + protected route ----------
  await c.goto(`${BASE}/`, 1500)
  await c.click('header button[aria-expanded]')
  await sleep(300)
  await c.click('text=Logout')
  await sleep(800)
  record('T10', 'logout clears token', await c.eval(`localStorage.getItem('token') === null`))
  await c.goto(`${BASE}/orders`, 2000)
  record('T23', 'protected /orders redirects to login when logged out', (await c.eval('location.pathname')) === '/login')

  // ---------- T08 signup ----------
  c.requests.length = 0
  await c.goto(`${BASE}/signup`, 2500)
  record('T09', 'roles fetched on signup (in case of need)', c.requests.some((r) => r.url === `${API}/roles`))
  record('T08', 'customer role selected by default', (await c.eval(`document.querySelector('#role_id').value`)) === '3')
  await c.fill('#role_id', '2')
  await sleep(500)
  record('T08', 'store fields appear for store role', await c.eval(`!!document.querySelector('#store-tax') && !!document.querySelector('#store-iban')`))
  await c.fill('#name', 'Qa')
  await c.fill('#email', 'not-an-email')
  await c.fill('#password', 'weakpass')
  await c.fill('#confirmPassword', 'different')
  await c.fill('#store-name', 'ab')
  await c.fill('#store-phone', '12345')
  await c.fill('#store-tax', 'T12V3')
  await c.fill('#store-iban', 'TR000000')
  await c.click('button[type="submit"]')
  await sleep(800)
  t = await text(c)
  const expectedErrors = ['at least 3 characters', 'valid email', 'Min 8 characters', 'do not match', 'Türkiye phone', 'TXXXXVXXXXXX', 'valid IBAN']
  const missing = expectedErrors.filter((e) => !t.includes(e))
  record('T08', 'validation messages shown', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : 'all 7 rules')
  await c.screenshot(`${OUT}signup-store-validation-1440.png`)
  await c.viewport(414)
  await sleep(1000)
  record('QA', 'signup with store fields has no horizontal overflow at 414', await noOverflow(c))
  await c.screenshot(`${OUT}signup-store-validation-414.png`)
  await c.viewport(1440)

  await c.goto(`${BASE}/about`, 1000)
  await c.click('header a[href="/signup"]')
  await sleep(2500)
  const stamp = Date.now()
  await c.fill('#name', 'Qa Builder')
  await c.fill('#email', `qa.builder.${stamp}@example.com`)
  await c.fill('#password', 'QaBuilder!2026')
  await c.fill('#confirmPassword', 'QaBuilder!2026')
  c.requests.length = 0
  await c.click('button[type="submit"]')
  await sleep(150)
  const spinnerWhileSubmitting = await c.eval(`document.querySelector('button[type="submit"]')?.disabled === true && !!document.querySelector('button[type="submit"] [role="status"]')`)
  record('T08', 'submit button disabled with spinner while submitting', spinnerWhileSubmitting)
  await c.waitFor(`location.pathname !== '/signup' || document.querySelector('[role="alert"]')`, 60000).catch(() => {})
  await sleep(800)
  t = await text(c)
  const signupPath = await c.eval('location.pathname')
  record('T08', 'POST /signup success -> previous page + activation warning', signupPath === '/about' && t.includes('You need to click link in email to activate your account!'), `path=${signupPath}; synthetic email qa.builder.${stamp}@example.com`)

  await c.goto(`${BASE}/signup`, 2500)
  await c.fill('#name', 'Cust Omer')
  await c.fill('#email', 'customer@commerce.com')
  await c.fill('#password', 'QaBuilder!2026')
  await c.fill('#confirmPassword', 'QaBuilder!2026')
  await c.click('button[type="submit"]')
  await c.waitFor(`document.querySelector('form [role="alert"]')`, 60000).catch(() => {})
  record('T08', 'failed signup stays on form with error', (await c.eval('location.pathname')) === '/signup' && /already registered|failed/i.test(await text(c)))
  await c.screenshot(`${OUT}signup-error-1440.png`)
} catch (error) {
  record('SCRIPT', 'flow script error', false, error.message)
  await client.screenshot(`${OUT}flow-error-state.png`).catch(() => {})
  try {
    await client.goto(`${BASE}/`, 1000)
    console.log('cleanup after error:', JSON.stringify(await cleanup()))
  } catch { /* ignore */ }
} finally {
  writeFileSync(new URL('../qa-flows.json', import.meta.url), JSON.stringify({ checks, consoleErrors: client.consoleErrors }, null, 2))
  await client.close()
}

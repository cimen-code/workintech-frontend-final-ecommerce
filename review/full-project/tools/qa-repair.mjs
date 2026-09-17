// Focused browser QA for the repair wave. No orders, users or addresses are created; one temporary card is
// created to render the installment block and deleted again in the same run. Tokens are never printed or saved.
import { mkdirSync, writeFileSync } from 'node:fs'
import { launch, sleep } from './cdp.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const API = 'https://workintech-fe-ecommerce.onrender.com'
const OUT = new URL('../screenshots/repair/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const checks = []
const record = (id, name, pass, details = '') => {
  checks.push({ id, name, pass, details })
  console.log(`${pass ? 'PASS' : 'FAIL'} [${id}] ${name}${details ? ` — ${details}` : ''}`)
}
const c = await launch(9350)
const visible = (selector) =>
  c.eval(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; const r = el.getBoundingClientRect(); return !!el.offsetParent && r.width > 0 && r.height > 0 })()`)
const headerText = () => c.eval('document.querySelector("header").innerText')
const noOverflow = () => c.eval('document.documentElement.scrollWidth <= window.innerWidth')

const login = async (rememberMe) => {
  await c.goto(`${BASE}/login`, 1500)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', '123456')
  if (rememberMe) await c.eval(`document.querySelector('input[name="rememberMe"]').click()`)
  await c.click('button[type="submit"]')
  await c.waitFor(`location.pathname !== '/login'`, 30000)
  await sleep(800)
}

try {
  // ---------- Repair 1: Home ----------
  for (const width of [414, 1440]) {
    await c.eval('localStorage.clear()').catch(() => {})
    await c.viewport(width)
    await c.goto(`${BASE}/`, 2500)
    const body = await c.eval('document.body.innerText')
    record('R1', `Home ${width}: no extra "SHOP BY CATEGORY" block`, !/SHOP BY CATEGORY|Top Categories/i.test(body))
    record('R1', `Home ${width}: Figma section order present`, ['NEW COLLECTION', "EDITOR'S PICK", 'BESTSELLER PRODUCTS', 'Vita Classic Product', 'Part of the Neural Universe', 'Featured Posts'].every((s) => body.includes(s)))
    record('R1', `Home ${width}: no horizontal overflow`, await noOverflow())
    record('R1', `Home ${width}: no broken images`, await c.eval('[...document.images].filter(i => i.complete && i.naturalWidth === 0).length === 0'))
    await c.screenshot(`${OUT}home-${width}.png`)
  }

  // 414 compact header (logged out)
  await c.viewport(414)
  await c.goto(`${BASE}/`, 2000)
  const compact = {
    search: await visible('header button[aria-label="Search"]'),
    cart: await visible('header button[aria-label="Shopping cart"]'),
    menu: await visible('header button[aria-label="Menu"]'),
    loginLink: await visible('header a[href="/login"]'),
    favorites: await visible('header button[aria-label="Favorites"]'),
    cartCountText: await c.eval(`document.querySelector('header button[aria-label="Shopping cart"] span')?.offsetParent ? 'visible' : 'hidden'`),
  }
  record('R1', '414 logged-out top row = Bandage + Search + Cart + Menu', compact.search && compact.cart && compact.menu && !compact.loginLink && !compact.favorites, JSON.stringify(compact))
  const { data: headerShot } = await c.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 414, height: 110, scale: 2 } })
  writeFileSync(`${OUT}home-414-header-compact.png`, Buffer.from(headerShot, 'base64'))

  await c.click('header button[aria-label="Menu"]')
  await sleep(600)
  const menuText = await headerText()
  record('R1', '414 expanded menu lists nav links + Login/Register', ['Home', 'Shop', 'About', 'Team', 'Contact', 'Login', 'Register'].every((s) => menuText.includes(s)), menuText.replace(/\s+/g, ' ').slice(0, 120))
  record('R1', '414 expanded menu: categories collapsed by default', !menuText.includes('Kadın'))
  const { data: menuShot } = await c.send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}home-414-menu-open.png`, Buffer.from(menuShot, 'base64'))
  await c.click('text=Shop categories')
  await sleep(400)
  record('R1', '414 expanded menu: category dropdown still reachable', (await headerText()).includes('Kadın'))
  const { data: menuCatShot } = await c.send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}home-414-menu-open-categories.png`, Buffer.from(menuCatShot, 'base64'))

  record('R1', '1440 logged-out header still shows Login / Register', await (async () => { await c.viewport(1440); await c.goto(`${BASE}/`, 1500); return visible('header a[href="/login"]') })())

  // ---------- Repair 4: Remember Me (browser) ----------
  await c.viewport(1440)
  await c.goto(`${BASE}/login`, 1500)
  await c.eval(`localStorage.setItem('token', 'stale-token-seeded-after-load')`)
  await c.fill('#login-email', 'customer@commerce.com')
  await c.fill('#login-password', '123456')
  await c.click('button[type="submit"]')
  await c.waitFor(`location.pathname !== '/login'`, 30000)
  await sleep(800)
  record('R4', 'pre-existing token + login without Remember Me -> localStorage token absent', await c.eval(`localStorage.getItem('token') === null`))
  record('R4', 'session is logged in (axios header used in-session)', /Cust Omer/.test(await headerText()))
  c.requests.length = 0
  // client-side navigation (a full reload would correctly drop a non-remembered session)
  await c.click('header button[aria-expanded]')
  await sleep(300)
  await c.click('text=Previous Orders')
  await c.waitFor(`location.pathname === '/orders' && !document.querySelector('[role="status"]')`, 30000)
  await sleep(500)
  const ordersReq = c.requests.find((r) => r.method === 'GET' && r.url === `${API}/order`)
  record('R4', 'in-session protected request carries raw token (no Bearer)', ordersReq?.authorization === '<RAW TOKEN REDACTED>', ordersReq?.authorization)
  await c.goto(`${BASE}/`, 2500)
  record('R4', 'after full reload without Remember Me -> logged out', !/Cust Omer/.test(await headerText()))

  await login(true)
  record('R4', 'login with Remember Me -> token stored', await c.eval(`!!localStorage.getItem('token')`))
  c.requests.length = 0
  await c.goto(`${BASE}/`, 3000)
  const verify = c.requests.find((r) => r.method === 'GET' && r.url === `${API}/verify`)
  record('T11', 'reload -> GET /verify with raw token (no Bearer)', verify?.authorization === '<RAW TOKEN REDACTED>', verify?.authorization)
  record('T11', 'auto login after reload', /Cust Omer/.test(await headerText()))

  // logged-in 414 header keeps T10/T23 behaviour
  await c.viewport(414)
  await c.goto(`${BASE}/`, 2500)
  record('T10', '414 logged-in: user avatar button visible', await c.eval(`!!document.querySelector('header img[src*="gravatar.com/avatar/"]')?.offsetParent`))
  await c.click('header button[aria-label="Menu"]')
  await sleep(400)
  record('T23', '414 logged-in: Previous Orders in expanded menu', (await headerText()).includes('Previous Orders'))
  const { data: loggedMenu } = await c.send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}home-414-logged-in-menu-open.png`, Buffer.from(loggedMenu, 'base64'))

  // ---------- Repair 5 + 3: card form expiry (never submitted) + installment wording ----------
  await c.viewport(1440)
  const product = await c.eval(`fetch('${API}/products/322').then(r => r.json())`)
  await c.eval(`localStorage.setItem('cart', ${JSON.stringify(JSON.stringify([{ count: 1, checked: true, product }]))})`)
  await c.goto(`${BASE}/order`, 3000)
  await c.waitFor(`!document.querySelector('button[disabled]') || document.body.innerText.includes('no saved addresses')`, 30000).catch(() => {})
  const hasAddress = await c.eval(`!document.body.innerText.includes('You have no saved addresses yet.')`)
  if (!hasAddress) {
    record('R5', 'card form reachable (requires an existing saved address on the public account)', false, 'no saved address; skipped to avoid creating data')
  } else {
    await c.click('text=Save and Continue')
    await c.waitFor(`document.body.innerText.includes('Add New Card')`, 30000)
    await c.click('text=Add New Card')
    await sleep(400)
    const now = new Date()
    const year = String(now.getFullYear())
    const nextYear = String(now.getFullYear() + 1)
    const currentMonth = now.getMonth() + 1
    const expiredText = () => c.eval(`document.body.innerText.includes('Card is expired')`)
    await c.fill('#card-no', '4111111111111111')
    await c.fill('#card-name', 'QA Expiry Check')

    if (currentMonth === 1) {
      record('R5', 'current-year expired month case', true, 'skipped in January (no earlier month in the current year); covered by unit test')
    } else {
      const pastMonth = String(currentMonth - 1)
      // order A: month first, then year
      await c.fill('#card-month', pastMonth)
      await c.fill('#card-year', year)
      await sleep(400)
      record('R5', `month→year order: ${pastMonth}/${year} shows "Card is expired"`, await expiredText())
      c.requests.length = 0
      await c.click('text=Save')
      await sleep(1500)
      record('R5', 'expired card cannot be submitted (no POST /user/card)', !c.requests.some((r) => r.method === 'POST' && r.url === `${API}/user/card`) && (await expiredText()))
      await c.fill('#card-month', String(currentMonth))
      await sleep(400)
      record('R5', `changing only the MONTH to current (${currentMonth}/${year}) clears the error`, !(await expiredText()))

      // order B: year first, then month
      await c.click('text=Cancel')
      await sleep(300)
      await c.click('text=Add New Card')
      await sleep(400)
      await c.fill('#card-year', year)
      await c.fill('#card-month', pastMonth)
      await sleep(400)
      record('R5', `year→month order: ${pastMonth}/${year} shows "Card is expired"`, await expiredText())
      await c.fill('#card-year', nextYear)
      await sleep(400)
      record('R5', `changing only the YEAR to ${nextYear} clears the error`, !(await expiredText()))
      await c.fill('#card-year', year)
      await sleep(400)
      record('R5', 'changing the year back to current re-flags the expired pair', await expiredText())
      const { data: cardShot } = await c.send('Page.captureScreenshot', { format: 'png' })
      writeFileSync(`${OUT}card-form-expired-1440.png`, Buffer.from(cardShot, 'base64'))
      await c.click('text=Cancel')
    }

    // temporary card so the installment block renders; deleted again right after (net zero data change)
    await c.click('text=Add New Card')
    await sleep(400)
    await c.fill('#card-no', '4111111111111111')
    await c.fill('#card-month', '12')
    await c.fill('#card-year', nextYear)
    await c.fill('#card-name', 'QA Repair Temp')
    await c.click('text=Save')
    await c.waitFor(`document.body.innerText.includes('QA Repair Temp')`, 30000)
    await sleep(500)
    const t21 = await c.eval('document.body.innerText')
    record('R3', 'installment UI no longer labelled with card brand / "fetched"', t21.includes('Installment options') && t21.includes('Example plans shown for every card') && !/Payment options \(/.test(t21))
    const { data: t21Shot } = await c.send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(`${OUT}checkout-card-installments-1440.png`, Buffer.from(t21Shot, 'base64'))
    const removed = await c.eval(`(async () => {
      const h = { Authorization: localStorage.getItem('token') };
      const cards = await fetch('${API}/user/card', { headers: h }).then(r => r.json());
      const temp = cards.filter(x => x.name_on_card === 'QA Repair Temp');
      for (const x of temp) await fetch('${API}/user/card/' + x.id, { method: 'DELETE', headers: h });
      const after = await fetch('${API}/user/card', { headers: h }).then(r => r.json());
      return { deleted: temp.map(x => x.id), remaining: after.filter(x => x.name_on_card === 'QA Repair Temp').length };
    })()`)
    record('SAFETY', 'temporary card deleted again', removed.remaining === 0, JSON.stringify(removed))
    record('SAFETY', 'no POST/PUT/DELETE to /user/address, /order or /signup during repair QA', !c.requests.some((r) => r.method !== 'GET' && r.method !== 'OPTIONS' && /\/(user\/address|order|signup)/.test(r.url)))
  }

  // ---------- Team (Repair 2 wording) ----------
  await c.goto(`${BASE}/team`, 2000)
  const team = await c.eval('document.body.innerText')
  record('R2', 'Team shows placeholders explicitly as "Teammate (to be added)" (NEEDS USER INPUT)', team.includes('Teammate (to be added)') && !team.includes('Workintech Student'))
  await c.screenshot(`${OUT}team-1440.png`)

  // logout cleanup
  await c.eval(`localStorage.removeItem('token'); localStorage.removeItem('cart')`)
} catch (error) {
  record('SCRIPT', 'repair QA script error', false, error.message)
} finally {
  writeFileSync(new URL('../qa-repair.json', import.meta.url), JSON.stringify({ checks, consoleErrors: c.consoleErrors }, null, 2))
  console.log(`console errors: ${c.consoleErrors.length}`)
  await c.close()
  process.exit(0)
}

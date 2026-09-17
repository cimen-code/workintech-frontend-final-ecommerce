// T15 re-check after the T14 query-handler change (read-only, no login).
import { writeFileSync } from 'node:fs'
import { launch, sleep } from '../../full-project/tools/cdp.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const API = 'https://workintech-fe-ecommerce.onrender.com'
const checks = []
const record = (id, name, pass, details = '') => {
  checks.push({ id, name, pass, details })
  console.log(`${pass ? 'PASS' : 'FAIL'} [${id}] ${name}${details ? ` — ${details}` : ''}`)
}
const c = await launch(9370)
const productRequests = () => c.requests.filter((r) => r.method === 'GET' && r.url.startsWith(`${API}/products?`)).map((r) => r.url.replace(API, ''))

try {
  await c.viewport(1440)
  await c.goto(`${BASE}/shop/kadin/ayakkabi/2?sort=price:desc`, 2500)
  c.requests.length = 0
  await c.click('nav[aria-label="Pagination"] button:nth-child(3)')
  await sleep(2500)
  let reqs = productRequests()
  record('T15', 'page 2 → limit=25&offset=25 keeping category + sort', reqs.some((u) => u.includes('category=2') && u.includes('sort=price%3Adesc') && u.includes('limit=25') && u.includes('offset=25')), reqs[reqs.length - 1])
  record('T15', 'URL holds page=2 and the active page button is 2', (await c.eval('location.search')).includes('page=2') && (await c.eval(`document.querySelector('nav[aria-label="Pagination"] [aria-current="page"]')?.textContent`)) === '2')

  c.requests.length = 0
  await c.eval(`(() => { const el = document.querySelector('#shop-filter'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'siyah'); el.dispatchEvent(new Event('input', { bubbles: true })); })()`)
  await sleep(2500)
  reqs = productRequests()
  record('T15', 'filter change returns to first page (offset=0) keeping category + sort', reqs.some((u) => u.includes('filter=siyah') && u.includes('offset=0') && u.includes('category=2') && u.includes('sort=price%3Adesc')), reqs[reqs.length - 1])

  c.requests.length = 0
  await c.goto(`${BASE}/shop?page=3`, 2500)
  reqs = productRequests()
  record('T15', 'direct URL page=3 → offset=50', reqs.some((u) => u.includes('limit=25') && u.includes('offset=50')), reqs[reqs.length - 1])
} catch (error) {
  record('SCRIPT', 'pagination QA script error', false, error.message)
} finally {
  writeFileSync(new URL('../evidence/qa-final-pagination.json', import.meta.url), JSON.stringify({ checks, consoleErrors: c.consoleErrors }, null, 2))
  console.log(`console errors: ${c.consoleErrors.length}`)
  await c.close()
  process.exit(0)
}

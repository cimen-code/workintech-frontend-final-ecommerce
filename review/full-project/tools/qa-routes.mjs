// Route smoke test: every route at 414 / 768 / 1024 / 1440, screenshots at 414 and 1440
import { writeFileSync } from 'node:fs'
import { launch } from './cdp.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = new URL('../screenshots/', import.meta.url).pathname
const WIDTHS = [414, 768, 1024, 1440]

const routes = [
  { name: 'home', path: '/' },
  { name: 'shop', path: '/shop' },
  { name: 'shop-category-query', path: '/shop/kadin/ayakkabi/2?filter=siyah&sort=price:desc' },
  { name: 'product-detail', path: '/shop/kadin/ceket/3/gri-regular-astar/322' },
  { name: 'contact', path: '/contact' },
  { name: 'team', path: '/team' },
  { name: 'about', path: '/about' },
  { name: 'signup', path: '/signup' },
  { name: 'login', path: '/login' },
  { name: 'cart-empty', path: '/cart' },
  { name: 'order-protected', path: '/order', expectPath: '/login' },
  { name: 'orders-protected', path: '/orders', expectPath: '/login' },
  { name: 'not-found', path: '/this-route-does-not-exist' },
]

const client = await launch(9333)
const results = []

for (const route of routes) {
  for (const width of WIDTHS) {
    client.consoleErrors.length = 0
    client.failedRequests.length = 0
    await client.viewport(width)
    await client.goto(BASE + route.path, 2000)
    const info = await client.eval(`(() => ({
      path: location.pathname + location.search,
      title: document.querySelector('main h1, main h2')?.textContent.trim() || '',
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
      headerCount: document.querySelectorAll('header').length,
      footerCount: document.querySelectorAll('footer').length,
    }))()`)
    const result = {
      route: route.path,
      width,
      finalPath: info.path,
      heading: info.title.slice(0, 60),
      horizontalOverflow: info.scrollWidth > info.innerWidth,
      brokenImages: info.brokenImages,
      headers: info.headerCount,
      footers: info.footerCount,
      consoleErrors: [...client.consoleErrors],
      failedRequests: [...client.failedRequests],
      redirectOk: route.expectPath ? info.path.startsWith(route.expectPath) : true,
    }
    result.pass = !result.horizontalOverflow && result.brokenImages.length === 0 && result.headers === 1 && result.footers === 1 && result.consoleErrors.length === 0 && result.redirectOk
    results.push(result)
    if (width === 414 || width === 1440) {
      await client.screenshot(`${OUT}${route.name}-${width}.png`)
    }
    console.log(`${result.pass ? 'PASS' : 'FAIL'} ${width} ${route.path} -> ${info.path} overflow=${result.horizontalOverflow} broken=${result.brokenImages.length} errors=${result.consoleErrors.length}`)
  }
}

writeFileSync(new URL('../qa-routes.json', import.meta.url), JSON.stringify(results, null, 2))
await client.close()

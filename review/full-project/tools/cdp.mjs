// Minimal Chrome DevTools Protocol helper (no dependencies; Node >= 22 for global WebSocket)
import { execFileSync, spawn } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function launch(port = 9333) {
  const profile = mkdtempSync(join(tmpdir(), 'wt-qa-'))
  const proc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: 'ignore' })

  let targets
  for (let i = 0; i < 50; i += 1) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      if (targets.find((t) => t.type === 'page')) break
    } catch { /* not ready */ }
    await sleep(200)
  }
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }))

  let id = 0
  const pending = new Map()
  const listeners = []
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else resolve(msg.result)
    } else if (msg.method) {
      listeners.forEach((fn) => fn(msg))
    }
  })

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      id += 1
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })

  const client = {
    send,
    on: (fn) => listeners.push(fn),
    consoleErrors: [],
    requests: [],
    failedRequests: [],
    async close() {
      ws.close()
      proc.kill('SIGKILL')
      await sleep(300)
      try { rmSync(profile, { recursive: true, force: true }) } catch { /* ignore */ }
    },
    async eval(expression) {
      const res = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (res.exceptionDetails) throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text)
      return res.result.value
    },
    async viewport(width, height = 900) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 })
    },
    async goto(url, waitMs = 1500) {
      await send('Page.navigate', { url })
      await client.waitFor('document.readyState === "complete"', 20000)
      await sleep(waitMs)
      await client.waitFor('!document.querySelector(\'[role="status"]\')', 60000).catch(() => {})
      await sleep(400)
    },
    async waitFor(expression, timeout = 15000) {
      const start = Date.now()
      while (Date.now() - start < timeout) {
        try { if (await client.eval(expression)) return true } catch { /* retry */ }
        await sleep(250)
      }
      throw new Error(`Timeout waiting for: ${expression}`)
    },
    async screenshot(path) {
      // Tall device metrics hang headless Chrome, so capture 900px scrolled chunks and stitch them
      const total = Math.min(await client.eval('document.documentElement.scrollHeight'), 24000)
      const viewportHeight = await client.eval('window.innerHeight')
      const parts = []
      for (let y = 0; y < total; y += viewportHeight) {
        await client.eval(`window.scrollTo(0, ${y})`)
        await sleep(350)
        const actual = await client.eval('Math.round(window.scrollY)')
        const { data } = await send('Page.captureScreenshot', { format: 'png' })
        const file = `${path}.part${parts.length}.png`
        writeFileSync(file, Buffer.from(data, 'base64'))
        parts.push(`${file}:${actual}`)
      }
      await client.eval('window.scrollTo(0, 0)')
      execFileSync('python3', [new URL('./pngstitch.py', import.meta.url).pathname, path, String(total), ...parts])
      parts.forEach((part) => rmSync(part.slice(0, part.lastIndexOf(':')), { force: true }))
      // keep evidence small: store as JPEG next to the requested name
      const jpg = path.replace(/\.png$/, '.jpg')
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '70', path, '--out', jpg], { stdio: 'ignore' })
      rmSync(path, { force: true })
    },
    // React controlled input helper: native setter + input/change events
    async fill(selector, value) {
      await client.eval(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) throw new Error('missing ' + ${JSON.stringify(selector)});
        const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
      })()`)
    },
    async click(selectorOrText) {
      return client.eval(`(() => {
        const q = ${JSON.stringify(selectorOrText)};
        let el = null;
        if (q.startsWith('text=')) {
          const t = q.slice(5);
          el = [...document.querySelectorAll('button, a, label')].find(e => e.textContent.trim() === t) ||
               [...document.querySelectorAll('button, a, label')].find(e => e.textContent.trim().includes(t));
        } else el = document.querySelector(q);
        if (!el) throw new Error('missing ' + q);
        el.click();
        return true;
      })()`)
    },
  }

  client.on((msg) => {
    if (msg.method === 'Runtime.exceptionThrown') {
      client.consoleErrors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text)
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      client.consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '))
    }
    if (msg.method === 'Network.requestWillBeSent') {
      const headers = msg.params.request.headers || {}
      const auth = headers.Authorization || headers.authorization
      client.requests.push({
        method: msg.params.request.method,
        url: msg.params.request.url,
        // never store token values
        authorization: auth ? (auth.startsWith('Bearer') ? 'Bearer <REDACTED>' : '<RAW TOKEN REDACTED>') : null,
      })
    }
    if (msg.method === 'Network.loadingFailed' && !msg.params.canceled) {
      client.failedRequests.push(msg.params.errorText)
    }
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
      client.failedRequests.push(`${msg.params.response.status} ${msg.params.response.url}`)
    }
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Page.bringToFront')
  // deterministic screenshots: sliders do not autoplay with reduced motion
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  return client
}

# Dependency Changes

**None.** `package.json` and `package-lock.json` are unchanged from the T01 baseline `30e27eb` (verify with `git diff 30e27eb -- package.json package-lock.json`, which is empty).

All work uses the already-installed stack:

| Package | Version (installed) | Used for |
|---|---|---|
| react / react-dom | 18.2.0 | UI |
| react-router-dom | 5.3.4 | `BrowserRouter`, `Switch`, `Route`, `Link`, `NavLink`, `Redirect`, `useParams`, `useHistory`, `useLocation` |
| redux | 4.2.1 | `createStore`, `combineReducers`, `applyMiddleware` |
| react-redux | 8.1.3 | `Provider`, `useSelector`, `useDispatch` |
| redux-thunk | 2.4.2 | thunk action creators |
| redux-logger | 3.0.6 | `createLogger()` in development only |
| axios | ^1.20.0 | shared instance `src/api/axiosInstance.js` |
| react-hook-form | ^7.88.0 | signup, login, address, card forms |
| react-toastify | ^11.1.0 | notifications |
| lucide-react | ^1.46.0 | generic UI icons (brand icons are local SVG paths) |
| tailwindcss | ^3.4.17 | all styling |

Deliberately **not** added: a slider library (a small dependency-free `Slider.jsx` was written), `react-paginate` (own `Pagination.jsx`), `react-gravatar` (SHA-256 hash via Web Crypto), Redux Toolkit, Router v6.

QA tooling in `review/full-project/tools/` uses only Node 24 built-ins (global `fetch`/`WebSocket`), the locally installed Google Chrome (headless, DevTools protocol) and Python 3 standard library. It is not part of the app build.

Note: `redux-logger` must be imported as `import { createLogger } from 'redux-logger'`; the default import is not a function under Vite's dev-mode CommonJS interop (found and fixed during QA: "middleware is not a function").

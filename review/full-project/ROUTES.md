# Routes (React Router DOM 5.3.4)

Defined once in `src/layout/PageContent.jsx` inside a single `<Switch>`; Header and Footer wrap every route.

| Path | Component | Access | Task |
|---|---|---|---|
| `/` | `HomePage` | public | T02 |
| `/shop` | `ShopPage` | public | T03, T12 (top 5 categories), T13, T14, T15 |
| `/shop/:gender/:categoryName/:categoryId` | `ShopPage` (category from `useParams`) | public | T12, T14 |
| `/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId` | `ProductDetailPage` | public | T04, T16, T17 |
| `/contact` | `ContactPage` | public | T05 |
| `/team` | `TeamPage` | public | T06 |
| `/about` | `AboutPage` | public | T07 |
| `/signup` | `SignupPage` | public | T08 |
| `/login` | `LoginPage` | public | T10 |
| `/cart` | `CartPage` | public | T18, T19 |
| `/order` | `CreateOrderPage` | **protected** (`ProtectedRoute` → `Redirect` to `/login` with `state.from`) | T20, T21, T22 |
| `/orders` | `OrdersPage` | **protected** | T23 |
| `*` | `NotFoundPage` | public | — |

## Query parameters on shop routes

| Param | Values | Sent to API as |
|---|---|---|
| `filter` | free text | `filter=` |
| `sort` | `price:asc`, `price:desc`, `rating:asc`, `rating:desc` | `sort=` |
| `page` | 1..n | `limit=25&offset=(page-1)*25` |

Category comes from the path (`:categoryId` → `category=`). Changing any one of category / filter / sort / page keeps the others (the URL is the single source of truth). Example request produced by the UI: `/products?category=2&filter=siyah&sort=price%3Adesc&limit=25&offset=25`.

Examples: `/shop/kadin/ayakkabi/2`, `/shop/erkek/gomlek/11?filter=siyah&sort=price:desc&page=2`, `/shop/kadin/ceket/3/gri-regular-astar/322`.

Product detail URLs use the product's `category_id` to look up the category in the Redux store; if categories are not loaded yet the fallback is `/shop/urun/kategori/:category_id/:slug/:id` (still matches the same route).

## SPA refresh on Vercel

`vercel.json` rewrites every path to `/index.html`. Vercel serves real files (e.g. `/images/...`, `/assets/...`) before applying rewrites, so static assets are unaffected. Locally verified with `vite preview` (deep links return 200 and render).

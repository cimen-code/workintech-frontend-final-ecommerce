# Final Strict Repair — Plan Checkpoint (written before any source edit)

Verified state: branch `builder/full-project-run-20260917-1324`, HEAD `464be2a`, clean tree, reference ZIP SHA256 `6119be87…6399` matches, `main` = `30e27eb`.

## Files planned to touch (source)

| File | Locked decision / task | Planned change |
|---|---|---|
| `src/data/homeData.js` | 4.2, 4.3 (T02) | Bestsellers: the eight static Figma cards ("Graphic Design", "English Department", $16.48 → $6.48, 4 colour dots) in Figma order, using existing local Figma images (`product-1..8.jpg`, mapped by content to the Figma export order 4,2,1,5,8,6,3,7). Remove invented slides (`WINTER 2021`, `NEW SEASON`, price 24.9). Keep only the canonical slide content |
| `src/pages/HomePage.jsx` | 4.2, 4.3, §7 | Remove `/products` API call, loading state and API card mapping. Render static cards via `ProductCard`. Hero background via Tailwind class instead of inline style |
| `src/components/Slider.jsx` | 4.3 | No logic change planned (only if needed for single canonical content) |
| `src/data/teamData.js`, `src/pages/TeamPage.jsx`, `src/components/TeamCard.jsx` | 4.1 (T06) | Only Gökhan Özdemir (Project Manager) + Hakan Çimen (Full Stack Developer). Remove placeholders; center the two cards |
| `public/images/team/member-3..9.png` | 4.1 | Delete (unused after placeholder removal) |
| `src/store/reducers/shoppingCartReducer.js`, `src/store/store.js` | 4.5 (T17) | Remove cart localStorage load/save only (token storage untouched) |
| `src/store/actions/shoppingCartActions.js` | 4.9 (T22) | After successful `POST /order`, reset the whole cart |
| `src/components/OrderSummary.jsx`, `src/utils/helpers.js` | 4.6 (T19) | Single Create Order / continue button. Keep the formula. Shipping/discount values only as shown in the canonical sample (see decision note below) |
| `src/pages/CreateOrderPage.jsx` | 4.8 (T21) | Remove `[1, 3, 6]` plans and installment state. Render a single "Single Payment (Tek Çekim)" row. `setPayment` without an installment field |
| `src/pages/ShopPage.jsx`, `src/store/actions/productActions.js` | 4.10 (T14) | Filter input updates filter state on change → GET with category/sort kept. Sort stays select + Filter click. Guard against out-of-order responses |
| `src/components/Gravatar.jsx`, `src/layout/Header.jsx` | §7 | Replace the trivial inline size style with Tailwind classes (only if no behavior change) |

Not planned: Header navigation, routes, Redux structure, address/card CRUD, signup/login/verify, product detail, pagination, orders page, dependencies.

## Decision note for 4.6 (T19 values), recorded before editing

The T19 card's own sample image ("Sipariş Özeti") shows **Kargo Toplam 29,99 TL** and **"150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)" −29,99 TL**. The T20 and T21 sample images repeat it. Decision 4.6 says to use values explicitly present in canonical sample material when they exist, and names 29.99/150 as invented only "merely because we chose it". These values are **present in the canonical sample**, so they are kept and documented as sample-derived. The duplicate button is removed because the T19 task text specifies **a** "Create Order" button, and 4.6 requires one.

## Tests / evidence planned

- Node unit checks (no network): cart reducer ignores localStorage; `createOrder` resets the cart (mocked API); `fetchProducts` ignores stale responses; order summary formula; plus re-run of the existing repair unit checks (Remember Me, T11, card expiry).
- Browser QA against `vite preview`: Home without `/products`, 8 static cards; Team = 2 people; T14 typing filter keeps category + sort; cart not restored after reload; one Create Order button; single payment row, no 1/3/6; order success resets cart using **CDP request interception of `POST /order`** (no real order written); Remember Me + raw token; expiry; logged-in pages at 414/768/1024/1440.
- Route smoke test 13 routes × 4 widths.
- Backend writes allowed: one temporary card (deleted in the same run) to reach the payment step. No orders, users or addresses.

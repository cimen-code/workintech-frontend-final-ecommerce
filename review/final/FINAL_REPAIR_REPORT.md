# Final Strict Repair + Submission Cleanup — Report

Date 2026-09-17 · Starting point: `builder/full-project-run-20260917-1324` @ `464be2a` (clean). The reference ZIP SHA256 `6119be87e14acf303264eef6193af9e507b2e55a825c0e695b731e0537066399` was verified before any change. `main` = `30e27eb` and was not touched.
Planned repair surface: `REPAIR_PLAN.md` (committed before the first source edit as `398f0b9`).

## 1. Locked decisions — what was done

| Decision | Result | Change | Evidence |
|---|---|---|---|
| 4.1 T06 Team | **DONE** | `teamData.js` now has only Gökhan Özdemir (Project Manager) and Hakan Çimen (Full Stack Developer). Placeholder cards and their 7 images were removed; cards are centred on Team and About | qa-final T06 ×3, `screenshots/team-*.jpg` |
| 4.2 T02 bestsellers | **DONE** | Home no longer calls `/products`. It renders the eight static Figma cards ("Graphic Design", "English Department", $16.48 old / $6.48 price, 4 colour dots) through `ProductCard`. The content was read from the saved 1:1 Figma export of `desktop-product-cards-10` (2984:7008). The existing Figma images `product-1..8.jpg` were renamed to the Figma card order | qa-final T02 ×10, final-unit-checks T02.1, `screenshots/home-*.jpg` |
| 4.3 T02 slider content | **DONE** | Removed the invented `WINTER 2021`, `NEW SEASON` and `24.90` slides. Figma shows arrows and a two-position indicator but content for one slide, so both positions render that same canonical slide. No new copy; the slider component is unchanged. The hero background moved from an inline style to a Tailwind class | qa-final "no invented slide copy", final-unit-checks T02.2 |
| 4.4 Home category block | **KEPT REMOVED** | none | qa-final T02 "no extra SHOP BY CATEGORY block" |
| 4.5 T17 cart persistence | **DONE** | Removed the localStorage load in `shoppingCartReducer` and the save subscription in `store.js`. Token storage is untouched | qa-final T17 ×4, final-unit-checks T17 ×3 |
| 4.6 T19 summary | **DONE, with an explicit value decision** | `OrderSummary` renders one action button (was two). The formula is unchanged. See §2 for the shipping/discount values | qa-final T19 ×5, final-unit-checks T19 ×3 |
| 4.7 T20 address | **UNCHANGED BY DESIGN** | multiline `address` kept (live API accepts and stores it) | builder-run evidence |
| 4.8 T21 payment options | **DONE** | Removed `FIXED_INSTALLMENT_PLANS [1,3,6]`, the installment state, and the installment field in `setPayment`. The payment step shows one "Single Payment (Tek Çekim)" row with the grand total, matching the T21 sample. Card CRUD unchanged | qa-final T21 ×3; T21 graded **PARTIAL** (data source for "fetched by card data" does not exist) |
| 4.9 T22 cart reset | **DONE** | `createOrder` resets the whole cart after success (previously kept unchecked items). A failed order keeps the cart | qa-final T22 ×5 (POST intercepted), final-unit-checks T22 ×4 |
| 4.10 T14 filter/sort/category | **DONE** | The filter input updates the filter state on every change (`history.replace`), which triggers the GET. Sort stays select + Filter click. Category/sort/filter are kept on every change. The filter form no longer remounts on each URL change (the input keeps focus). `fetchProducts` ignores out-of-order responses | qa-final T14 ×8, qa-final-pagination ×4, final-unit-checks T14 ×3 |
| 4.11 auth | **PRESERVED** | none | qa-final T10/T11 ×7, repair-unit-checks (21) re-run |
| 4.12 expiry | **PRESERVED** | none | qa-final T21 expiry, repair-unit-checks R5 ×8 re-run |
| 4.13 header | **PRESERVED** | only the Gravatar size moved from inline style to `h-7 w-7` (no behaviour change) | qa-routes, qa-final |
| 4.14 Figma assets | **STILL RATE-LIMITED** | One `download_assets` attempt on `2984:7444` got the Starter-plan limit. No further retries; images unchanged | this report |

## 2. Decision note — T19 shipping/discount values (please review)

Decision 4.6 names "shipping = $29.99" and "free shipping above $150" as invented rules to remove, **but also says to use values explicitly present in canonical sample material.** The T19 card's own sample image ("Sipariş Özeti", Trendyol cart) shows:

- `Kargo Toplam 29,99 TL`
- `150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar) -29,99 TL`
- `Toplam` equal to the products total

The T20 and T21 sample images repeat the same lines. Because these values are present in the canonical sample (precedence #3 ranks above the locked decisions), they were **kept** and are now documented in the source (`utils/helpers.js`). The unit check reproduces the sample exactly (8448.99 → shipping 29.99, discount 29.99, total 8448.99).

If the reviewer still wants neutral values, set `SHIPPING_PRICE = 0` in `src/utils/helpers.js`; the discount then also becomes 0. That is a one-line change and nothing else depends on it.

The duplicate button in the samples (top and bottom "Sepeti Onayla") was **not** kept: the T19 task text specifies *a* "Create Order" button, and 4.6 requires one.

## 3. Unchanged by design

Header/navigation (4.13), routes, Redux structure, signup/login/verify logic, product listing/detail, pagination logic, address and card CRUD, orders page, Postman collection, dependencies (`package.json`/lockfile identical to `30e27eb`), soft Home images (4.14).

## 4. QA summary

| Area | Result | Evidence |
|---|---|---|
| Lint / build (builder tree) | PASS / PASS | `FINAL_CHECKS.txt` |
| Lint / build (clean candidate, fresh `npm ci`) | PASS / PASS | `FINAL_CHECKS.txt` |
| Unit checks | 16 + 21 + 17 PASS (no network) | `evidence/*unit-checks*.txt` |
| Focused browser QA | 59 PASS, 0 FAIL, 0 console errors | `evidence/qa-final.txt` |
| Pagination re-check | 4 PASS | `evidence/qa-final-pagination.txt` |
| Route smoke test | 13 routes × 414/768/1024/1440 | `evidence/qa-routes.txt` |
| Logged-in responsive | cart, checkout payment step, previous orders: no overflow / broken images at 414/768/1024/1440 | qa-final RESP ×3 |

### Backend writes during final QA

- `POST /login` ×2 (browser) plus 2 read-only verification logins with curl (orders/addresses listing).
- One temporary card, `POST /user/card` → `DELETE /user/card/:id`, deleted in the same run (id in qa-final.txt).
- `POST /order` was **intercepted in the browser** (DevTools Fetch domain) and answered locally, so no order reached the backend.
- No users, addresses or orders were created.
- The pagination check is read-only.

Observed external state: the shared public account now has **0 orders**, and address ids restarted. The orders #6/#7 created in the builder run are gone, so the backend data was reset by a third party. The T23 table was therefore verified with an in-browser mocked `GET /order` response in the real API shape (screenshots named `orders-mocked-*`), plus a live empty-state check.

## 5. Submission cleanup

- Clean candidate branch `candidate/final-submission-20260917` was created from the final builder HEAD, with `review/` removed in one commit. It contains only project files: `src/`, `public/`, `postman/`, `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `vercel.json`, `README.md`, `.gitignore`.
- It was verified in a separate git worktree with `npm ci`, `npm run lint` and `npm run build`.
- The builder branch keeps all review evidence.
- Nothing was merged, pushed or deployed.

## 6. Known remaining issues

1. **T21 PARTIAL:** "payment options fetched by card data" has no documented endpoint, rule or data. Only the sample's single-payment row is shown.
2. **T02 visual:**
   - Neural Universe and Featured Posts images are soft (Figma MCP quota).
   - The menu differs from Figma (Team instead of Blog/Pages).
   - One canonical slide fills both slider positions.
   - The Home page was not pixel-measured.
3. The T19 shipping/discount values come from the sample, not the task text (see §2). Amounts show "$" (Figma) while the samples show TL.
4. The shared backend was reset by a third party, so the T23 live table can only be shown once the account has orders.
5. Unchanged earlier deviations:
   - the address form sends `address`
   - `card_no` is sent as a JS number (task sample)
   - one GET per keystroke while filtering (no debounce, per the literal task)

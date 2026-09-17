# Repair Wave 1 Report

Branch `builder/full-project-run-20260917-1324` · previous builder HEAD `b068f92` · reference archive SHA256 `5f4442effa151b61c5eac5d1941d9717214040146b9a4d26ffc9e2223be021eb` (re-verified before any change)
Scope: narrow repairs only. No dependency, stack, route or backend-contract changes. `main` untouched; nothing merged, pushed or deployed.

## Finding status

| # | Finding | Status | What changed | Evidence |
|---|---|---|---|---|
| 1 | T02 Home visual fidelity | **PARTIAL** (1 of 4 sub-items blocked) | (a) **FIXED:** extra Home "Top Categories / SHOP BY CATEGORY" block removed. T12 top-5 stays on Shop and the Header dropdown is unchanged. (b) **DEFERRED / BLOCKED:** high-quality exports of `2984:7389` and `2984:7444`. The retry was refused by the Figma MCP Starter-plan limit, so the assets are unchanged. (c) **FIXED:** 414 logged-out top row is now Bandage + Search + Cart + Menu, using the Figma align-right glyph (lucide `TextAlignEnd`). The cart count is hidden when 0 below `lg`, and Login/Register moved into the expanded menu. Categories in the expanded menu are collapsed behind "Shop categories". Authenticated users keep the avatar + dropdown (T10/T23). (d) **FIXED:** fresh 414/1440 Home screenshots and the menu-open state | `qa-repair.log` R1 ×13 PASS; `screenshots/repair/home-414.jpg`, `home-1440.jpg`, `home-414-header-compact.png`, `home-414-menu-open.png`, `home-414-menu-open-categories.png`, `home-414-logged-in-menu-open.png`; Figma reference `figma-reference/home_mobile_header.png` |
| 2 | T06 real Team data | **NEEDS USER INPUT** | No names were invented. The 7 placeholder records are now explicitly labelled "Teammate (to be added) / Role pending" (previously "Team Member / Workintech Student"). The student entry shows the verifiable GitHub handle `cimen-code` as Full Stack Developer until you confirm the display name; the previously inferred "Hakan Çimen" was removed. Gökhan Özdemir stays Project Manager | `qa-repair.log` R2 PASS; `screenshots/repair/team-1440.jpg`; `src/data/teamData.js` header comment |
| 3 | T21 payment options | **SPEC AMBIGUITY** | Checked the task cards, handoff, raw project JSON, both T21 sample images and the API (`/installment`, `/user/card/installment` → 404). No card-dependent installment rule or endpoint exists. The second sample image only shows a "Taksit Sayısı / Aylık Ödeme" table with "Tek Çekim". The UI keeps the safe fixed plans, now named `FIXED_INSTALLMENT_PLANS = [1, 3, 6]`. The card-brand label was removed from the legend, and the UI states "Example plans shown for every card; the API provides no card-specific installment data." Card CRUD remains **PASS**. The payment-options data source is **unspecified**, and the plans are **not fetched or derived from card data** | `qa-repair.log` R3 PASS; `screenshots/repair/checkout-card-installments-1440.png`; TASK_MATRIX T21 = PARTIAL |
| 4 | Strict Remember Me | **FIXED** | `storeToken(token, remember)` (now exported) always sets the axios header. It calls `localStorage.setItem` when remember is true and **`localStorage.removeItem`** otherwise. `verifyToken` is unchanged | `repair-unit-checks.log` R4.1–R4.6 PASS, T11.1–T11.7 PASS (renew / remove / raw header). **Negative control:** the same test against the old `clientActions.js` fails R4.1 (`stored=old-token`). Browser `qa-repair.log` R4 ×5 + T11 ×2 PASS: seeded stale token → login without Remember Me → token absent, in-session `/order` request uses the raw token (no Bearer), reload → logged out; with Remember Me → stored, reload → `/verify` raw token → auto login |
| 5 | Card expiry validation | **FIXED** | New pure `isCardExpired(month, year, now)` in `utils/validators.js`. `CardForm` uses `mode: 'onChange'` and validates the pair on `expire_year`. `expire_month` declares `deps: ['expire_year']`, so changing either field re-evaluates it and field order no longer matters. Submit is blocked while expired | `repair-unit-checks.log` R5 ×8 PASS (08/2026 expired in Sep 2026; 09/2026, 12/2026, 01/2027 valid; 12/2025 expired; string inputs; January edge; incomplete pair). Browser `qa-repair.log` R5 ×6 PASS: month→year and year→month orders both flag 8/2026; changing only the month or only the year clears/re-flags it; the expired pair produced no `POST /user/card`. Screenshot `card-form-expired-1440.png` |

## Home bestseller tradeoff (not changed)

Home bestseller cards remain **live API products** (top 8 by `rating:desc`). The fixed Figma demo cards ("Graphic Design / English Department / $16.48 $6.48") are only the fallback when the API fails.

- Keeping live data makes every card clickable to a real detail page and consistent with T13/T16/T17.
- Switching to fixed demo cards would match the Figma pixels and text more closely, but the cards would lead to non-existent products.

Nothing in visual grading so far requires the fixed content. Changing it is a one-line decision in `HomePage.jsx` (use `fallbackProducts` unconditionally).

## QA gate

| Gate | Result | Evidence |
|---|---|---|
| `npm run lint` | PASS (0 problems) | `REPAIR_CHECKS.txt` |
| `npm run build` | PASS | `REPAIR_CHECKS.txt` |
| Focused Home visual QA 414 + 1440 | PASS (checks); visual fidelity still PARTIAL (assets) | `qa-repair.log` R1, `screenshots/repair/` |
| Mobile expanded-menu screenshot | done | `home-414-menu-open.png` (+ categories and logged-in variants) |
| Auth: Remember Me + verify raw token / no Bearer | PASS | `repair-unit-checks.log`, `qa-repair.log` R4/T11 |
| Card form validation | PASS | `repair-unit-checks.log` R5, `qa-repair.log` R5 |
| Route smoke test (13 routes × 4 widths) | PASS 52/52 | `qa-routes.log`, `qa-routes.json` |
| Backend writes | 0 orders, 0 users, 0 addresses; 1 temporary card created and deleted | `qa-repair.log` SAFETY |

The builder-run flow suite (`qa-flows.mjs`) was **not** re-run, because it creates a real order and a synthetic user. The repaired areas are covered by the focused suites above, and flows unaffected by the repair (shop params, cart, address CRUD, order, orders) were not changed in source.

## Remaining issues requiring action

1. **T02 assets:** export Figma nodes `2984:7389` (image inside `hero-cover-1`) and `2984:7444` (three Content-card images) once the Figma quota resets or via manual export, and overwrite `public/images/home/neural-universe.png` and `blog-1.png`..`blog-3.png`.
2. **T06:** supply the real teammate names/roles and confirm the student display name.
3. **T21:** obtain the intended rule or data source for card-dependent payment options (e.g. BIN/bank table from the instructor).
4. Carried over from the builder run (unchanged): menu Team vs Blog/Pages, in-house slider, dark top bar on all pages, `address` extra field in T20, `card_no` as Number (T22), front-end shipping constants. See `KNOWN_ISSUES.md`.

## Commits in this wave

See `REPAIR_CHECKS.txt` (commit list + status) and `REPAIR_GIT_DIFF.patch` (diff `b068f92..HEAD`, screenshots excluded).

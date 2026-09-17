# API Verification

Base URL: `https://workintech-fe-ecommerce.onrender.com` · Date: 2026-09-17 (TRT)
All tokens are redacted. The token was never written to source, logs, screenshots or this archive (curl kept it in a `chmod 600` temp file that was deleted; the browser QA only records whether an `Authorization` header was raw or `Bearer`).

Two verification layers:

1. **Direct API probe (curl)**, before implementation: raw log in `api_probe_notes.txt`
2. **Through the running app** (headless Chrome + DevTools protocol, `tools/qa-flows.mjs`): results in `qa-flows.log` / `qa-flows.json`

## Endpoint matrix

| Endpoint | curl probe | Through the UI | Notes |
|---|---|---|---|
| `GET /roles` | 200, `[{id:1,code:"admin"},{id:2,code:"store"},{id:3,code:"customer"}]` | fetched on `/signup` only (thunk `fetchRolesIfNeeded`, skipped if roles already in store) | Customer = id 3 selected by default |
| `POST /signup` | duplicate email → 500 `SQLITE_CONSTRAINT`; extra field → 500 `SQLITE_ERROR` | synthetic customer signup succeeded → redirect to previous page + activation toast; duplicate email → stays on form with error | confirms backend strictness. **1 synthetic user created** (see below) |
| `POST /login` | 200 `{token, name, email, role_id}`; wrong password 401 `{"message":"Password is not correct!"}` | success → user in header + gravatar, redirect to previous page; failure → toast with backend message | |
| `GET /verify` | raw token 200 (returns renewed token); `Authorization: bad` 401 | app start sends `GET /verify` with **raw token (no Bearer)**; invalid token removed from localStorage and header | |
| `GET /categories` | 200, `{id, code "k:tisort", title, img, rating, gender}` | header dropdown (Kadın/Erkek), top-5 by rating on Home and Shop | |
| `GET /products` | 200 `{products, total}`; combined `category/filter/sort/limit/offset` work | every param combination verified from real requests: e.g. `/products?category=2&filter=siyah&sort=price%3Adesc&limit=25&offset=0`, page 2 → `offset=25` | price:desc results verified sorted |
| `GET /products/:id` | 200 (id 322 = T16 sample); unknown id → 500 | detail page for 322 shows real name/price/stock; unknown id shows "Product could not be found." | |
| `GET /user/address` | 401 without token; 200 array | loaded on `/order` | response rows include `address` column |
| `POST /user/address` | 201 with and without `address` field | form submit → list refreshed | see "T20 ambiguity" |
| `PUT /user/address` | 201 | edit → updated district shown | |
| `DELETE /user/address/:id` | 201 `"Address record deleted!"` | delete button (with confirm) wired; QA cleanup used the same endpoint | |
| `GET /user/card` | 200 array | loaded on `/order` step 2 | |
| `POST /user/card` | 201 `{card_no, expire_month, expire_year, name_on_card}` | add card → list refreshed | |
| `PUT /user/card` | 201 with `id` as string (as in task sample) | edit card name → updated | |
| `DELETE /user/card/:id` | 201 `"Credit card record deleted!"` | delete button wired; QA cleanup used it | |
| `POST /order` | not probed with curl (to avoid extra orders) | UI order succeeded, congratulations screen, ordered items removed from cart | payload shape identical to the T22 sample |
| `GET /order` | 200 `[]` before tests | table + collapsible details | row keys: `id,user_id,address_id,order_date,card_no,card_name,card_expire_month,card_expire_year,price,products`; product keys: `id,name,description,price,count,images` |

## T20 ambiguity: the multiline "Address" field

The T20 card lists a multiline **Address** form field (street, building, door), but its JSON payload examples contain only `title, name, surname, phone, city, district, neighborhood`.

Live behaviour: `GET /user/address` rows have an `address` column. `POST` and `PUT` both accept `"address": "..."` (201, value stored and returned). The canonical payload without it also works (`address: null`).

**Decision:** the form keeps all 7 canonical field names unchanged and additionally sends `address` for the multiline field, because the backend stores it. If a reviewer wants the exact example payload only, remove `address` from `AddressForm.jsx` `submit()`. No other code depends on it.

## T22 payload notes

- `card_no` is sent as a Number, as in the sample. 16-digit numbers above `9007199254740991` would lose precision in JS. The test card `4111111111111111` is safe. This is a backend contract limitation, recorded in KNOWN_ISSUES.
- `order_date` uses local time without a timezone suffix (`YYYY-MM-DDTHH:mm:ss`), like the sample.
- `detail` is the product description. The UI has no size/colour selection because the API has no variants.
- `price` = grand total (products + shipping − discount).

## Records created on the shared backend by this run

| What | Account | Status |
|---|---|---|
| Test addresses (curl probe ids 4, 5; UI runs "QA Builder Ev") | customer@commerce.com | **deleted** by the probe and by the QA cleanup step (ids listed in `qa-flows.log`) |
| Test cards (curl id 4; UI "QA Builder") | customer@commerce.com | **deleted** |
| Orders from the UI QA runs (first run #6; the final run's id is in `qa-flows.log`) | customer@commerce.com | **cannot be deleted** (no DELETE endpoint). Test card 4111…1111, synthetic data |
| User accounts `qa.builder.<timestamp>@example.com` (one per full QA run, customer role) | new | cannot be deleted via API. Synthetic, non-deliverable domain |

Pre-existing data on the public account (address id 3 "sdf") was not modified.

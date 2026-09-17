# Known Issues

The list is not empty. Ordered by importance for review.

## Blockers encountered (worked around)

1. **Figma MCP Starter-plan tool-call limit** was reached after ~15 Figma calls (metadata, page list, 10 screenshots, 4 asset downloads). A retry later in the run was still blocked. Consequences: some images are cropped from scaled-down frame screenshots (see ASSET_MANIFEST), and no node-level `get_design_context` measurements were taken for Shop / Product / inner pages. Spacing there was matched by eye from full-frame screenshots, not by exact Figma values.
2. **Old Figma file** `tXhNJv706AWM0lXlyxLH9l` is unavailable (per handoff). The editable copy was used.

## Visual / design deviations

3. Home "Part of the Neural Universe" and "Featured Posts" images are soft (≈0.48× source upscaled).
4. About/Team images are ≈0.7–0.8× source.
5. Inner pages (About/Team/Contact) in Figma use a different, simpler navbar (Home/Product/Pricing/Contact + "Become a member"). The app uses the single shared Header on every page, as T02–T07 require.
6. Menu items: Figma shows Home/Shop/About/Blog/Contact/Pages. The app has no Blog/Pages pages, so the menu is Home/Shop/About/Team/Contact.
7. The top bar colour is dark (`#252B42`) on all pages. The Figma Shop/Product frames use green `#23856D`; "no color changes needed" was read as "keep one header style".
8. Editor's Pick images contain the label boxes (MEN/WOMEN/…) baked into the crop.
9. Pixel-perfect accuracy was **not** verified. Section order, typography scale, colours and responsive composition were compared visually against Figma frame screenshots.

## Functional notes

10. `POST /order` sends `card_no` as a JS Number (per the T22 sample). Card numbers above 9007199254740991 would lose precision. This is a backend contract issue.
11. Address form sends the extra `address` field (accepted and stored by the live API). Remove it in `AddressForm.jsx` if the strict sample payload is preferred.
12. Shipping (29.99) and free-shipping threshold (150) are front-end constants in `src/utils/helpers.js`. There is no backend source for them.
13. Instalment "payment options" in step 2 are display-only; the backend has no options endpoint and the order payload has no instalment field.
14. Orders table on 414px scrolls horizontally inside its container (Total column is off-screen until scrolled).
15. Favourites (heart) counter is static `0`; there is no favourites task.
16. The header search icon navigates to `/shop` (filter input lives there); there is no search overlay.
17. Home bestseller section calls `/products` directly with axios (not via Redux) so it does not overwrite the Shop page's product list in the reducer.
18. Main JS bundle is ~415 kB (128 kB gzip); no code splitting. Vite gave no warning.

## QA tooling caveats

19. Headless Chrome hangs on very tall viewports, so full-page screenshots are stitched from 900px scrolled captures (`tools/pngstitch.py`). Where the page height changed between chunks (e.g. `orders-414.jpg` after expanding details) the bottom can show a black band or repeated rows. These are capture artifacts, not app layout.
20. The signup spinner check in `qa-flows.log` is timing-sensitive (FAIL in the final run because the request resolved within 150 ms; PASS in the first run). The deterministic re-check with 2 s simulated latency is in `qa-signup-spinner.log` (PASS).
21. Full QA runs create a real order on `customer@commerce.com` (#6 and #7) and a synthetic user `qa.builder.<timestamp>@example.com` each time. There are no delete endpoints for these.
22. The user's own `vite` dev server (port 5173) was already running from the repo and was left running. QA ran against `vite preview` of the production build on port 4173.

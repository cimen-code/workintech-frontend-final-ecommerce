# Asset Manifest

> **Repair wave 1: no asset files changed.** Replacement exports for `home/neural-universe.png` (node `2984:7389`) and `home/blog-1..3.png` (node `2984:7444`) were attempted again on 2026-09-17 and refused by the Figma MCP Starter-plan tool-call limit. The files below are unchanged from the builder run.

Figma source file: `gJBJsNnMw9D3WHKjbD5tty` (editable copy of *E-commerce UI – Figma Ecommerce UI Kit (Demo Version) (Community)*). Image credits inside the kit: unsplash.com photos, undraw.co illustrations, iconify.design icons (per the kit's INDEX page `258:4638`).

All assets are stored locally under `public/images/`. Production code has **no** Figma MCP URLs (those expire).

## How assets were produced

The Figma MCP Starter plan hit its **tool-call limit** during the run (after 4 of 7 planned `download_assets` calls). Assets therefore come from three methods:

| Method | Meaning |
|---|---|
| **RAW** | Original image file from `download_assets` → `rawImages` (full quality) |
| **EXPORT-CROP** | Cropped from a 1:1 section render (`download_assets` → `export`, 1440px wide) with `review/full-project/tools/pngcrop.py` |
| **SHOT-CROP** | Cropped from a whole-frame `get_screenshot` render (scaled down; lower resolution, see "Scale") |

## Files

| Local file | Used in | Figma frame / node | Method | Scale vs 1440 design |
|---|---|---|---|---|
| `home/hero-new-collection.jpg` | Home hero slider | desktop-shop-header-1 `2984:6691` | RAW (2000×1302) | > 1× |
| `home/editors-men.png` | Home Editor's Pick | desktop-shop-cards-31 `2984:6974` | EXPORT-CROP (x195 y190 510×500) | 1× |
| `home/editors-women.png` | Home Editor's Pick | `2984:6974` | EXPORT-CROP (x735 y190 240×500) | 1× |
| `home/editors-accessories.png` | Home Editor's Pick | `2984:6974` | EXPORT-CROP (x1005 y190 240×242) | 1× |
| `home/editors-kids.png` | Home Editor's Pick | `2984:6974` | EXPORT-CROP (x1005 y448 240×242) | 1× |
| `home/product-1..8.jpg` | Home bestseller **fallback** (only if API fails) | desktop-product-cards-10 `2984:7008` | RAW (360×456) | 1.5× |
| `home/vita-classic.png` | Home second carousel | carousel 2 `2984:7332` | RAW (686×1072, transparent) | > 1× |
| `home/neural-universe.png` | Home "Part of the Neural Universe" | container-fluid `2984:7389` | SHOT-CROP of `2984:6640` | ≈0.48× (blurry) |
| `home/blog-1..3.png` | Home Featured Posts | desktop-blog-3 `2984:7444` | SHOT-CROP of `2984:6640` | ≈0.48× (blurry) |
| `clients/logos.png` | Shop, Product Detail, About (ClientsLogos) | desktop-shop-1 `3006:10335` | SHOT-CROP | ≈0.99× |
| `product/main.png`, `product/thumb-1..2.png` | Product detail fallback image (only if a product has no images) | desktop-product-1 `3010:28540` | SHOT-CROP | ≈0.95× |
| `product/description.png` | Product detail description tab | `3010:28540` | SHOT-CROP | ≈0.95× |
| `team/hero-main.png`, `team/hero-1..4.png` | Team page collage | desktop-team-1 `2874:4077` | SHOT-CROP | ≈0.83× |
| `team/member-3..9.png` | Team page placeholder cards ("Teammate (to be added)"; not real people) | `2874:4077` | SHOT-CROP | ≈0.83× |
| `about/hero.png` | About hero | desktop-about-1 `2865:3805` | SHOT-CROP | ≈0.68× |
| `about/video.png` | About video card | `2865:3805` | SHOT-CROP | ≈0.68× |
| `about/work-with-us.png` | About "Work with us" | `2865:3805` | SHOT-CROP | ≈0.68× |
| `contact/hero.png` | Contact hero | desktop-contact-1 `2879:7582` | SHOT-CROP | 1× |

Removed as unused: Shop category card crops (Shop uses live category images from `/categories`) and Team member crops 1–2 (real people use initials avatars).

## Icons

- Brand icons: `src/components/SocialIcons.jsx`, `fill="currentColor"`. Facebook uses the exact Figma vector path from the top bar of `2984:6691` (raw file `figma-raw/hero/svg2.svg`, not committed). The Figma Instagram/YouTube/Twitter SVGs (`svg3|5|8.svg`) are Bootstrap Icons glyphs; the component uses the equivalent compact Bootstrap Icons (MIT) path data rather than the Figma-exported absolute coordinates. LinkedIn is also the Bootstrap Icons glyph (no LinkedIn SVG could be downloaded before the rate limit).
- Generic UI icons: `lucide-react` (only symbols verified to exist in the installed version).
- Live product/category images: `https://cdn.dsmcdn.com/...` and `https://workintech-fe-ecommerce.onrender.com/assets/category-img/...` (from the API responses, not stored).

## Known asset issues

1. `home/neural-universe.png` and `home/blog-*.png` are upscaled from a ~0.48× screenshot → visibly soft. Remediation: re-run `download_assets` on `2984:7389` and `2984:7444` when the Figma MCP quota resets, replace files (same names).
2. About/Team images are ~0.7–0.8× → slightly soft on desktop.
3. Editor's Pick crops include the Figma label boxes (MEN/WOMEN/…) baked into the image; the link text is provided as `sr-only` text for accessibility.

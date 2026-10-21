# Spider's Creations — Unified Website

A responsive black-and-gold **custom-product inquiry storefront**. This is a real multipage static website, not an image mockup.

## What customers can do

- Browse **20 collections / 174 individual product types** with grouped subcategories on **All Products**.
- Search both those product types and the **1,078 verified saved design examples** using **Search**.
- Browse **Design Library** by sport, team, theme and style; open individual design details and save favorites.
- Use **Customize** on a specific product to describe text, font, finish, color, size, quantity, delivery date and design notes.
- Save product requests and artwork designs to a quote basket in browser storage.
- Use **Help** for ordering, logo/artwork upload, product options, and common questions.
- Submit project and quote inquiries, including an optional artwork attachment, through Netlify Forms.
- Use the existing themed storefront pages for tumblers, trophies, medals, drinkware, 3D prints, canvas, wedding gifts and more.

## Structure

- `index.html` — black-and-gold homepage with search
- `shop.html` — main category storefront
- `product-types.html` — 20 groups subdivided into relevant product types
- `product-customize.html?id=tumblers-1` — an individually customizable product
- `find.html` — unified search (products and actual design previews)
- `designs.html` and `design.html?id=...` — browsable design library and individual examples
- `customize.html` — full visual customizer for new custom ideas
- `basket.html` — saved quote requests
- `custom-nails.html` — 16 verified Joyee Nails page-2 reference designs, supplier attribution, image links and custom nail quote requests
- `js/custom-nails.js` — client-side nail search, style filters, size/shape selection and basket integration
- `contact.html` — project/quote inquiry with optional artwork
- `help.html` — help center with common questions and steps
- `assets/sprites/s000.webp` through `s067.webp` — optimized sheets with saved design pictures
- `data/designs.json` — design catalog metadata mapped to sprite regions
- `store-data.js` — the 174 product-type templates

## Netlify deployment

This is a static site. The checked `netlify.toml` specifies `[build] publish = "."`. There is **no npm build step**. Set the repository's deploy branch and publish directory in Netlify to match that configuration. Forms are processed **only on a real Netlify deployment**, not a local file preview; verify receipt in Netlify's Forms dashboard using a safe test request after publishing.

## Launch limitations — please read

- **Quote requests, not paid checkout.** Prices, stock, materials, fulfillment, shipping, payment links and turnaround times must be confirmed by the business. This site does not charge cards and does not claim to do so.
- A customizable text preview is illustrative, not a final manufacturing proof.
- The category photographs are representative examples. The design preview sheets contain real images recovered from previous site archives. Original high-resolution artwork remains in the separate source image archives.
- This site stores the quote basket and favorites on the visitor's device, not in an authenticated server account.
- Any team logos, protected characters or other third-party artwork require appropriate rights/licensing before being offered for sale or produced.
- Review privacy, terms, contact information, email delivery, domain configuration and form security before public launch.

## Verification

Run `python3 scripts/verify_site.py` (Python 3.11 or higher) and `node --check js/shop-hub.js`. Local responsive/browser interaction tests were performed at phone, tablet and desktop widths using a simulated browser origin; **live Netlify payment and form delivery have not been verified**.

## Custom Nails sources and permissions
On October 21, 2026, the 16 products visible on [Joyee Nails page 2](https://www.joyeenails.com/collections/custom-press-on-nails?page=2) were recorded as attributed external references. Original source URLs and externally hosted photos remain linked for each item. Their prices are **Joyee prices at the time of inspection**, not Spider's Creations prices. This is **not** a full import of the 716-product Joyee catalog, a reseller inventory integration, or a licensed reproduction of Joyee designs. Production feasibility and rights must be confirmed before orders are taken. The public deployment and Netlify form receipt must be tested independently.

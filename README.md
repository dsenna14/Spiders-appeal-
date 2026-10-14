# Spider's Creations — website source

This is the development build of the custom-product storefront for Spider's Creations, deployed as a static website on Netlify.

## Site pages

- Homepage, shop and 19 distinct collection pages
- 158 custom product types, individual product detail pages, and a design library
- Product and category search, professional sports league and team search
- Customization form with text preview, materials, finishes, colors, sizes, quantities and notes
- Local favorite ideas and quote basket, with edit/remove controls
- Netlify Forms quote inquiries and optional customer artwork file upload
- About, FAQs, privacy, terms, 404, thank-you, contact pages
- Responsive black-and-gold styling and 19 archived concept photographs

## Limitations to verify before launch

This is a **quote-based storefront**. It does not charge cards, provide verified stock or prices, issue order confirmations, or guarantee shipping/delivery. Payment integration needs business credentials and confirmation of prices/tax/shipping terms. Netlify Forms must be tested on the deployed preview with detection and notifications configured. The larger collection of 1,002 saved tumbler concepts and 76 coin images is **not yet uploaded to this GitHub branch**. 19 real archived category photographs are present.

Sports team names are for browsing custom inquiries. Official trademarks, team logos and protected characters require permission before reproduction.

## Deploy

Netlify: publish directory `.` (repo root), no build command needed. Deploy previews can build directly from the `spiders-storefront-build` branch. Do not merge into `main` until testing passes.

The former starter files `app.js` and `styles.css` are unused; the current website uses `storefront-*.js` and `storefront.css`.

Built for Spider's Creations.

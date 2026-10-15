# Spider's Creations — merged storefront

Original black-and-gold storefront, real design gallery, quote-based customization, and saved project basket.

## What is implemented
- 36 static HTML pages for products, shop categories, designs, customization, 3D prints, printing, awards, gallery and corporate inquiries.
- 1,078 unique design records (1,002 tumblers; 76 saved coins), categorized, searchable, filterable and favoritable.
- Responsive accessible layouts, homepage and capabilities pages, mobile menu and home breadcrumbs.
- Browser-local project basket and customizer; Netlify Forms-compatible inquiry forms.
- On the GitHub branch, 68 **sprite sheets** carry the *real image previews* for all 1,078 designs; original high-resolution assets are retained only in the complete downloadable ZIP, not in GitHub. Sprite previews are for browsing, not a production print file.

## Netlify deployment
Static site, no npm build required. `netlify.toml` contains:
```
[build]
  publish = "."
```
Connect this GitHub branch as a deploy preview, or merge to `main` only after testing.

## What is NOT configured
- Payment checkout, shipping, tax collection, actual pricing or inventory are NOT integrated.
- Netlify Forms submissions require verified live Netlify form detection and notifications; test after deployment before accepting customer requests.
- User sign-in is not provided; 'My Projects' uses browser-local storage only.
- Artwork inspired by professional sports teams or media may require permission/licensing before commercial sale.

## Original photos
Download the complete ZIP for full-resolution WebP preview assets. The GitHub branch intentionally includes compressed sprite versions so it can be pushed and served efficiently.

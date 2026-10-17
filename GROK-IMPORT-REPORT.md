# Spider's Creations — Grok artwork import checkpoint
Date: October 17, 2026

## Sources
Connected Google Drive folder: [All_Bot_Zips](https://drive.google.com/drive/folders/1oxBAeFjaK-3t6lfgjrUozVjjrSi1guai).

Scanned **51 ZIP archives**. Examined image files and deduplicated byte-identical images with SHA-256. The archived source ZIPs remain in Google Drive; they were not deleted or modified.

## Published artwork
- 620 Hype Chains concepts: NFL, NBA, MLB, NHL and additional themed pendants
- 400 Jigsaw Puzzle images: themes organized from archive paths
- 202 Cutting Board designs: weddings, personalized families, BBQ, pets, outdoors, and more
- 300 Phone Case images: themes and product mockups

**Total: 1,522 distinct image files**, plus 563 exact duplicates omitted. Differences in files do not guarantee perceptual/visual uniqueness.

The entire compact catalog is **data/grok-designs.json**, retaining each item's sourceArchive and sourceFile. The additional manifest is **data/grok-provenance.json**. The display images were packed into **49 optimized WebP images** at **images/grok/** (including four category cover images). They are website thumbnails, not the original high-resolution artwork; obtain production source images from the Drive ZIP archives.

## Site navigation
- Main homepage has a category dropdown and photo tiles for Hype Chains, Puzzles, Balloons, Magnets, and the other offered products.
- Category pages show **their own** artwork and link to Shop with the product filter preset.
- The all-design Shop interleaves tumbler, coin, Hype Chain, puzzle, board, and phone-case designs rather than grouping all the sports at the top.
- Each selected Grok design can be added to the corresponding product's personalization form, with the source design ID and name saved in quote basket notes.
- Availability, physical materials, prices, commercial licensing and final production specifications are **not** independently confirmed by archive previews; the shop remains quote-first.

## Asset checksum
A temporary 20-part import archive was verified against SHA-256
`e58737c75b7bd9e64cd994c7ea165e8a3634edc10d3121271d0317928525f824`.
The importer is `scripts/import_grok_assets.py`, used with `.github/workflows/import-grok-assets.yml`.

## QA / next checks
JavaScript syntax checks passed for the updated source files. Confirm desktop and mobile navigation in a real browser and ensure Netlify is building the **main** branch. GitHub repository changes do not on their own confirm a successful live Netlify deployment.

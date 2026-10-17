#!/usr/bin/env python3
"""Static-site sanity checks. No production or Netlify readiness is implied."""
from pathlib import Path
import json, re, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def assert_true(test, message):
    if not test: errors.append(message)
def file(path):
    p=ROOT/path
    assert_true(p.exists(), f"Missing file {path}")
    return p
p=file("data/grok-designs.json")
if p.exists():
    payload=json.loads(p.read_text(encoding="utf-8"))
    entries=payload.get("designs",[])
    assert_true(len(entries)==1522,f"Expected 1,522 imported designs, found {len(entries)}")
    assert_true(len({e.get('id') for e in entries})==len(entries),"Duplicate design IDs")
    expected={"hypechains":620,"puzzles":400,"boards":202,"phone-cases":300}
    for kind,count in expected.items():
        found=sum(e.get("productCategory")==kind for e in entries)
        assert_true(found==count, f"{kind}: expected {count}, found {found}")
    for e in entries:
        sprite=e.get("sprite",{})
        path=sprite.get("src","")
        assert_true(path.startswith("images/grok/"),f"Invalid sprite path for {e.get('id')}")
        assert_true((ROOT/path).is_file(),f"Missing sprite: {path}")
        assert_true(all(isinstance(sprite.get(k),int) for k in ("cols","rows","x","y")),f"Bad sprite positions {e.get('id')}")
        if all(isinstance(sprite.get(k),int) for k in ("cols","rows","x","y")):
            assert_true(0<=sprite["x"]<sprite["cols"] and 0<=sprite["y"]<sprite["rows"],f"Out of bounds sprite {e.get('id')}")
    for kind in expected:file(f"images/grok/{kind}-cover.webp")
    assert_true(payload.get("duplicatesSkipped")==563,"Deduplication metadata changed without review")
    print(f"Verified {len(entries)} Grok design records and their image sheets")
else:errors.append("Design catalog not imported")
index=file("index.html")
shop=file("shop.html")
if index.exists():
    home=index.read_text(encoding="utf-8")
    assert_true('<select id="studio-search-field"' in home,"Homepage product selector missing")
    assert_true('<select id="studio-category-select"' in home,"Homepage category selector missing")
    assert_true('js/category-images.js' in home and 'js/studio.js' in home,"Homepage scripts missing")
if shop.exists():
    ss=shop.read_text(encoding="utf-8")
    assert_true('id="studio-shop-type"' in ss,"Shop type filter missing")
for path in ("store-data.js","js/studio-data.js","js/studio.js","js/studio-customize.js","js/shop-hub.js","js/collection.js","js/category-images.js"):
    assert_true((ROOT/path).is_file(),f"Required JS file missing: {path}")
for kind in ("hypechains","puzzles","balloons","phone-cases"):
    assert_true('"id":"'+kind+'"' in (ROOT/"js/studio-data.js").read_text(encoding="utf-8"),f"Missing product category {kind}")
# Verify local images linked in the category map exist; remote Unsplash images are not verified here.
images=(ROOT/"js/category-images.js").read_text(encoding="utf-8")
for match in re.findall(r'"(images/[^"]+\.(?:webp|jpg|jpeg|png))"',images):
    assert_true((ROOT/match).is_file(),f"Category image does not exist: {match}")
if errors:
    for e in errors:print("FAIL:",e,file=sys.stderr)
    raise SystemExit(1)
print("Homepage, shop, collections and Grok artwork static checks passed")

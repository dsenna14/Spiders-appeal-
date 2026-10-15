#!/usr/bin/env python3
"""Import the explicitly uploaded, verified Spider's Creations website release ZIP.

Run only for the site-owner-controlled release named 'spiders-site-assets'.
This replaces the preview branch's website files while preserving GitHub workflows.
"""
from __future__ import annotations
import json
import pathlib
import shutil
import sys
import zipfile

MAX_FILES = 6000
MAX_TOTAL_BYTES = 500_000_000
MAX_SINGLE_BYTES = 100_000_000
PROTECTED_TOP_LEVEL = {".git", ".github", "scripts"}

def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: import_full_site.py /path/to/Spiders-Creations-Website-COMPLETE.zip")

    archive = pathlib.Path(sys.argv[1]).resolve()
    workspace = pathlib.Path.cwd().resolve()
    if not archive.is_file():
        raise SystemExit("Website archive not found.")

    with zipfile.ZipFile(archive) as bundle:
        members = [item for item in bundle.infolist() if not item.is_dir()]
        if len(members) > MAX_FILES:
            raise SystemExit("Unexpectedly large archive file count.")
        total = sum(item.file_size for item in members)
        if total > MAX_TOTAL_BYTES or any(item.file_size > MAX_SINGLE_BYTES for item in members):
            raise SystemExit("Archive size exceeded permitted limits.")

        approved = []
        seen = set()
        for item in members:
            relative = pathlib.PurePosixPath(item.filename)
            parts = relative.parts
            if (
                not parts
                or relative.is_absolute()
                or any(part in ("", ".", "..") for part in parts)
                or "\\" in item.filename
                or ":" in item.filename
            ):
                raise SystemExit("Rejected unsafe archive path: " + item.filename)
            if parts[0] in PROTECTED_TOP_LEVEL:
                continue
            if item.filename in seen:
                raise SystemExit("Duplicate path in archive: " + item.filename)
            seen.add(item.filename)
            target = (workspace / pathlib.Path(*parts)).resolve()
            if not target.is_relative_to(workspace):
                raise SystemExit("Archive path escapes checkout: " + item.filename)
            file_mode = (item.external_attr >> 16) & 0o170000
            if file_mode == 0o120000:
                raise SystemExit("Symlinks not allowed: " + item.filename)
            approved.append((item, target))

        for item, target in approved:
            target.parent.mkdir(parents=True, exist_ok=True)
            with bundle.open(item) as src, target.open("wb") as dst:
                shutil.copyfileobj(src, dst, length=1024 * 1024)

    for path in ("index.html", "shop.html", "designs.html", "design.html", "customize.html", "netlify.toml", "data/designs.json"):
        if not (workspace / path).is_file():
            raise SystemExit("Required site file is missing: " + path)

    catalog = json.loads((workspace / "data/designs.json").read_text(encoding="utf-8"))
    thumbs = list((workspace / "assets/designs/thumb").glob("*.webp"))
    fulls = list((workspace / "assets/designs/full").glob("*.webp"))
    if not isinstance(catalog, list) or len(catalog) < 1000 or len(thumbs) < 1000 or len(fulls) < 1000:
        raise SystemExit(f"Design catalog validation failed: entries={len(catalog) if isinstance(catalog,list) else 'invalid'}, thumbs={len(thumbs)}, full={len(fulls)}")
    print(f"Imported {len(approved)} source files, {len(catalog)} catalog entries, {len(thumbs)} thumbnails and {len(fulls)} full images.")
    print("The branch still requires a Netlify deployment preview and form-submission checks.")

if __name__ == "__main__":
    main()

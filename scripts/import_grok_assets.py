#!/usr/bin/env python3
"""Import the verified Grok artwork ZIP staged as GitHub blobs. Safe paths only."""
from pathlib import Path
import hashlib, zipfile, io
ROOT=Path(__file__).resolve().parents[1]
PARTS=ROOT/".import-parts"
parts=[PARTS/f"asset-{i:03d}.part" for i in range(20)]
if not all(p.is_file() for p in parts): raise SystemExit("Missing one or more of the 20 staged artwork parts")
raw=b"".join(p.read_bytes() for p in parts)
sha=hashlib.sha256(raw).hexdigest()
expected="e58737c75b7bd9e64cd994c7ea165e8a3634edc10d3121271d0317928525f824"
if sha!=expected: raise SystemExit(f"Archive hash mismatch: {sha}")
with zipfile.ZipFile(io.BytesIO(raw)) as z:
    for info in z.infolist():
        name=info.filename
        p=Path(name)
        if info.is_dir():continue
        if (p.is_absolute() or ".." in p.parts
            or not (name.startswith("images/grok/") or name in ("data/grok-designs.json","data/grok-provenance.json"))
            or info.file_size>2_000_000):
            raise SystemExit(f"Unexpected archive member: {name}")
        target=ROOT/p;target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(z.read(info))
print(f"Imported {len(z.namelist())} verified Grok artwork assets")

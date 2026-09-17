#!/usr/bin/env python3
"""Stitch vertically scrolled viewport captures. usage: pngstitch.py out.png total_height chunk1.png:offsetY chunk2.png:offsetY ..."""
import sys
from pngcrop import read_png, write_png

out, total = sys.argv[1], int(sys.argv[2])
rows, W, BPP = [None] * total, None, None
for spec in sys.argv[3:]:
    path, offset = spec.rsplit(':', 1)
    w, h, bpp, chunk = read_png(path)
    if W is None:
        W, BPP = w, bpp
    for i, r in enumerate(chunk):
        y = int(offset) + i
        if 0 <= y < total and rows[y] is None:
            rows[y] = r if bpp == BPP else r
filled = [r if r is not None else bytearray(W * BPP) for r in rows]
write_png(out, W, total, BPP, filled)
print(out, W, total)

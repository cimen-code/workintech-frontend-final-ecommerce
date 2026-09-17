#!/usr/bin/env python3
"""Pure-python PNG crop (8-bit RGB/RGBA, non-interlaced). usage: pngcrop.py in.png out.png x y w h"""
import sys, zlib, struct

def read_png(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, idat, w = 8, b'', None
    while pos < len(data):
        ln = struct.unpack('>I', data[pos:pos+4])[0]; typ = data[pos+4:pos+8]; body = data[pos+8:pos+8+ln]; pos += 12 + ln
        if typ == b'IHDR':
            w, h, bd, ct, _, _, il = struct.unpack('>IIBBBBB', body)
            assert bd == 8 and il == 0 and ct in (2, 6), (bd, ct, il)
            bpp = 4 if ct == 6 else 3
        elif typ == b'IDAT': idat += body
    raw = zlib.decompress(idat); stride = w * bpp; rows = []; prev = bytearray(stride); i = 0
    for _ in range(h):
        f = raw[i]; line = bytearray(raw[i+1:i+1+stride]); i += 1 + stride
        if f == 1:
            for x in range(bpp, stride): line[x] = (line[x] + line[x-bpp]) & 255
        elif f == 2:
            for x in range(stride): line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride): line[x] = (line[x] + ((line[x-bpp] if x >= bpp else 0) + prev[x]) // 2) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x-bpp] if x >= bpp else 0; b = prev[x]; c = prev[x-bpp] if x >= bpp else 0
                p = a + b - c; pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else (b if pb <= pc else c))) & 255
        rows.append(line); prev = line
    return w, h, bpp, rows

def write_png(path, w, h, bpp, rows):
    raw = b''.join(b'\x00' + bytes(r) for r in rows)
    def chunk(t, b): return struct.pack('>I', len(b)) + t + b + struct.pack('>I', zlib.crc32(t + b) & 0xffffffff)
    ct = 6 if bpp == 4 else 2
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, ct, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

if __name__ == '__main__':
    src = sys.argv[1]; W, H, bpp, rows = read_png(src)
    jobs = sys.argv[2:]
    for k in range(0, len(jobs), 5):
        out, x, y, w, h = jobs[k], *map(int, jobs[k+1:k+5])
        w = min(w, W - x); h = min(h, H - y)
        write_png(out, w, h, bpp, [r[x*bpp:(x+w)*bpp] for r in rows[y:y+h]])
        print(out, w, h)

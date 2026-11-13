"""Generate poison-slime animation sheets: slime-{idle,run,attack,attack2,hit,die}.png (64x48 frames, facing left)."""
import math
from PIL import Image

FW, FH = 64, 48
OUT = '#13300e'; BASE = '#6fcf2c'; SHADE = '#3f9420'; DEEP = '#2b6a16'; HI = '#c9ff7c'; HI2 = '#a6ee52'
SPOT = '#8a3ad0'; SPOT2 = '#b46bff'; EYE = '#0e120a'; WHITE = '#ffffff'; MOUTH = '#2a0e2e'

def hexc(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def blob(img, cx, base, w, h, eye='open', mouth=None, flash=False, alpha=255, drip=0, lean=0.0):
    px = img.load()
    w *= 1.15; h *= 1.15
    top = base - h
    mask = set()
    for y in range(int(top), int(base) + 1):
        t = (base - y) / max(1, h)
        if t < 0 or t > 1: continue
        hw = (w / 2) * math.sqrt(max(0, 1 - t ** 2.2))
        if t < 0.06: hw = w / 2 - 1
        sh = lean * t * 6  # lean forward (to the left) at the top
        for x in range(int(cx - hw - sh), int(cx + hw - sh) + 1):
            if 0 <= x < FW and 0 <= y < FH: mask.add((x, y))
    for (x, y) in mask:
        edge = any((x + dx, y + dy) not in mask for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        t = (base - y) / max(1, h)
        rx = (x - cx) / max(1, w / 2)
        if edge: c = OUT
        elif t < 0.14 or rx > 0.55: c = DEEP if (t < 0.08 or rx > 0.78) else SHADE
        else: c = BASE
        if flash and not edge: c = '#e8ffd8'
        px[x, y] = hexc(c, alpha)
    if flash: return mask
    # toxic spots (inner bubbles)
    for (sx, sy, r, col) in ((0.25, 0.35, 2, SPOT), (-0.05, 0.22, 1, SPOT2), (0.45, 0.55, 1, SPOT), (-0.35, 0.18, 1, HI2)):
        bx, by = int(cx + sx * w / 2), int(base - sy * h)
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                if dx * dx + dy * dy <= r * r and (bx + dx, by + dy) in mask:
                    px[bx + dx, by + dy] = hexc(col, alpha)
    # highlight
    hx, hy = int(cx - w * 0.22 - lean * 3), int(top + h * 0.22)
    for (dx, dy) in ((0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (-1, 1), (0, 2)):
        if (hx + dx, hy + dy) in mask: px[hx + dx, hy + dy] = hexc(HI, alpha)
    if (hx + 4, hy - 1) in mask: px[hx + 4, hy - 1] = hexc(HI, alpha)
    # eyes (facing left)
    ey = int(top + h * 0.42)
    for ex in (int(cx - w * 0.30 - lean * 4), int(cx - w * 0.06 - lean * 4)):
        if eye == 'open':
            for dx in range(0, 3):
                for dy in range(0, 4):
                    if (ex + dx, ey + dy) in mask: px[ex + dx, ey + dy] = hexc(EYE, alpha)
            if (ex, ey) in mask: px[ex, ey] = hexc(WHITE, alpha)
            for dx in range(-1, 3):  # angry brow slanting down toward the centre
                by = ey - 2 + (1 if dx >= 1 else 0) * (1 if ex > cx - w * 0.2 else 0) - (1 if dx >= 1 else 0) * (1 if ex <= cx - w * 0.2 else 0)
                if (ex + dx, by) in mask: px[ex + dx, by] = hexc(OUT, alpha)
        elif eye == 'shut':
            for dx in range(0, 3):
                if (ex + dx, ey + 2) in mask: px[ex + dx, ey + 2] = hexc(EYE, alpha)
        elif eye == 'x':
            for d in range(3):
                for (a, b) in ((ex + d, ey + d), (ex + 2 - d, ey + d)):
                    if (a, b) in mask: px[a, b] = hexc(EYE, alpha)
    if mouth:
        mw, mh = mouth
        mx, my = int(cx - w * 0.22 - lean * 4), int(top + h * 0.66)
        for dx in range(mw):
            for dy in range(mh):
                if (mx + dx, my + dy) in mask: px[mx + dx, my + dy] = hexc(MOUTH, alpha)
        for dx in range(0, mw, 2):
            if (mx + dx, my) in mask: px[mx + dx, my] = hexc(WHITE, alpha)
    # drips
    for i in range(drip):
        dx = int(cx + (w / 2 - 3) * (1 if i % 2 else -0.8))
        dy = int(base - 2 + i * 2)
        if 0 <= dy < FH and 0 <= dx < FW: px[dx, dy] = hexc(BASE, alpha); px[dx, min(FH - 1, dy + 1)] = hexc(SHADE, alpha)
    return mask

def puddle(img, cx, base, w, alpha):
    px = img.load()
    for x in range(int(cx - w / 2), int(cx + w / 2) + 1):
        for y in (base, base - 1):
            if 0 <= x < FW:
                edge = x in (int(cx - w / 2), int(cx + w / 2)) or y == base - 1
                px[x, y] = hexc(OUT if edge else SHADE, alpha)

def glob(img, x, y, r=2):
    px = img.load()
    for dx in range(-r, r + 1):
        for dy in range(-r, r + 1):
            if dx * dx + dy * dy <= r * r and 0 <= x + dx < FW and 0 <= y + dy < FH:
                px[x + dx, y + dy] = hexc(OUT if dx * dx + dy * dy >= r * r - 1 else (HI if dx < 0 and dy < 0 else BASE))

def sheet(name, frames):
    im = Image.new('RGBA', (FW * len(frames), FH), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        fr = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); f(fr); im.paste(fr, (i * FW, 0))
    im.save(f'slime-{name}.png')

CX, B = 34, FH - 1
idle = [lambda fr, i=i: blob(fr, CX, B, 34 + 2 * math.sin(i / 8 * 2 * math.pi), 24 - 2 * math.sin(i / 8 * 2 * math.pi), drip=(i % 4 == 0) * 1) for i in range(8)]
hop = [(36, 20, 0), (38, 18, 0), (30, 28, 3), (28, 30, 7), (30, 28, 9), (32, 25, 6), (36, 21, 2), (38, 18, 0)]
run = [lambda fr, a=a: blob(fr, CX, B - a[2], a[0], a[1]) for a in hop]
lunge = [(36, 24, 0, 0, None), (40, 20, 0, 0, None), (42, 18, 2, 0, (4, 2)), (34, 26, -6, .35, (5, 3)), (30, 28, -12, .6, (6, 4)), (32, 27, -10, .5, (6, 3)), (36, 24, -4, .2, (4, 2)), (36, 24, 0, 0, None)]
attack = [lambda fr, a=a: blob(fr, CX + a[2], B, a[0], a[1], mouth=a[4], lean=a[3]) for a in lunge]
def spit(i):
    def f(fr):
        sw = [(34, 24), (36, 27), (38, 30), (40, 30), (32, 22), (34, 23), (35, 24), (34, 24)][i]
        blob(fr, CX, B, sw[0], sw[1], mouth=(6, 4) if 2 <= i <= 5 else None, eye='shut' if i in (1, 2) else 'open')
        if i >= 4: glob(fr, CX - 16 - (i - 4) * 5, B - 12 + (i - 4), 3 if i < 7 else 2)
    return f
attack2 = [spit(i) for i in range(8)]
hit = [lambda fr, i=i: blob(fr, CX + (3, 4, 2, 1)[i], B, (40, 42, 38, 36)[i], (20, 18, 22, 23)[i], eye='shut', flash=(i == 0)) for i in range(4)]
def melt(i):
    def f(fr):
        t = i / 9
        if i < 7:
            blob(fr, CX, B, 34 + i * 3, max(4, 24 - i * 3.2), eye='x', alpha=255, drip=0)
        puddle(fr, CX, B, 30 + i * 3, int(255 * (1 - max(0, t - 0.6) / 0.4)) if i >= 6 else 255)
        if 2 <= i <= 7:
            for k in range(3): glob(fr, CX - 10 + k * 10, B - 6 - (i - 2) * 3 - k * 2, 1)
    return f
die = [melt(i) for i in range(10)]

for n, f in (('idle', idle), ('run', run), ('attack', attack), ('attack2', attack2), ('hit', hit), ('die', die)): sheet(n, f)
print('ok')

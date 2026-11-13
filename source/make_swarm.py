"""Generate small flying swarm sprites (32x32 frames, facing left):
bee-{idle,run,attack,attack2,hit,die}.png and bat-{...}.png"""
import math
from PIL import Image

FW = FH = 32

def C(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

class F:
    def __init__(s): s.im = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); s.p = s.im.load()
    def px(s, x, y, c, a=255):
        x, y = int(round(x)), int(round(y))
        if 0 <= x < FW and 0 <= y < FH: s.p[x, y] = C(c, a)
    def ell(s, cx, cy, rx, ry, c, a=255):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x - cx) / max(.5, rx)) ** 2 + ((y - cy) / max(.5, ry)) ** 2 <= 1: s.px(x, y, c, a)
    def outline(s, col):
        src = s.im.copy(); P = src.load()
        for y in range(FH):
            for x in range(FW):
                if P[x, y][3] == 0 and any(0 <= x + dx < FW and 0 <= y + dy < FH and P[x + dx, y + dy][3] > 200 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    s.p[x, y] = C(col)
    def fade(s, a):
        for y in range(FH):
            for x in range(FW):
                r, g, b, al = s.p[x, y]
                if al: s.p[x, y] = (r, g, b, int(al * a))

# ---------------- BEE ----------------
def bee(fr, cx=17, cy=17, wing=0, tilt=0, sting=0, hurt=False, dead=False):
    # wings (behind), translucent
    wy = cy - 5 - (2 if wing == 0 else -1 if wing == 1 else 0)
    wr = (4, 2.2) if wing != 1 else (4.5, 1.4)
    fr.ell(cx + 1, wy, wr[0], wr[1], '#e8f6ff', 190); fr.ell(cx + 5, wy + 1, wr[0] - 1, wr[1] - .4, '#cfeaff', 170)
    fr.px(cx + 1, wy - 1, '#ffffff'); fr.px(cx + 4, wy, '#ffffff')
    # body
    body = '#ffd23a' if not hurt else '#fff3c0'
    for x in range(-6, 7):
        for y in range(-4, 5):
            if (x / 6.5) ** 2 + (y / 4.4) ** 2 <= 1:
                xx = cx + x + 1; yy = cy + y + (x * tilt) / 6
                stripe = x in (-1, 0, 3, 4) and not hurt
                c = '#1a1408' if stripe else (body if y < 2 else '#d99a12')
                fr.px(xx, yy, c)
    fr.px(cx - 1, cy - 3, '#fff6c0'); fr.px(cx, cy - 3, '#fff6c0')
    # stinger
    fr.px(cx + 8 + sting, cy + 1 + tilt, '#2a2010'); fr.px(cx + 9 + sting, cy + 1 + tilt, '#2a2010'); fr.px(cx + 10 + sting, cy + 1 + tilt, '#8a8070')
    # head (left)
    fr.ell(cx - 6, cy - tilt, 3, 3, '#1a1408')
    if dead:
        fr.px(cx - 7, cy - 1 - tilt, '#ffffff'); fr.px(cx - 6, cy - tilt, '#ffffff'); fr.px(cx - 8, cy + 1 - tilt, '#ffffff')
    else:
        fr.px(cx - 7, cy - 1 - tilt, '#ffffff'); fr.px(cx - 8, cy - 1 - tilt, '#ff4a3a')
    # antennae
    fr.px(cx - 7, cy - 4 - tilt, '#1a1408'); fr.px(cx - 8, cy - 5 - tilt, '#1a1408'); fr.px(cx - 5, cy - 4 - tilt, '#1a1408'); fr.px(cx - 4, cy - 6 - tilt, '#1a1408')
    fr.outline('#120c04')

def sheet(prefix, name, frames):
    im = Image.new('RGBA', (FW * len(frames), FH), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        fr = F(); f(fr); im.paste(fr.im, (i * FW, 0))
    im.save(f'{prefix}-{name}.png')

bob = lambda i, n: round(math.sin(i / n * 2 * math.pi) * 1.5)
sheet('bee', 'idle', [lambda fr, i=i: bee(fr, cy=17 + bob(i, 4), wing=i % 2) for i in range(4)])
sheet('bee', 'run', [lambda fr, i=i: bee(fr, cy=17 + bob(i, 4), wing=i % 2, tilt=-1) for i in range(4)])
dive = [(18, 15, 0, 0), (19, 14, 1, 1), (16, 18, -1, 2), (11, 20, -2, 3), (13, 19, -1, 1), (17, 17, 0, 0)]
sheet('bee', 'attack', [lambda fr, d=d, i=i: bee(fr, cx=d[0], cy=d[1], wing=i % 2, tilt=d[2], sting=d[3]) for i, d in enumerate(dive)])
sting = [(18, 17, 0, 0), (20, 16, 1, 0), (21, 16, 2, 2), (12, 18, -2, 4), (14, 18, -1, 2), (17, 17, 0, 0)]
sheet('bee', 'attack2', [lambda fr, d=d, i=i: bee(fr, cx=d[0], cy=d[1], wing=i % 2, tilt=d[2], sting=d[3]) for i, d in enumerate(sting)])
sheet('bee', 'hit', [lambda fr, i=i: bee(fr, cx=19 + (1 if i == 0 else 0), cy=16, wing=2, hurt=(i == 0)) for i in range(3)])
def bee_die(i):
    def f(fr):
        bee(fr, cx=17 + i, cy=14 + i * 2.6, wing=2, tilt=min(3, i), dead=True)
        if i >= 3: fr.fade(1 - (i - 3) / 4)
    return f
sheet('bee', 'die', [bee_die(i) for i in range(6)])

# ---------------- BAT ----------------
def bat(fr, cx=16, cy=15, wing=0, lunge=0, hurt=False, dead=False, mouth=False):
    body = '#2a1a2e' if not hurt else '#e8d0ff'; wingc = '#3e2448' if not hurt else '#f0e0ff'; bone = '#170c1a'
    # wings: 0 up, 1 mid, 2 down
    tip_y = {0: -9, 1: -2, 2: 6}[wing]; mid_y = {0: -6, 1: -1, 2: 3}[wing]
    for side in (-1, 1):
        pts = [(cx + side * 3, cy - 1), (cx + side * 7, cy + mid_y), (cx + side * 12, cy + tip_y)]
        # fill membrane between body and tip with scanlines
        for t in range(0, 101, 4):
            tt = t / 100
            x0 = cx + side * (3 + 9 * tt); y_top = cy - 1 + (tip_y + 1) * tt
            y_bot = cy + 3 + (tip_y + (6 if wing != 2 else 2)) * tt * .55
            for y in range(int(min(y_top, y_bot)), int(max(y_top, y_bot)) + 1):
                fr.px(x0, y, wingc)
        for (x, y) in pts: fr.px(x, y, bone)
        for t in range(0, 11):
            tt = t / 10; fr.px(cx + side * (3 + 9 * tt), cy - 1 + (tip_y + 1) * tt, bone)
        # scalloped trailing edge: carve small notches out of the membrane
        for k in (5, 8, 11):
            tt = (k - 3) / 9; yb = int(cy + 3 + (tip_y + (6 if wing != 2 else 2)) * tt * .55)
            xk = int(cx + side * k)
            if 0 <= xk < FW and 0 <= yb < FH: fr.p[xk, yb] = (0, 0, 0, 0)
    fr.ell(cx + lunge, cy + 1, 3, 4, body)
    # ears + head
    fr.ell(cx - 1 + lunge, cy - 3, 2.5, 2.2, body)
    fr.px(cx - 3 + lunge, cy - 6, body); fr.px(cx - 3 + lunge, cy - 5, body); fr.px(cx + 1 + lunge, cy - 6, body); fr.px(cx + 1 + lunge, cy - 5, body)
    if dead:
        fr.px(cx - 2 + lunge, cy - 3, '#aa8899'); fr.px(cx + lunge, cy - 3, '#aa8899')
    else:
        fr.px(cx - 2 + lunge, cy - 3, '#ff3a3a'); fr.px(cx + lunge, cy - 3, '#ff3a3a')
    if mouth:
        fr.px(cx - 2 + lunge, cy - 1, '#ffffff'); fr.px(cx + lunge, cy - 1, '#ffffff'); fr.px(cx - 1 + lunge, cy - 1, '#6a0a14')
    fr.px(cx - 2 + lunge, cy + 5, bone); fr.px(cx + 1 + lunge, cy + 5, bone)
    fr.outline('#0a0510')

sheet('bat', 'idle', [lambda fr, i=i: bat(fr, cy=15 + (1 if i in (1, 2) else 0), wing=(0, 1, 2, 1)[i]) for i in range(4)])
sheet('bat', 'run', [lambda fr, i=i: bat(fr, cy=15, wing=(0, 1, 2, 1)[i]) for i in range(4)])
batk = [(16, 14, 0, 0, False), (17, 12, 0, 1, False), (15, 15, 2, -2, True), (14, 17, 1, -3, True), (15, 16, 0, -2, True), (16, 15, 1, 0, False)]
sheet('bat', 'attack', [lambda fr, d=d: bat(fr, cx=d[0], cy=d[1], wing=d[2], lunge=d[3], mouth=d[4]) for d in batk])
sheet('bat', 'attack2', [lambda fr, d=d: bat(fr, cx=d[0], cy=d[1] + 1, wing=d[2], lunge=d[3], mouth=d[4]) for d in batk])
sheet('bat', 'hit', [lambda fr, i=i: bat(fr, cx=18 - (0 if i else -1), cy=14, wing=1, hurt=(i == 0)) for i in range(3)])
def bat_die(i):
    def f(fr):
        bat(fr, cx=16 + i, cy=13 + i * 3, wing=(1, 2, 1, 2, 2, 2)[i], dead=True)
        if i >= 3: fr.fade(1 - (i - 3) / 4)
    return f
sheet('bat', 'die', [bat_die(i) for i in range(6)])

if __name__ == '__main__':
    rows = []
    for pre in ('bee', 'bat'):
        for n in ('idle', 'run', 'attack', 'attack2', 'hit', 'die'): rows.append(Image.open(f'{pre}-{n}.png'))
    W = max(r.width for r in rows); pv = Image.new('RGBA', (W, FH * len(rows)), (70, 90, 110, 255))
    for k, r in enumerate(rows): pv.alpha_composite(r, (0, k * FH))
    pv.resize((W * 4, FH * len(rows) * 4), Image.NEAREST).save('swarm_preview.png'); print('ok')

# Draws the 25 set/unique item icons at 32x32 (2x the detail of the base icons) and
# composites them into items.png at 2x scale (64x64 cells).
from PIL import Image, ImageDraw
import json, math, sys

N = 32
OUT = '#120e18'

def hexrgb(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
def shade(c, f):
    r, g, b, a = c
    if f > 0: return (int(r + (255 - r) * f), int(g + (255 - g) * f), int(b + (255 - b) * f), a)
    return (int(r * (1 + f)), int(g * (1 + f)), int(b * (1 + f)), a)

class Icon:
    def __init__(s):
        s.im = Image.new('RGBA', (N, N), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
        s.glow = []  # pixels that should not be bevelled
    def poly(s, pts, c): s.d.polygon([(x, y) for x, y in pts], fill=hexrgb(c))
    def rect(s, x0, y0, x1, y1, c): s.d.rectangle([x0, y0, x1, y1], fill=hexrgb(c))
    def ell(s, x0, y0, x1, y1, c): s.d.ellipse([x0, y0, x1, y1], fill=hexrgb(c))
    def line(s, pts, c, w=1): s.d.line([(x, y) for x, y in pts], fill=hexrgb(c), width=w)
    def px(s, x, y, c):
        if 0 <= x < N and 0 <= y < N: s.im.putpixel((int(x), int(y)), hexrgb(c))
    def gpx(s, x, y, c): s.px(x, y, c); s.glow.append((int(x), int(y)))
    def finish(s, bevel=.22):
        im = s.im; W, H = im.size; src = im.copy(); P = src.load(); Q = im.load(); G = set(s.glow)
        op = lambda x, y: 0 <= x < W and 0 <= y < H and P[x, y][3] > 0
        for y in range(H):
            for x in range(W):
                if not op(x, y) or (x, y) in G: continue
                c = P[x, y]
                if not op(x - 1, y) or not op(x, y - 1): Q[x, y] = shade(c, bevel)
                elif not op(x + 1, y) or not op(x, y + 1): Q[x, y] = shade(c, -bevel)
        out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); O = out.load(); R = im.load()
        for y in range(H):
            for x in range(W):
                if R[x, y][3]: O[x, y] = R[x, y]
                elif any(op(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): O[x, y] = hexrgb(OUT)
        return out

def sparkle(I, x, y, c='#ffffff'):
    I.gpx(x, y, c);
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)): I.gpx(x + dx, y + dy, c if (dx + dy) % 2 else c)

# ---------- palettes
K = dict(st='#c9d1db', sm='#8f9aa8', sd='#5a6474', bl='#2f5fc0', bd='#1c3a80', bh='#6f9cf0', go='#e8b840', gd='#a87a20', gh='#fff0a0')
RP = dict(k='#211b2c', km='#3a3150', kh='#5a4e78', bo='#e8dcc0', bm='#b8a888', vi='#9a4dff', vh='#d6b8ff', vd='#5a1fa0')
D = dict(r='#c0283a', rd='#7a1020', rh='#ff6a5a', sc='#4a0a14', go='#e8b840', gd='#a87a20', gh='#fff0a0', em='#ff9a3a', eh='#ffe08a', iv='#efe4c8')
A = dict(gh='#fff0b0', n='#1a2150', nm='#2a3578', nh='#3f4fa8', cy='#4fd8ff', ch='#c8f6ff', pk='#ff6fd8', go='#ffd36b', gd='#b8862a', st='#ffffff')

ICONS = {}
def icon(key):
    def deco(f): ICONS[key] = f; return f
    return deco

# ===== KNIGHT =====
@icon('knight_helm')
def _(I):
    c = K
    I.poly([(10, 4), (13, 1), (16, 0), (19, 1), (22, 4)], c['bl']); I.poly([(14, 2), (16, 0), (18, 2), (16, 6)], c['bh'])  # plume base
    I.poly([(4, 30), (4, 12), (7, 6), (12, 3), (20, 3), (25, 6), (28, 12), (28, 30)], c['st'])
    I.rect(16, 4, 27, 29, c['sm']); I.rect(5, 13, 27, 15, c['sd']); I.rect(5, 18, 27, 19, c['sd'])
    I.rect(6, 14, 26, 14, '#14181f'); I.rect(15, 4, 17, 29, c['go']); I.rect(16, 4, 16, 29, c['gh'])
    I.rect(7, 18, 25, 19, c['go'])
    for y in (22, 25, 28):
        for x in (8, 11, 21, 24): I.px(x, y, c['sd'])
    I.gpx(9, 14, '#6fd0ff'); I.gpx(23, 14, '#6fd0ff')
    sparkle(I, 9, 7)
@icon('knight_plate')
def _(I):
    c = K
    I.poly([(3, 6), (9, 3), (12, 6), (20, 6), (23, 3), (29, 6), (28, 14), (26, 28), (16, 31), (6, 28), (4, 14)], c['st'])
    I.poly([(16, 6), (20, 6), (23, 3), (29, 6), (28, 14), (26, 28), (16, 31)], c['sm'])
    I.poly([(11, 9), (21, 9), (22, 26), (16, 29), (10, 26)], c['bl']); I.poly([(16, 9), (21, 9), (22, 26), (16, 29)], c['bd'])
    I.rect(15, 11, 17, 25, c['go']); I.rect(12, 15, 20, 17, c['go']); I.gpx(16, 16, c['gh'])
    I.rect(3, 6, 9, 7, c['go']); I.rect(23, 6, 29, 7, c['go'])
    sparkle(I, 7, 11)
@icon('knight_gauntlets')
def _(I):
    c = K
    I.poly([(5, 31), (4, 22), (8, 18), (21, 18), (26, 22), (27, 31)], c['bl']); I.poly([(16, 18), (21, 18), (26, 22), (27, 31), (16, 31)], c['bd']); I.rect(4, 24, 27, 25, c['go'])
    I.poly([(6, 19), (5, 11), (9, 8), (23, 8), (26, 12), (25, 19)], c['st']); I.poly([(16, 8), (23, 8), (26, 12), (25, 19), (16, 19)], c['sm'])
    for i, x in enumerate((8, 12, 16, 20)):
        I.rect(x, 3 + (i % 2), x + 3, 9, c['st'] if i < 2 else c['sm']); I.rect(x, 6 + (i % 2), x + 3, 6 + (i % 2), c['sd']); I.px(x + 1, 4 + (i % 2), '#ffffff')
    I.poly([(5, 15), (2, 11), (4, 7), (8, 9), (9, 14)], c['st']); I.rect(3, 9, 6, 9, c['sd'])
    I.rect(6, 14, 25, 15, c['sd']); I.poly([(12, 11), (19, 11), (17, 16), (14, 16)], c['go']); I.gpx(15, 12, c['gh'])
    for x in (7, 24): I.gpx(x, 21, c['gh'])
    sparkle(I, 10, 10)

@icon('knight_sabatons')
def _(I):
    c = K
    I.poly([(8, 2), (19, 2), (19, 18), (29, 22), (30, 28), (6, 28), (6, 18)], c['st'])
    I.poly([(14, 2), (19, 2), (19, 18), (29, 22), (30, 28), (14, 28)], c['sm'])
    for y in (7, 12, 17): I.rect(7, y, 19, y, c['sd'])
    I.rect(6, 28, 30, 30, c['sd']); I.rect(7, 3, 18, 4, c['go']); I.poly([(19, 19), (27, 22), (27, 24), (19, 22)], c['go'])
    I.rect(5, 20, 9, 23, c['bl']); sparkle(I, 10, 9)
@icon('knight_shield')
def _(I):
    c = K
    I.poly([(3, 3), (29, 3), (29, 14), (25, 24), (16, 31), (7, 24), (3, 14)], c['go'])
    I.poly([(5, 5), (27, 5), (27, 14), (23, 23), (16, 29), (9, 23), (5, 14)], c['bl'])
    I.poly([(16, 5), (27, 5), (27, 14), (23, 23), (16, 29)], c['bd'])
    I.rect(14, 6, 18, 27, c['st']); I.rect(7, 12, 25, 16, c['st']); I.rect(15, 7, 17, 26, c['sm']); I.rect(8, 13, 24, 15, c['sm'])
    I.ell(12, 10, 20, 18, c['go']); I.ell(14, 12, 18, 16, c['gh'])
    for p in ((5, 5), (27, 5), (16, 29)): I.gpx(*p, c['gh'])
    sparkle(I, 9, 8)

# ===== REAPER =====
@icon('reaper_cowl')
def _(I):
    c = RP
    I.poly([(16, 0), (25, 5), (29, 14), (30, 30), (2, 30), (3, 14), (7, 5)], c['km'])
    I.poly([(16, 0), (25, 5), (29, 14), (30, 30), (16, 30)], c['k'])
    I.poly([(9, 11), (23, 11), (25, 20), (22, 29), (10, 29), (7, 20)], '#07050c')
    I.ell(10, 12, 22, 25, c['bo']); I.rect(12, 23, 20, 27, c['bo']); I.rect(16, 13, 21, 26, c['bm'])
    I.rect(11, 16, 14, 19, '#07050c'); I.rect(18, 16, 21, 19, '#07050c'); I.poly([(15, 20), (17, 20), (16, 22)], '#07050c')
    for x in (13, 15, 17, 19): I.px(x, 25, '#07050c')
    I.gpx(12, 17, c['vh']); I.gpx(13, 17, c['vi']); I.gpx(19, 17, c['vh']); I.gpx(20, 17, c['vi'])
    for x, y in ((4, 28), (8, 30), (24, 30), (28, 27)): I.gpx(x, y, c['vi'])
@icon('reaper_shroud')
def _(I):
    c = RP
    I.poly([(9, 1), (23, 1), (27, 8), (30, 30), (26, 26), (22, 31), (18, 26), (14, 31), (10, 26), (6, 31), (2, 26), (5, 8)], c['km'])
    I.poly([(16, 1), (23, 1), (27, 8), (30, 30), (26, 26), (22, 31), (18, 26), (16, 28)], c['k'])
    I.rect(9, 1, 23, 4, c['kh']); I.poly([(14, 4), (18, 4), (17, 9), (15, 9)], c['bo'])
    for x in range(3, 30, 2): I.gpx(x, 26 + (x * 7) % 4, c['vi'] if x % 4 else c['vh'])
    I.line([(8, 8), (6, 22)], c['kh']); I.line([(20, 8), (23, 22)], '#15111d')
@icon('bone_bracers')
def _(I):
    c = RP
    I.poly([(4, 3), (28, 3), (26, 29), (6, 29)], c['k']); I.poly([(16, 3), (28, 3), (26, 29), (16, 29)], '#16121e')
    I.rect(4, 3, 28, 5, c['kh']); I.rect(6, 27, 26, 29, c['kh'])
    for i, y in enumerate((8, 21)):
        for x in range(7, 26, 3): I.poly([(x, y), (x + 2, y), (x + 1, y + 4 if i == 0 else y - 4)], c['bo'])
    I.ell(10, 10, 22, 21, c['bo']); I.ell(16, 10, 22, 21, c['bm']); I.rect(12, 18, 20, 22, c['bo'])
    I.rect(12, 13, 14, 15, '#07050c'); I.rect(18, 13, 20, 15, '#07050c'); I.poly([(15, 16), (17, 16), (16, 18)], '#07050c')
    for x in (13, 15, 17, 19): I.px(x, 21, '#07050c')
    I.gpx(13, 14, c['vh']); I.gpx(19, 14, c['vh'])
    for x, y in ((5, 12), (27, 18), (6, 24), (26, 7)): I.gpx(x, y, c['vi'])

@icon('soul_chain')
def _(I):
    c = RP
    for i in range(13):
        a = math.pi * (.05 + .9 * i / 12); x = 16 + math.cos(a) * 13; y = 3 + math.sin(a) * 13
        I.ell(x - 1, y - 1, x + 1, y + 1, '#6a5a8a' if i % 2 else '#b8a8d8')
    I.poly([(16, 14), (24, 20), (20, 30), (12, 30), (8, 20)], c['vd'])
    I.poly([(16, 16), (22, 20), (19, 28), (13, 28), (10, 20)], c['vi']); I.poly([(16, 16), (22, 20), (19, 28), (16, 28)], '#7a35d8')
    I.ell(12, 18, 20, 26, c['bo']); I.rect(13, 21, 14, 22, '#07050c'); I.rect(18, 21, 19, 22, '#07050c'); I.rect(15, 25, 17, 25, '#07050c')
    I.gpx(13, 21, c['vh']); I.gpx(18, 21, c['vh']); sparkle(I, 24, 15, c['vh'])
@icon('reaper_scythe')
def _(I):
    c = RP
    I.line([(6, 31), (21, 3)], '#3a2a3a', 3); I.line([(7, 30), (21, 4)], '#6a4a5a', 1)
    for t in (.25, .55, .8): x = 6 + 15 * (1 - t); y = 31 - 28 * (1 - t); I.rect(x - 1, y, x + 1, y + 1, c['bo'])
    I.poly([(19, 2), (23, 4), (26, 9), (28, 16), (27, 22), (24, 14), (19, 8), (12, 5), (6, 6), (11, 2)], '#d8dde6')
    I.poly([(24, 14), (27, 22), (28, 16), (26, 9)], '#9aa2ae'); I.line([(8, 5), (14, 4), (20, 7), (25, 13), (27, 21)], c['vh'])
    for x, y in ((9, 4), (16, 5), (22, 9), (26, 15)): I.gpx(x, y, c['vi'])
    I.ell(18, 1, 24, 7, c['bo']); I.gpx(20, 4, c['vi']); I.gpx(22, 4, c['vi']); sparkle(I, 28, 20, c['vh'])

# ===== DRAGON SLAYER =====
@icon('dragon_helm')
def _(I):
    c = D
    I.poly([(5, 10), (1, 1), (4, 2), (9, 8)], c['iv']); I.poly([(27, 10), (31, 1), (28, 2), (23, 8)], c['iv'])
    I.poly([(4, 30), (4, 13), (8, 7), (16, 5), (24, 7), (28, 13), (28, 30)], c['r'])
    I.poly([(16, 5), (24, 7), (28, 13), (28, 30), (16, 30)], c['rd'])
    for y in range(9, 29, 3):
        for x in range(6 + (y % 2) * 2, 27, 4): I.px(x, y, c['sc']); I.px(x + 1, y, c['rh'] if x < 16 else c['r'])
    I.poly([(8, 15), (24, 15), (22, 20), (10, 20)], '#1a0606'); I.gpx(11, 17, c['em']); I.gpx(12, 17, c['eh']); I.gpx(20, 17, c['em']); I.gpx(21, 17, c['eh'])
    I.poly([(13, 20), (19, 20), (17, 30), (15, 30)], c['go']); I.rect(4, 13, 28, 14, c['go']); I.rect(16, 5, 16, 13, c['gh'])
    for x in (8, 12, 20, 24): I.poly([(x, 30), (x + 2, 30), (x + 1, 27)], c['iv'])
    sparkle(I, 9, 10, c['gh'])
@icon('dragon_mail')
def _(I):
    c = D
    I.poly([(3, 7), (9, 2), (13, 5), (19, 5), (23, 2), (29, 7), (28, 16), (26, 28), (16, 31), (6, 28), (4, 16)], c['r'])
    I.poly([(16, 5), (19, 5), (23, 2), (29, 7), (28, 16), (26, 28), (16, 31)], c['rd'])
    for row, y in enumerate(range(9, 29, 4)):
        off = (row % 2) * 3
        for x in range(5 + off, 27, 6):
            I.ell(x, y, x + 5, y + 5, c['rh'] if x < 14 else c['r'] if x < 20 else c['rd']); I.d.arc([x, y, x + 5, y + 5], 20, 160, fill=hexrgb(c['sc']))
    I.poly([(9, 2), (13, 5), (19, 5), (23, 2), (21, 8), (16, 10), (11, 8)], c['go']); I.line([(11, 7), (16, 9), (21, 7)], c['gh'])
    I.ell(13, 13, 19, 19, c['go']); I.ell(14, 14, 18, 18, c['em']); I.gpx(15, 15, c['eh'])
    I.rect(3, 7, 7, 8, c['go']); I.rect(25, 7, 29, 8, c['go']); sparkle(I, 7, 12, c['gh'])

@icon('wyrm_boots')
def _(I):
    c = D
    I.poly([(8, 2), (19, 2), (19, 17), (27, 21), (29, 27), (6, 27), (6, 17)], c['r'])
    I.poly([(14, 2), (19, 2), (19, 17), (27, 21), (29, 27), (14, 27)], c['rd'])
    for y in range(5, 25, 3):
        for x in range(7 + (y % 2) * 2, 19, 3): I.px(x, y, c['sc'])
    I.rect(6, 27, 29, 29, '#3a1a10'); I.rect(7, 3, 18, 4, c['go'])
    for x in (24, 27, 30): I.poly([(x - 2, 27), (x, 27), (x + 1, 31)], c['iv'])
    I.poly([(19, 7), (25, 4), (21, 10)], c['iv']); sparkle(I, 10, 8, c['gh'])
@icon('dragon_heart')
def _(I):
    c = D
    for i in range(11):
        a = math.pi * (.1 + .8 * i / 10); x = 16 + math.cos(a) * 12; y = 2 + math.sin(a) * 10
        I.ell(x - 1.4, y - 1.4, x + 1.4, y + 1.4, c['go'] if i % 2 else c['gd'])
    I.poly([(6, 14), (10, 10), (14, 12), (16, 15), (18, 12), (22, 10), (26, 14), (25, 20), (16, 30), (7, 20)], c['gd'])
    I.ell(8, 12, 16, 20, c['r']); I.ell(16, 12, 24, 20, c['r']); I.poly([(8, 17), (24, 17), (16, 27)], c['r'])
    I.ell(16, 12, 24, 20, c['rd']); I.poly([(16, 17), (24, 17), (16, 27)], c['rd'])
    I.ell(11, 14, 15, 18, c['rh']); I.gpx(12, 15, '#ffd0c8'); I.gpx(16, 19, c['em']); I.gpx(16, 20, c['eh']); I.gpx(15, 20, c['em'])
    for p in ((6, 14), (26, 14), (16, 29)): I.poly([(p[0] - 1, p[1]), (p[0] + 1, p[1]), (p[0], p[1] + 3 if p[1] > 20 else p[1] - 3)], c['iv'])
    sparkle(I, 24, 22, c['eh'])
@icon('dragonfang')
def _(I):
    c = D
    I.poly([(22, 1), (27, 0), (29, 2), (28, 6), (14, 22), (10, 18)], '#e6e9f0'); I.poly([(27, 0), (29, 2), (28, 6), (14, 22), (12, 20)], '#9aa2ae')
    for t in range(3): x = 25 - t * 4; y = 5 + t * 4.5; I.poly([(x, y), (x + 4, y + 1), (x - 1, y + 3)], '#e6e9f0')
    I.line([(26, 2), (12, 19)], c['r']); I.gpx(23, 6, c['em']); I.gpx(19, 11, c['eh']); I.gpx(16, 15, c['em'])
    I.poly([(5, 15), (9, 14), (19, 24), (21, 28), (17, 27), (8, 19)], c['go']); I.poly([(6, 15), (3, 11), (8, 13)], c['iv']); I.poly([(18, 25), (23, 25), (19, 29)], c['iv'])
    I.ell(10, 17, 16, 23, c['r']); I.gpx(12, 19, c['eh'])
    I.line([(11, 23), (5, 29)], c['rd'], 3); I.line([(10, 23), (5, 28)], c['r'], 1)
    I.ell(1, 27, 7, 32, c['go']); I.gpx(3, 29, c['em']); sparkle(I, 25, 9, c['eh'])

# ===== ASTRAL RONIN (original set) =====
def stars(I, pts):
    for x, y in pts: I.gpx(x, y, '#ffffff')
@icon('astral_kabuto')
def _(I):
    c = A
    I.ell(5, 0, 27, 15, c['go']); I.ell(7, 1, 25, 13, c['gh']); I.d.ellipse([7, -4, 25, 10], fill=(0, 0, 0, 0))
    I.poly([(14, 8), (18, 8), (17, 12), (15, 12)], c['gd'])
    I.ell(5, 11, 27, 31, c['n']); I.rect(5, 21, 27, 30, c['n']); I.ell(16, 11, 27, 31, '#121838'); I.rect(16, 21, 27, 30, '#121838')
    for y in (21, 25): I.rect(2, y, 30, y + 2, c['nm']); I.rect(16, y, 30, y + 2, c['n']); I.rect(2, y + 2, 30, y + 2, c['go'])
    I.rect(2, 29, 30, 30, c['nm'])
    I.ell(13, 13, 19, 19, c['cy']); I.ell(14, 14, 17, 17, c['ch']); I.gpx(15, 15, '#ffffff')
    stars(I, [(8, 16), (11, 19), (22, 15), (25, 19), (20, 20), (9, 27), (24, 27)]); sparkle(I, 27, 4, '#fff0b0')

@icon('starweave_haori')
def _(I):
    c = A
    I.poly([(2, 10), (10, 3), (14, 6), (18, 6), (22, 3), (30, 10), (27, 16), (25, 14), (25, 30), (7, 30), (7, 14), (5, 16)], c['n'])
    I.poly([(16, 6), (18, 6), (22, 3), (30, 10), (27, 16), (25, 14), (25, 30), (16, 30)], '#121838')
    I.poly([(10, 3), (14, 6), (16, 14), (18, 6), (22, 3), (20, 3), (16, 10), (12, 3)], c['go'])
    I.line([(16, 12), (16, 30)], c['gd'])
    for x0 in (7, 18):
        for i in range(6):
            x = x0 + i; y = 30 - i * 3; I.px(x, y, c['pk'] if i % 2 else c['cy'])
    I.rect(2, 10, 6, 12, c['go']); I.rect(26, 10, 30, 12, c['go'])
    stars(I, [(10, 12), (13, 19), (21, 16), (11, 25), (22, 24)]); I.gpx(19, 21, c['ch']); I.gpx(9, 18, c['ch'])
@icon('comet_sandals')
def _(I):
    c = A
    for i in range(10):
        x = 1 + i * 1.6; y = 4 + i * .9; I.gpx(x, y, c['pk'] if i % 3 == 0 else c['cy']); I.gpx(x + 1, y + 1, c['ch'] if i > 5 else c['cy'])
    I.poly([(10, 3), (21, 3), (21, 17), (28, 20), (30, 27), (8, 27), (8, 16)], c['n']); I.poly([(16, 3), (21, 3), (21, 17), (28, 20), (30, 27), (16, 27)], '#121838')
    I.rect(8, 27, 30, 29, c['go']); I.rect(9, 3, 21, 5, c['go']); I.rect(8, 15, 21, 16, c['go'])
    I.poly([(21, 7), (27, 3), (29, 6), (23, 10)], c['go']); I.poly([(21, 10), (26, 8), (27, 10), (22, 12)], c['gd'])
    I.ell(11, 8, 17, 14, c['cy']); I.ell(12, 9, 15, 12, c['ch']); I.gpx(13, 10, '#ffffff')
    stars(I, [(11, 20), (15, 23), (19, 19), (24, 24), (13, 25)]); sparkle(I, 4, 5, c['ch'])

@icon('nebula_obi')
def _(I):
    c = A
    I.rect(1, 11, 30, 21, c['n'])
    cols = ['#2a3578', '#4a3a9a', '#8a4ad0', c['pk'], '#8a4ad0', '#3f6ad0', c['cy'], '#3f6ad0', '#2a3578']
    for x in range(1, 31):
        I.rect(x, 13, x, 19, cols[min(len(cols) - 1, int(x / 31 * len(cols)))])
    I.rect(1, 11, 30, 12, c['go']); I.rect(1, 20, 30, 21, c['go'])
    I.poly([(16, 16), (11, 9), (9, 13), (12, 16)], c['go']); I.poly([(16, 16), (21, 23), (24, 20), (20, 16)], c['go'])
    I.poly([(16, 16), (10, 26), (13, 27)], c['gd']); I.ell(13, 13, 19, 19, c['go']); I.ell(14, 14, 18, 18, c['ch']); I.gpx(16, 16, '#ffffff')
    stars(I, [(4, 15), (7, 18), (24, 14), (27, 17), (21, 18)])
@icon('starfall_katana')
def _(I):
    c = A
    I.poly([(25, 1), (28, 0), (29, 2), (12, 21), (10, 19)], '#e8f4ff'); I.poly([(28, 0), (29, 2), (12, 21), (11, 20)], '#8fb0d0')
    I.line([(26, 2), (11, 18)], c['cy'])
    for t in (.15, .35, .55, .75): I.gpx(26 - 15 * t, 2 + 17 * t, '#ffffff')
    I.ell(7, 17, 15, 25, c['go']); I.ell(9, 19, 13, 23, c['n']); I.gpx(11, 21, c['pk'])
    I.line([(9, 23), (3, 29)], c['n'], 3)
    for i in range(4): I.px(8 - i * 1.5, 24 + i * 1.5, c['go'])
    I.ell(1, 28, 5, 32, c['gd'])
    for x, y in ((22, 9), (18, 4), (27, 8), (14, 10)): sparkle(I, x, y, c['ch']) if (x + y) % 3 == 0 else I.gpx(x, y, c['pk'])

# ===== UNIQUE PHYSICAL ITEMS =====
@icon('berserker_band')
def _(I):
    I.ell(4, 6, 28, 28, '#5a1a1a'); I.ell(9, 11, 23, 23, (0, 0, 0, 0) and '#000000'); I.d.ellipse([9, 11, 23, 23], fill=(0, 0, 0, 0))
    for i in range(8):
        a = i / 8 * 6.283; x = 16 + math.cos(a) * 12; y = 17 + math.sin(a) * 11
        I.poly([(x - 1.5, y), (x + 1.5, y), (16 + math.cos(a) * 16, 17 + math.sin(a) * 15)], '#c0c8d0')
    I.d.ellipse([4, 6, 28, 28], outline=hexrgb('#a02a2a'), width=3); I.d.ellipse([6, 8, 26, 26], outline=hexrgb('#d84a3a'), width=1)
    for a in (0, 2, 4):
        x = 16 + math.cos(a) * 10.5; y = 17 + math.sin(a) * 10; I.gpx(x, y, '#ffb347')
    sparkle(I, 24, 9, '#ffd0a0')
@icon('iron_knuckles')
def _(I):
    I.rect(3, 9, 29, 17, '#9aa2ac'); I.rect(3, 13, 29, 17, '#6a7280')
    for x in (3, 10, 17, 24): I.ell(x, 7, x + 6, 15, '#c0c8d0'); I.d.ellipse([x + 2, 9, x + 4, 13], fill=(0, 0, 0, 0)); I.poly([(x + 1, 8), (x + 3, 2), (x + 5, 8)], '#e6e9f0')
    I.poly([(6, 17), (26, 17), (23, 28), (9, 28)], '#6a7280'); I.d.polygon([(10, 19), (22, 19), (20, 25), (12, 25)], fill=(0, 0, 0, 0))
    for x in (6, 13, 20, 27): I.gpx(x, 4, '#ffffff')
    I.rect(4, 17, 28, 17, '#e8b840')
@icon('serrated_pendant')
def _(I):
    for i in range(11):
        a = math.pi * (.1 + .8 * i / 10); x = 16 + math.cos(a) * 12; y = 2 + math.sin(a) * 10
        I.px(x, y, '#8a5a2b'); I.px(x, y + 1, '#5e3a1a')
    I.poly([(12, 11), (20, 11), (18, 30), (16, 31), (14, 30)], '#e6e9f0'); I.poly([(16, 11), (20, 11), (18, 30), (16, 31)], '#9aa2ae')
    for y in range(13, 29, 3): I.poly([(12 + (y - 11) * .1, y), (9 + (y - 11) * .1, y + 1), (12.5 + (y - 11) * .1, y + 2)], '#e6e9f0'); I.poly([(20 - (y - 11) * .1, y), (23 - (y - 11) * .1, y + 1), (19.5 - (y - 11) * .1, y + 2)], '#9aa2ae')
    I.rect(12, 9, 20, 11, '#8a5a2b'); I.gpx(15, 16, '#ffffff'); I.gpx(16, 22, '#c0303a'); I.gpx(16, 23, '#e0404a'); I.gpx(17, 26, '#c0303a')
@icon('assassin_sash')
def _(I):
    I.rect(1, 12, 30, 19, '#262030'); I.rect(1, 12, 30, 13, '#3a3248'); I.rect(1, 18, 30, 19, '#16121e')
    I.poly([(18, 12), (24, 20), (22, 30), (19, 30), (20, 21)], '#3a3248'); I.poly([(14, 19), (10, 30), (13, 30), (17, 19)], '#262030')
    for x0 in (4, 26):
        I.poly([(x0, 4), (x0 + 2, 4), (x0 + 2, 14), (x0 + 1, 16), (x0, 14)], '#e6e9f0'); I.rect(x0 - 1, 14, x0 + 3, 15, '#c0303a'); I.rect(x0, 16, x0 + 2, 22, '#5e3a1a')
    I.ell(13, 11, 19, 19, '#c0303a'); I.ell(14, 12, 18, 16, '#ff6b5e'); I.gpx(15, 13, '#ffffff')
@icon('lucky_purse')
def _(I):
    I.poly([(8, 12), (24, 12), (28, 22), (25, 29), (7, 29), (4, 22)], '#8a5a2b'); I.poly([(16, 12), (24, 12), (28, 22), (25, 29), (16, 29)], '#6a4220')
    I.poly([(10, 9), (22, 9), (24, 12), (8, 12)], '#b07a43'); I.rect(9, 11, 23, 12, '#e8b840')
    I.ell(12, 3, 20, 10, '#e8b840'); I.ell(14, 5, 18, 8, '#fff0a0'); I.rect(15, 5, 16, 8, '#a87a20')
    for x, y in ((3, 25), (23, 24), (27, 27)): I.ell(x, y, x + 5, y + 4, '#e8b840'); I.gpx(x + 2, y + 1, '#fff0a0')
    I.ell(13, 17, 19, 23, '#e8b840'); I.rect(15, 18, 16, 22, '#a87a20'); sparkle(I, 7, 6, '#fff0a0')

# ===== ELEMENTAL SWORDS =====
def esword(I, bl, bd, core, glow, hilt, gem, extra):
    I.poly([(26, 1), (30, 2), (29, 5), (12, 22), (9, 19)], bl); I.poly([(30, 2), (29, 5), (12, 22), (11, 21)], bd)
    I.line([(28, 3), (11, 20)], core)
    extra(I)
    I.poly([(5, 17), (8, 15), (16, 23), (14, 26)], hilt); I.gpx(10, 20, gem); I.gpx(11, 21, gem)
    I.line([(10, 22), (4, 28)], '#3a2a1a', 3); I.line([(9, 22), (4, 27)], '#6a4a2a', 1)
    I.ell(1, 27, 6, 32, hilt); I.gpx(3, 29, gem)
@icon('emberbrand')
def _(I):
    def ex(I):
        for i, (x, y) in enumerate(((27, 6), (24, 9), (21, 12), (18, 15), (15, 18))):
            I.poly([(x, y), (x + 3, y - 4 - i % 2), (x + 2, y + 1)], '#ff6a1a' if i % 2 else '#ffb347'); I.gpx(x + 1, y - 2, '#fff3b0')
        sparkle(I, 29, 9, '#ffe08a')
    esword(I, '#ffd0a0', '#c8402f', '#ff6a1a', '#ffb347', '#a8301a', '#ffe08a', ex)
@icon('tidecaller')
def _(I):
    def ex(I):
        for t in range(6):
            x = 26 - t * 3; y = 4 + t * 3; I.gpx(x - 2, y + 3, '#8fd3ff' if t % 2 else '#3aa0ff'); I.gpx(x - 3, y + 4, '#ffffff' if t % 3 == 0 else '#bfe9ff')
        for x, y in ((6, 9), (9, 6), (4, 13)): I.ell(x - 1, y - 1, x + 1, y + 1, '#8fd3ff'); I.gpx(x, y - 1, '#ffffff')
    esword(I, '#d8f4ff', '#1f62b0', '#3aa0ff', '#8fd3ff', '#2a5a8a', '#bfe9ff', ex)
@icon('stormfang')
def _(I):
    def ex(I):
        pts = [(30, 1), (27, 5), (29, 7), (24, 11), (26, 13), (20, 17), (22, 19), (16, 23)]
        I.line(pts, '#fff6b0'); 
        for x, y in pts[1:-1]: I.gpx(x, y, '#ffffff')
        sparkle(I, 6, 8, '#ffe866'); I.gpx(9, 4, '#ffe866'); I.gpx(3, 12, '#fff6b0')
    esword(I, '#e8eef6', '#5a6070', '#f2d24b', '#ffe866', '#3a3a5a', '#ffe866', ex)

# ===== CLEAVER & ORB =====
@icon('butcher_cleaver')
def _(I):
    u = (.707, -.707); n = (-.707, -.707)
    P = lambda bx, by, a, w: (bx + u[0] * a + n[0] * w, by + u[1] * a + n[1] * w)
    B = (15, 26)
    I.poly([P(*B, 0, 0), P(*B, 18, 0), P(*B, 19.5, 2), P(*B, 18, 10), P(*B, 0, 10)], '#d9dee6')
    I.poly([P(*B, 0, 8), P(*B, 18, 8), P(*B, 18, 10), P(*B, 0, 10)], '#8e96a3')
    I.line([P(*B, 0.5, 0.6), P(*B, 18.5, 0.6)], '#ffffff')
    I.poly([P(*B, 0, -0.8), P(*B, 18, -0.8), P(*B, 18, 1.2), P(*B, 0, 1.2)], '#f4f7fb')
    hx, hy = P(*B, 14.5, 6.5); I.ell(hx - 2, hy - 2, hx + 2, hy + 2, '#2a2e36'); I.ell(hx - 1, hy - 1, hx + 1, hy + 1, '#4a505c')
    for a, w in ((5, 3), (9, 2), (12, 4)):
        x, y = P(*B, a, w); I.gpx(x, y, '#c0303a'); I.gpx(x + 1, y, '#8a1a22')
    I.poly([P(*B, -1, 6.5), P(*B, 0.5, 6.5), P(*B, 0.5, 10.5), P(*B, -1, 10.5)], '#5a5f6a')
    I.poly([P(*B, -1, 7), P(*B, -11, 7), P(*B, -11, 10), P(*B, -1, 10)], '#8a5a2b')
    I.line([P(*B, -1, 8.5), P(*B, -10, 8.5)], '#b07a43')
    for a in (-3, -7): x, y = P(*B, a, 8.5); I.px(x, y, '#e8b840')
    sparkle(I, 27, 24, '#ffffff')
@icon('explosion_orb')
def _(I):
    I.poly([(9, 26), (23, 26), (25, 31), (7, 31)], '#8a5a2b'); I.rect(8, 26, 24, 27, '#e8b840')
    for x0 in (8, 22): I.poly([(x0, 26), (x0 + 2, 26), (x0 + 3, 20), (x0 + 1, 21)], '#e8b840')
    I.ell(6, 3, 26, 23, '#7a1a0a'); I.ell(7, 4, 25, 22, '#c8401a'); I.ell(9, 6, 23, 20, '#ff7a1a'); I.ell(12, 9, 20, 17, '#ffc23a'); I.ell(14, 11, 18, 15, '#fff6c8')
    for (x, y) in ((10, 8), (21, 10), (11, 18), (20, 19), (16, 6)):
        I.gpx(x, y, '#fff2b0')
    I.line([(16, 13), (11, 8)], '#fff6c8'); I.line([(16, 13), (22, 9)], '#ffe08a'); I.line([(16, 13), (21, 19)], '#ffe08a'); I.line([(16, 13), (10, 17)], '#fff6c8')
    I.gpx(10, 7, '#ffffff'); I.gpx(11, 6, '#ffffff'); I.gpx(9, 8, '#ffffff')
    sparkle(I, 28, 5, '#ffd36b'); sparkle(I, 3, 12, '#ff9a3a'); I.gpx(27, 16, '#ffb347')

# ===== NEW SHIELDS =====
@icon('tower_shield')
def _(I):
    I.rect(5, 1, 27, 30, '#3a3e48'); I.rect(6, 2, 26, 29, '#7f8aa0'); I.rect(16, 2, 26, 29, '#5a6274'); I.rect(6, 2, 8, 29, '#c8d0dc')
    for y in (8, 16, 24): I.rect(6, y, 26, y, '#3a3e48')
    for x, y in ((8, 4), (24, 4), (8, 27), (24, 27), (8, 12), (24, 12), (8, 20), (24, 20)): I.gpx(x, y, '#e8eef6')
    I.rect(13, 9, 19, 22, '#e8b840'); I.rect(14, 10, 18, 21, '#a83a2a'); I.rect(15, 11, 17, 20, '#e8b840'); I.rect(12, 14, 20, 16, '#e8b840')
    I.poly([(5, 1), (27, 1), (25, 0), (7, 0)], '#c8d0dc')
@icon('thorn_buckler')
def _(I):
    I.ell(5, 5, 27, 27, '#4a2a1a'); I.ell(7, 7, 25, 25, '#7a4a2a'); I.ell(9, 9, 23, 23, '#5a3a20')
    for k in range(12):
        a = k / 12 * 6.283; x = 16 + math.cos(a) * 11; y = 16 + math.sin(a) * 11; tx = 16 + math.cos(a) * 16; ty = 16 + math.sin(a) * 16
        I.poly([(x + math.sin(a) * 1.6, y - math.cos(a) * 1.6), (tx, ty), (x - math.sin(a) * 1.6, y + math.cos(a) * 1.6)], '#c8d0dc'); I.gpx(round(tx), round(ty), '#ffffff')
    I.ell(12, 12, 20, 20, '#8a92a2'); I.ell(13, 13, 19, 19, '#c8d0dc'); I.gpx(14, 14, '#ffffff'); I.gpx(19, 21, '#c0303a'); I.gpx(20, 20, '#e0404a')
@icon('mirror_aegis')
def _(I):
    I.poly([(4, 3), (28, 3), (28, 15), (24, 24), (16, 31), (8, 24), (4, 15)], '#8a8f9c')
    I.poly([(6, 5), (26, 5), (26, 15), (22, 23), (16, 29), (10, 23), (6, 15)], '#d8dde6')
    I.poly([(8, 7), (24, 7), (24, 15), (21, 21), (16, 26), (11, 21), (8, 15)], '#7fb8d8')
    I.poly([(8, 7), (16, 7), (16, 26), (11, 21), (8, 15)], '#a8dcf4')
    for k in range(4): I.line([(10 + k * 3, 8), (8 + k * 3, 13)], '#ffffff')
    I.line([(18, 17), (22, 11)], '#e8f8ff'); sparkle(I, 21, 19, '#ffffff'); sparkle(I, 27, 2, '#e8f8ff')
    I.rect(14, 2, 18, 4, '#e8b840'); I.gpx(16, 3, '#fff0a0')
@icon('ember_heater')
def _(I):
    I.poly([(4, 4), (28, 4), (28, 12), (25, 21), (16, 30), (7, 21), (4, 12)], '#3a1a0a')
    I.poly([(6, 6), (26, 6), (26, 12), (23, 20), (16, 27), (9, 20), (6, 12)], '#a8301a')
    I.poly([(16, 6), (26, 6), (26, 12), (23, 20), (16, 27)], '#7a2010')
    I.rect(6, 6, 26, 7, '#e8b840')
    for i, (x, y) in enumerate(((16, 21), (12, 16), (20, 16), (16, 12))):
        I.poly([(x - 3, y + 3), (x, y - 4 - i % 2), (x + 3, y + 3)], '#ff8a2a'); I.poly([(x - 1, y + 3), (x, y - 1), (x + 1, y + 3)], '#ffe08a')
    I.gpx(16, 9, '#fff3b0'); sparkle(I, 28, 2, '#ffb347'); I.gpx(3, 27, '#ff8a2a')

if __name__ == '__main__':
    ORDER = ['knight_helm', 'knight_plate', 'knight_gauntlets', 'knight_sabatons', 'knight_shield',
             'reaper_cowl', 'reaper_shroud', 'bone_bracers', 'soul_chain', 'reaper_scythe',
             'dragon_helm', 'dragon_mail', 'wyrm_boots', 'dragon_heart', 'dragonfang',
             'astral_kabuto', 'starweave_haori', 'comet_sandals', 'nebula_obi', 'starfall_katana',
             'berserker_band', 'iron_knuckles', 'serrated_pendant', 'assassin_sash', 'lucky_purse', 'emberbrand', 'tidecaller', 'stormfang', 'butcher_cleaver', 'explosion_orb', 'tower_shield', 'thorn_buckler', 'mirror_aegis', 'ember_heater']
    base = Image.open('items.png').convert('RGBA'); cols, rows = 8, 10
    atlas = Image.new('RGBA', (cols * 64, rows * 64), (0, 0, 0, 0)); atlas.alpha_composite(base, (0, 0))
    idx = {}; tops = {}
    for n, k in enumerate(ORDER):
        I = Icon(); ICONS[k](I); im = I.finish()
        i = 43 + n; idx[k] = i
        bb = im.getbbox(); tops[k] = (bb[1] if bb else 0) * 2
        atlas.alpha_composite(im.resize((64, 64), Image.NEAREST), ((i % cols) * 64, (i // cols) * 64))
    atlas.save('items.png'); json.dump({'idx': idx, 'tops': tops}, open('set_items.json', 'w'))
    pv = Image.new('RGBA', (5 * 136, 6 * 136), (30, 40, 46, 255))
    for n, k in enumerate(ORDER):
        i = idx[k]; cell = atlas.crop(((i % cols) * 64, (i // cols) * 64, (i % cols) * 64 + 64, (i // cols) * 64 + 64)).resize((128, 128), Image.NEAREST)
        pv.alpha_composite(cell, ((n % 5) * 136 + 4, (n // 5) * 136 + 4))
    pv.save('set_items_pv.png'); print('ok', len(idx))

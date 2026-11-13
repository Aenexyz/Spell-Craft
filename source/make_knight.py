"""Turn the reference knight into a clean pixel sprite and a 10-frame idle/march loop (knight-sheet.png)."""
import math, sys
from PIL import Image
SRC, OUT = sys.argv[1], sys.argv[2]
im = Image.open(SRC).convert('RGB'); W, H = im.size
TW = 62; TH = round(H * TW / W)
small = im.resize((TW, TH), Image.BOX).quantize(colors=64, method=Image.MAXCOVERAGE, dither=Image.NONE).convert('RGBA')
p = small.load(); bg = (22, 23, 29)
def near(c, t=11): return abs(c[0]-bg[0]) + abs(c[1]-bg[1]) + abs(c[2]-bg[2]) < t
# flood-fill the background from the edges
seen = set(); st = [(x, 0) for x in range(TW)] + [(x, TH-1) for x in range(TW)] + [(0, y) for y in range(TH)] + [(TW-1, y) for y in range(TH)]
while st:
    x, y = st.pop()
    if (x, y) in seen or not (0 <= x < TW and 0 <= y < TH): continue
    seen.add((x, y))
    if near(p[x, y][:3]):
        p[x, y] = (0, 0, 0, 0); st += [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]
small = small.crop(small.getbbox()); W2, H2 = small.size
src = small.load()
# part masks: left shield / right shield / body, legs split at the waist line
LS, RS = int(W2 * .33), int(W2 * .66); LEG = int(H2 * .64); MID = W2 // 2
def part(x, y):
    if x < LS and y < int(H2 * .76): return 'ls'
    if x >= RS and y < int(H2 * .76): return 'rs'
    if y >= LEG: return 'll' if x < MID else 'rl'
    return 'body'
PAD = 3; FW, FH = W2 + PAD * 2, H2 + PAD * 2; N = 10
sheet = Image.new('RGBA', (FW * N, FH), (0, 0, 0, 0))
for i in range(N):
    t = i / N * 2 * math.pi
    off = {'body': (0, round(-1 * (0.5 - 0.5 * math.cos(t * 2)))),  # breathing bob, twice per loop
           'ls': (0, round(1.6 * math.sin(t + .6)) - 1), 'rs': (0, round(1.6 * math.sin(t + .6 + math.pi)) - 1),
           'll': (0, -1 if math.sin(t) > .55 else 0), 'rl': (0, -1 if math.sin(t) < -.55 else 0)}
    fr = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); fp = fr.load()
    fr.paste(small, (PAD, PAD)); fp = fr.load()  # base layer fills any gaps left by moved parts
    for layer in ('ll', 'rl', 'body', 'ls', 'rs'):
        for y in range(H2):
            for x in range(W2):
                c = src[x, y]
                if c[3] == 0 or part(x, y) != layer: continue
                dx, dy = off[layer]; fp[x + PAD + dx, y + PAD + dy] = c
    sheet.paste(fr, (i * FW, 0))
sheet.save(OUT); print('frame', FW, FH, 'sprite', W2, H2)

from PIL import Image
import json, math

O = '#1b1820'
G = {}
G['helm'] = [
"...oooooo...",
".ooaccaaaoo.",
"oaacaaaaaabo",
"oacaaaaaaabo",
"oaaaaaaaaabo",
"oooooooooooo",
"oaao.oo.oabo",
"oaaaaaaaaabo",
"oaaaooooaabo",
".oao....oao.",
".ooo....ooo.",
]
G['plume'] = [
".......ddd..",
"......ddddd.",
".....dddo...",
"....oddo....",
] + G['helm']
G['crown'] = [
"f..........f",
"fo........of",
"fo.d.dd.d.of",
".fodddddddof",
] + G['helm'][1:]
G['hood'] = [
"....oooo....",
"...oaaaao...",
"..oaaacaao..",
".oaaacaaaao.",
".oaaooooobo.",
"oaao.....abo",
"oaao.f.f.abo",
"oaao.....abo",
"oaaoooooaabo",
"oaaaaaaaaabo",
"oooooooooooo",
]
G['pads'] = [
"..oooooooo..",
".oaccaaaabo.",
"oacaaaaaaabo",
"oaaaaaaaaabo",
"oddddddddddo",
"oaaaaaaaaabo",
".oaaaaaaabo.",
"..oddddddo..",
"...oooooo...",
]
G['cape'] = [
"..oooooooo..",
"..odddddao..",
".oaaaaaaabo.",
".oaaaaaaabo.",
".oacaaaaabo.",
"oaacaaaaaabo",
"oaacaaaaaabo",
"oaaaaaaaaabo",
"oaaaaaaaaabo",
"oaaaaaaaaabo",
"oaaaaaaaaabo",
"oaoaaoaaoabo",
"oo.oo.oo.ooo",
]
G['chest'] = [
".oo......oo.",
"oaao....oabo",
"oaaaooooaabo",
"oacaaaaaaabo",
"oacaaddaaabo",
"oaaaaddaaabo",
"oaaaaaaaaabo",
".oaaaaaaabo.",
".oaaaaaaabo.",
".oddddddddo.",
".oaaaaaaabo.",
".oooooooooo.",
]
G['glove'] = [
".oooooo...",
"oacacaao..",
"oacacaao..",
"oaaaaaaoo.",
"oaaaaaaaco",
"oaaaaaaabo",
".oaaaaabo.",
".oddddddo.",
".oaaaaaao.",
".oaaaaaao.",
".oooooooo.",
]
G['spikeglove'] = ["f.f.f.....", "o.o.o....."] + G['glove'][1:]
G['boot'] = [
"..oooooo....",
"..oaacao....",
"..oddddo....",
"..oaaaao....",
"..oaaaao....",
"..oaaaao....",
"..oaaaaaooo.",
".oaaaaaaaaao",
".oaaaaaaaabo",
".oooooooooo.",
]
G['sword'] = ["....oo...."] + ["...ocao..."] * 9 + [".oddddddo.", "...oeeo...", "...oeeo...", "...oddo...", "....oo...."]
G['dagger'] = ["....oo...."] + ["...ocao..."] * 5 + [".oddddddo.", "...oeeo...", "...oeeo...", "...oddo...", "....oo...."]
G['axe'] = [
"....ooo....",
".oo.oeo.oo.",
"oaaooeooaao",
"oacaoeoacao",
"oacaoeoacao",
"oacaoeoacao",
"oaaooeooaao",
".oo.oeo.oo.",
] + ["....oeo...."] * 6 + ["....ooo...."]
G['staff'] = ["...ooo...", "..occao..", ".ocaaabo.", ".oaaabbo.", "..obbbo..", "...odo..."] + ["...oeo..."] * 8 + ["...odo...", "....o...."]
G['wand'] = ["....o....", "...oco...", "..ocaao..", "..oaabo..", "...obo...", "...odo..."] + ["...oeo..."] * 6 + ["...odo...", "....o...."]
G['crook'] = [".o.......o.", "odo.ooo.odo", "odooccaoodo", ".odoaaaodo.", "..odaabdo..", "...odddo...", "....odo...."] + ["....oeo...."] * 7 + ["....odo....", ".....o....."]
G['spear'] = ["..o..", ".oco.", ".oco.", "occao", ".ooo."] + [".oeo."] * 10 + [".ooo."]
G['kite'] = [
"oooooooooooo",
"oaaaadaaaabo",
"oacaadaaaabo",
"oacaadaaaabo",
"odddddddddbo",
"oaaaadaaaabo",
".oaaadaaabo.",
".oaaadaaabo.",
"..oaadaabo..",
"..oaadaabo..",
"...oadabo...",
"....oabo....",
".....oo.....",
]
G['pendant'] = [
"o........o",
".d......d.",
"..d....d..",
"...d..d...",
"....dd....",
"...oooo...",
"..oacbbo..",
"..oaabbo..",
"...oabo...",
"....oo....",
]
G['amulet'] = ["o..........o", ".d........d.", "..d......d..", "...d....d...", "....oddo....", ".ooodacdooo.", "oeeedaabdeeo", ".oeedabbdeo.", "..oodbbdoo..", "....oddo....", ".....oo....."]
G['lantern'] = [
"...oooo...",
"...o..o...",
"..oooooo..",
".oddddddo.",
".oeccccbo.",
".oecffcbo.",
".oecffcbo.",
".oeccccbo.",
".oddddddo.",
"..oooooo..",
]
G['totem'] = [
"..oooooo..",
".oaaaaaao.",
"oaooaaooao",
"oaoddaodao",
"oaaaaaaabo",
".oaaooaao.",
".oaoaaoao.",
"..oaaaao..",
"...oeeo...",
"...oeeo...",
"...oooo...",
]
G['belt'] = [
"oooooooooooooo",
"oaaaaoddddoaao",
"oaaaaod..doaao",
"oaaaaoddddoaao",
"oooooooooooooo",
]

def prog(kind, pal):
    g = [['.'] * 16 for _ in range(16)]
    def put(x, y, c):
        if 0 <= x < 16 and 0 <= y < 16: g[y][x] = c
    if kind == 'bow':
        for y in range(1, 15):
            t = (y - 7.5) / 6.5
            x = round(9 - 5 * (1 - t * t))
            put(x - 1, y, 'o'); put(x, y, 'e'); put(x + 1, y, 'o')
            put(11, y, 'f')
        put(9, 0, 'o'); put(9, 15, 'o'); put(11, 0, 'o'); put(11, 15, 'o')
        for y in (7, 8): put(3, y, 'd'); put(4, y, 'd')
    elif kind == 'buckler':
        for y in range(16):
            for x in range(16):
                d = math.hypot(x - 7.5, y - 7.5)
                if d < 6.6: put(x, y, 'o')
                if d < 5.8: put(x, y, 'd')
                if d < 4.8: put(x, y, 'a' if (x + y) % 5 else 'b')
                if d < 1.8: put(x, y, 'c')
        for (x, y) in [(2, 2), (13, 2), (2, 13), (13, 13), (7, 0), (8, 0), (0, 7), (0, 8), (15, 7), (15, 8), (7, 15), (8, 15)]: put(x, y, 'f')
    elif kind == 'torc':
        for y in range(16):
            for x in range(16):
                d = math.hypot(x - 7.5, y - 8)
                ang = math.degrees(math.atan2(y - 8, x - 7.5))
                if 4.2 < d < 7 and not (-120 < ang < -60): put(x, y, 'o')
                if 4.9 < d < 6.3 and not (-118 < ang < -62): put(x, y, 'a' if y > 8 else 'c')
        for x in (4, 5): put(x, 2, 'd')
        for x in (10, 11): put(x, 2, 'd')
    elif kind == 'potion':
        for y in range(16):
            for x in range(16):
                d = math.hypot(x - 7.5, y - 9.5)
                if d < 5.8: put(x, y, 'o')
                if d < 4.9: put(x, y, 'g' if y >= 9 else 'h')
        for y in range(2, 5):
            for x in range(6, 10): put(x, y, 'o')
            for x in range(7, 9): put(x, y, 'h')
        for x in range(5, 11): put(x, 1, 'o')
        for x in range(6, 10): put(x, 1, 'e')
        put(5, 8, 'c'); put(5, 9, 'c'); put(6, 7, 'c')
    return [''.join(r) for r in g]

steel = {'a': '#a7b0ba', 'b': '#626b76', 'c': '#e6ebf0', 'd': '#d0a43a', 'e': '#6b4423', 'f': '#f1ead6'}
gold = {'a': '#d8a93a', 'b': '#9b7424', 'c': '#ffe28a', 'd': '#fff0b0', 'e': '#6b4423', 'f': '#f1ead6'}
leather = {'a': '#8a5a2b', 'b': '#5e3a1a', 'c': '#b07a43', 'd': '#d0a43a', 'e': '#3a2410'}
def P(base, **kw):
    p = dict(base); p.update(kw); return p
def cape(a, b, c): return P(steel, a=a, b=b, c=c, d='#d0a43a')
def gem(a, b, c): return P(gold, a=a, b=b, c=c, d='#d8a93a')
def potion(col, hi): return {'g': col, 'h': '#2a2f3a', 'e': '#8a5a2b', 'c': hi}

ITEMS = {
 'iron_helm': ('helm', P(steel, a='#949ca5', b='#59606a', c='#d5dbe1'), 'helm'),
 'mystic_hood': ('hood', {'a': '#3f4f8a', 'b': '#27325c', 'c': '#6d7fc4', 'f': '#9fe8ff'}, 'hood'),
 'gold_helm': ('crown', gold, 'crown'),
 'plumed_helm': ('plume', P(steel, d='#c8402f'), 'plume'),
 'steel_pauldrons': ('pads', P(steel, d='#626b76'), 'pads'),
 'gilded_pauldrons': ('pads', gold, 'pads'),
 'crimson_cape': ('cape', cape('#b02c34', '#6e1a22', '#e05a5f'), 'cape'),
 'azure_cape': ('cape', cape('#2d6fc0', '#1b4580', '#6aa6ea'), 'cape'),
 'shadow_cape': ('cape', cape('#3d2d58', '#22172f', '#6a5590'), 'cape'),
 'white_cape': ('cape', cape('#e9e6dc', '#b0aa98', '#ffffff'), 'cape'),
 'steel_cuirass': ('chest', P(steel, d='#d0a43a'), 'chest'),
 'leather_vest': ('chest', leather, 'chest'),
 'royal_armor': ('chest', P(steel, a='#3a5bb0', b='#233b78', c='#6d8fe0', d='#e0b84a'), 'chest'),
 'iron_gauntlets': ('glove', P(steel, d='#626b76'), 'glove'),
 'spiked_gauntlets': ('spikeglove', P(steel, a='#5f646d', b='#3a3e45', c='#8a919b', d='#8a5a2b', f='#e6ebf0'), 'spikeglove'),
 'leather_boots': ('boot', P(leather, a='#7a4e26', b='#52331a', c='#a87444'), 'boot'),
 'golden_greaves': ('boot', gold, 'boot'),
 'steel_sword': ('sword', P(steel, a='#b9c3cd', c='#f2f6fa', d='#d8a93a', e='#3a2a5a'), 'weapon'),
 'frost_blade': ('sword', P(steel, a='#6cc4f2', c='#e8fbff', d='#5aa0d8', e='#2d4a6e'), 'weapon'),
 'battle_axe': ('axe', P(steel, e='#6b4423'), 'weapon'),
 'war_spear': ('spear', P(steel, e='#8a5a2b'), 'weapon'),
 'hunter_bow': ('bow', {'e': '#8a5a2b', 'f': '#f1ead6', 'd': '#d0a43a'}, 'weapon'),
 'dagger': ('dagger', P(steel, a='#9aa3ad', d='#6a3a8e', e='#2a1a2a'), 'weapon'),
 'kite_shield': ('kite', {'a': '#2d5fae', 'b': '#1b3d75', 'c': '#5f8fd8', 'd': '#d8a93a'}, 'shield'),
 'spiked_shield': ('buckler', {'a': '#7a7f88', 'b': '#666b74', 'c': '#d8a93a', 'd': '#4a4f58', 'f': '#e6ebf0'}, 'shield'),
 'ruby_pendant': ('pendant', gem('#d0263a', '#7a1020', '#ff8a96'), 'pendant'),
 'amber_pendant': ('pendant', gem('#f2b232', '#a8700f', '#ffe08a'), 'pendant'),
 'sapphire_pendant': ('pendant', gem('#2f6ad8', '#163a80', '#8ab4ff'), 'pendant'),
 'gold_torc': ('torc', gold, 'torc'),
 'lantern': ('lantern', {'d': '#3a3e45', 'e': '#5a5f68', 'c': '#ffd84a', 'f': '#fff6c0', 'b': '#c9902a'}, 'lantern'),
 'grim_totem': ('totem', {'a': '#cfc6ad', 'b': '#8f8670', 'd': '#c8402f', 'e': '#5a3a1e'}, 'totem'),
 'leather_belt': ('belt', P(leather, a='#7a4e26'), 'belt'),
 'red_potion': ('potion', potion('#d83a3a', '#ff9a9a'), None),
 'blue_potion': ('potion', potion('#3a7ad8', '#9ac4ff'), None),
 'green_potion': ('potion', potion('#3ac25a', '#a8f0b8'), None),
 'purple_potion': ('potion', potion('#9a4ad8', '#d8a8ff'), None),
 'starter_sword': ('sword', P(steel, a='#aab3bd', c='#e6eaef', d='#8a6a3a', e='#5a3a1e'), 'weapon'),
 'phoenix_amulet': ('amulet', {'a': '#ff6a2a', 'b': '#a8301a', 'c': '#ffe08a', 'd': '#d8a93a', 'e': '#ff9a3a'}, 'pendant'),
 'ember_staff': ('staff', {'a': '#ff7b3a', 'b': '#c8402f', 'c': '#ffe08a', 'd': '#d8a93a', 'e': '#6b4423'}, 'weapon'),
 'frost_wand': ('wand', {'a': '#6cc4f2', 'b': '#2f6ad8', 'c': '#e8fbff', 'd': '#c0c8d0', 'e': '#d8d2c0'}, 'weapon'),
 'archmage_staff': ('crook', {'a': '#9a4ad8', 'b': '#5b2a9a', 'c': '#e8c8ff', 'd': '#d8a93a', 'e': '#3a2a5a'}, 'weapon'),
}
idx = json.load(open('items.json'))['idx']; idx['starter_sword'] = 36; idx['ember_staff'] = 37; idx['frost_wand'] = 38; idx['archmage_staff'] = 39; idx['phoenix_amulet'] = 40
atlas = Image.new('RGBA', (8 * 64, 6 * 64), (0, 0, 0, 0))
look = {}
def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
for key, (shape, pal, kind) in ITEMS.items():
    grid = G[shape] if shape in G else prog(shape, pal)
    w = max(len(r) for r in grid); h = len(grid)
    cell = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    ox = (16 - w) // 2; oy = (16 - h) // 2 if shape not in ('sword', 'dagger', 'axe', 'spear', 'staff', 'wand', 'crook') else 16 - h
    for y, row in enumerate(grid):
        for x, ch in enumerate(row.ljust(w, '.')):
            if ch == '.': continue
            col = O if ch == 'o' else pal.get(ch)
            if not col: continue
            cell.putpixel((ox + x, oy + y), hexrgb(col))
    big = cell.resize((64, 64), Image.NEAREST)
    i = idx[key]; atlas.alpha_composite(big, ((i % 8) * 64, (i // 8) * 64))
    if kind: look[key] = {'t': kind, 'a': pal.get('a', pal.get('e')), 'b': pal.get('b', '#333'), 'c': pal.get('c', '#fff'), 'd': pal.get('d', '#d0a43a'), 'f': pal.get('f', '#fff')}
atlas.save('items.png')
json.dump(look, open('item_look.json', 'w'))
pv = Image.new('RGBA', atlas.size, (36, 52, 56, 255)); pv.alpha_composite(atlas); pv.resize((atlas.width, atlas.height)).save('items_new_pv.png')
print('ok', len(look))

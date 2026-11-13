# SpellCraft

A linear card-fusion RPG. Combine two cards each turn — physical, elemental, defensive or support — to create an attack or spell, then fight your way through three floors of monsters, events, camps and bosses.

## Play

Open `index.html` in any modern browser. It is a single self-contained file (all art is embedded), so it also works when served from GitHub Pages.

## Highlights

- Card fusion with dozens of unique combinations (Laser Beam with phoenix, Lightning Strike, Gatling Punch, Solar Flare, Tidal Wave, Void Rift, Judgment, Grave Grasp, Hellfire, Thermal Shock, Shatter Bolt, Aurora, Typhoon, Phoenix Arrow, Frost Comet, Thunder Rain, Seraph Arrow, Dragonfire Lance, Thunder Spear, Heaven's Lance, Omnislash, Iaido Flash, Dragon Rush, Hurricane Kick, Titan Smash, Meteor, Earthquake, Ice Age, Freezing/Burning/Aqua/Abyssal Slash, Air Volley, Stone Punch, Healing Rain, Bulwark and more)
- Mana system: element cards cost mana, physical cards restore it, skip a turn to recover
- Gear that shows on the hero (helmets, chest armour, capes, staffs, amulets) with stat bonuses
- Three floors: Mushroom Woods, Volcanic Rift and Ember Hollow, with elite two-monster fights
- Animated hero sprites, monster sprite sheets and particle effects

## Building from source

The playable file is generated from the files in `source/`:

```
cd source
python3 assemble.py   # stitches the stage, logic, spells and effects into fusebound.src.html
python3 build.py      # embeds all images and writes fusebound.html
```

Copy the resulting `fusebound.html` to `index.html` at the repository root. Requires Python 3 with Pillow.

`source/tools/` holds the one-off scripts used to prepare the hero atlas, item icons, slash effects and monster sheets from the original sprite packs; they expect the original artwork and are kept for reference.

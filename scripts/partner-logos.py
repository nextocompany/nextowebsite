"""
Turns partner logos into one white, transparent mark each, for the dark hero row.

    python3 scripts/partner-logos.py <folder with the partners' files> public/partners

Needs Pillow. Each pixel's distance from the background the logo was drawn on
becomes its opacity, so colour logos, knockouts and anti-aliasing survive as
one tone. A 'badge' logo is already light-on-dark: its coloured badge (by
saturation) and its light lettering outside the badge (by lightness) become
the mark, and the letters inside the badge a knockout. Add new partners to LOGOS, then their size to WORKING_WITH in
src/lib/site/constants.ts (the script prints width/height).
"""
import json, os, sys
from PIL import Image, ImageChops

SRC, OUT = sys.argv[1], sys.argv[2]
HEIGHT = 160  # px; shown at about 2.5-3rem, so this covers 2x screens and the ultra-wide scale-up
LOGOS = [  # (slug, file, background the logo was drawn on)
    ('meditop', 'meditop.gif', (255, 255, 255)),
    ('touch-technologies', 'touch.png', (255, 255, 255)),
    ('ananta-river-hills', 'anantariverhills.png', (255, 255, 255)),
    ('leaf-lake-kan', 'LLK700x700.png', (255, 255, 255)),
    ('500-miles', '500miles.jpg', (255, 255, 255)),
    ('vds', 'vds.png', (0, 0, 0)),
    ('ert', 'ert-logo.png', (255, 255, 255)),
    # Light-on-dark logo with a coloured badge: the badge becomes the mark, the white letters in it a knockout.
    ('tiu', 'TiU.avif', 'badge'),
]

def smooth(lo, hi, v):
    t = min(max((v - lo) / (hi - lo), 0.0), 1.0)
    return t * t * (3 - 2 * t)

LUT = [round(255 * smooth(0.06, 0.32, i / 255)) for i in range(256)]
meta = {}
def ink_on_background(im, bg):
    flat = Image.new('RGBA', im.size, bg + (255,))
    flat.alpha_composite(im)
    diff = ImageChops.difference(flat.convert('RGB'), Image.new('RGB', im.size, bg))
    r, g, b = diff.split()
    return ImageChops.lighter(ImageChops.lighter(r, g), b).point(LUT)


def ink_badge(im):
    hsv = im.convert('RGB').convert('HSV')
    _, sat, val = hsv.split()
    alpha = im.getchannel('A')
    badge = ImageChops.multiply(sat, alpha).point(lambda v: 255 if v > 90 else 0)
    left, top, right, bottom = badge.getbbox()
    inside = Image.new('L', im.size, 0)
    inside.paste(255, (left, top, right, bottom))
    letters = ImageChops.multiply(val, alpha)
    ink_inside = ImageChops.multiply(ImageChops.multiply(sat, alpha), inside)
    ink_outside = ImageChops.multiply(letters, ImageChops.invert(inside))
    return ImageChops.lighter(ink_inside, ink_outside).point(LUT)


for slug, name, bg in LOGOS:
    im = Image.open(os.path.join(SRC, name)).convert('RGBA')
    ink = ink_badge(im) if bg == 'badge' else ink_on_background(im, bg)
    box = ink.getbbox()
    ink = ink.crop(box)
    w = round(ink.width * HEIGHT / ink.height)
    ink = ink.resize((w, HEIGHT), Image.LANCZOS)
    out = Image.new('RGBA', ink.size, (255, 255, 255, 0))
    out.putalpha(ink)
    out = Image.composite(Image.new('RGBA', ink.size, (255, 255, 255, 255)), out, ink)
    out.putalpha(ink)
    path = os.path.join(OUT, f'{slug}.png')
    out.save(path, optimize=True)
    meta[slug] = {'width': w, 'height': HEIGHT, 'bytes': os.path.getsize(path)}
print(json.dumps(meta, indent=1))

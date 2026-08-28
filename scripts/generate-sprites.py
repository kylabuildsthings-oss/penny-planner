#!/usr/bin/env python3
"""Generate pixel-art sprites for Penny the budgie and a chestnut icon."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "sprites"
PUBLIC = ROOT / "public"
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

PAL = {
    ".": (0, 0, 0, 0),
    "k": (42, 31, 20, 255),  # warm outline
    "b": (79, 195, 247, 255),  # body blue
    "B": (2, 136, 209, 255),  # body dark
    "l": (179, 229, 252, 255),  # body light
    "y": (255, 213, 79, 255),  # yellow
    "Y": (255, 236, 153, 255),  # yellow light
    "g": (249, 168, 37, 255),  # wing gold
    "s": (62, 39, 35, 255),  # scallop
    "c": (66, 165, 245, 255),  # cere
    "C": (21, 101, 192, 255),  # cere dark
    "o": (255, 171, 145, 255),  # beak
    "O": (230, 74, 25, 255),  # beak dark
    "e": (42, 31, 20, 255),  # eye
    "w": (255, 253, 231, 255),  # white
    "f": (255, 183, 77, 255),  # feet
    "p": (255, 243, 196, 255),  # cheek
    "n": (121, 85, 72, 255),  # nut
    "N": (78, 52, 46, 255),  # nut dark
    "t": (215, 204, 200, 255),  # nut highlight
    "r": (239, 83, 80, 255),  # confetti red
    "a": (102, 187, 106, 255),  # confetti green
    "u": (66, 165, 245, 255),  # confetti blue
    "m": (186, 104, 200, 255),  # confetti purple
}

HAPPY = [
    "................................",
    "................................",
    "..............kkkkkk............",
    "............kkYYYYYYkk..........",
    "...........kYYYYYYYYYYk.........",
    "..........kYYYYYYYYYYYYk........",
    "..........kYYYpwwYYYYYYk........",
    ".........kYYYwccwYYYYYYkk.......",
    ".........kYYYwc.ewYYYYYook......",
    ".........kYYYYwwwkYYYYYoOk......",
    ".........kYYYYYOokYYYYYOok......",
    "..........kYYYYok.kkkkkk........",
    ".........kkbbbbbbkbbbbbk........",
    "........kbbbbbbbbbbbbbbk........",
    ".......kbbbgggggggggbbbk........",
    "......kbbbbgsgsgsgsgbbbk........",
    "......kbbbbgggggggggbbbk........",
    ".......kbbbgsgsgsgsbbBkk........",
    "......kkbbbbbbbbbbbbBkk.........",
    ".....kBBkbbbbbbbbbbkk...........",
    "......kk.kbbbbbbbbk.............",
    "..........kbbkk.kfk.............",
    "...........kk...kfk.............",
    "................kfk.............",
    "...............kffk.............",
    "...............kffk.............",
    "..............kf.fk.............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
]

THINKING = [
    "................................",
    "................................",
    "..............kkkkkk............",
    "............kkYYYYYYkk..........",
    "...........kYYYYYYYYYYk.........",
    "..........kYYYYYYYYYYYYk........",
    "..........kYYYpwwYYYYYYk........",
    ".........kYYYwwwwewYYYYkk.......",
    ".........kYYYwccw.ewYYYYook.....",
    ".........kYYYYwwwkYYYYYYoOk.....",
    ".........kYYYYYOokYYYYYYOok.....",
    "........kkbYYYYok.kkkkkkk.......",
    ".......kbBkbbbbbbkbbbbbk........",
    "......kbbBkbbbbbbbbbbbbk........",
    ".....kbbbBkgggggggggbbbk........",
    ".....kbbbbkgsgsgsgsgbbbk........",
    "......kkbbkgggggggggbbbk........",
    "........kkbgsgsgsgsbbBkk........",
    ".........kbbbbbbbbbbbBkk........",
    "........kkbbbbbbbbbbbkk.........",
    ".......kBBkbbbbbbbbkk...........",
    "........kk.kbbbbbbk.............",
    "............kbbkk.kfk...........",
    ".............kk...kfk...........",
    "..................kfk...........",
    ".................kffk...........",
    ".................kffk...........",
    "................kf.fk...........",
    "................................",
    "................................",
    "................................",
    "................................",
]

DANCING = [
    "................................",
    ".....r..........m...............",
    "..............kkkkkk......a.....",
    "....u.......kkYYYYYYkk..........",
    "...........kYYYYYYYYYYk....r....",
    "..........kYYYYYYYYYYYYk........",
    "..........kYYYpwwYYYYYYk........",
    ".........kYYYwwwwYYYYYYkk.......",
    "....a....kYYYwccwYYYYYYook......",
    ".........kYYYYwwwkYYYYYoOk..m...",
    ".........kYYYYYOokYYYYYOok......",
    "...kkkkkkkYYYYok.kkkkkk.........",
    "..kbgggggkbbbbbbkbbbbbkkkkkk....",
    "..kbgsgsgkbbbbbbbbbbbbkggggbk...",
    "..kbgggggkbbllllllbbbbkgsgsbk.u.",
    "..kbgsgsgkbbllllllbbbbkggggbk...",
    "...kkkkkkbbbbbbbbbbbbbkkkkkk....",
    ".........kbbbbbbbbbbbBk.........",
    "........kkbbbbbbbbbbBkk.........",
    ".....r...kkbbbbbbbbkk....a......",
    "...........kkbbbbkk.............",
    ".............kkkk...............",
    "..........kfk....kfk............",
    "..........kfk....kfk............",
    ".........kffk....kffk...........",
    ".............................m..",
    "....u................r..........",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
]

CHESTNUT = [
    "......kkkk......",
    ".....ktnnnk.....",
    "....ktnnnnNk....",
    "....knnnnnnNk...",
    "...kknnNNnnNk...",
    "...knnnnnnnNk...",
    "....knnNNnnk....",
    "....kknnnnkk....",
    ".....kkkkkk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
]


def render(rows, scale=8):
    h = len(rows)
    w = len(rows[0])
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        if len(row) != w:
            raise ValueError(f"Row {y} length {len(row)} != {w}: {row}")
        for x, ch in enumerate(row):
            px[x, y] = PAL[ch]
    return img.resize((w * scale, h * scale), Image.NEAREST)


def crop_content(img, pad=8):
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    return img.crop((left, top, right, bottom))


def content_bbox(rows):
    ys = [y for y, row in enumerate(rows) if any(c != "." for c in row)]
    xs = [x for row in rows for x, c in enumerate(row) if c != "."]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def square_canvas(img):
    side = max(img.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return canvas


def write_favicons(rows):
    """Tight-crop Penny with fully transparent pixels only — no cream plate."""
    x0, y0, x1, y1 = content_bbox(rows)
    w, h = x1 - x0, y1 - y0
    pad = 1
    vw, vh = w + pad * 2, h + pad * 2
    pixels = []
    rects = []
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            r, g, b, _a = PAL[ch]
            rects.append(
                f'<rect x="{x - x0 + pad}" y="{y - y0 + pad}" width="1" height="1" '
                f'fill="#{r:02x}{g:02x}{b:02x}"/>'
            )
            pixels.append((x - x0 + pad, y - y0 + pad, (r, g, b, 255)))

    (PUBLIC / "favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vw} {vh}" '
        f'shape-rendering="crispEdges">\n'
        + "\n".join(rects)
        + "\n</svg>\n"
    )

    def paint(scale):
        img = Image.new("RGBA", (vw * scale, vh * scale), (0, 0, 0, 0))
        px = img.load()
        for x, y, color in pixels:
            for dy in range(scale):
                for dx in range(scale):
                    px[x * scale + dx, y * scale + dy] = color
        return square_canvas(img)

    png = paint(2)
    png.save(PUBLIC / "favicon.png", "PNG")
    ico16, ico32, ico48 = paint(1), paint(2), paint(3)
    ico32.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        append_images=[ico16, ico48],
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    apple = paint(8).resize((180, 180), Image.NEAREST)
    apple.save(PUBLIC / "apple-touch-icon.png", "PNG")
    print(f"wrote favicon.svg {vw}x{vh}, favicon.png {png.size}, favicon.ico")


def main():
    sprites = {
        "penny-happy.png": HAPPY,
        "penny-thinking.png": THINKING,
        "penny-dancing.png": DANCING,
    }
    for name, rows in sprites.items():
        img = crop_content(render(rows, scale=8), pad=16)
        img.save(OUT / name)
        print(f"wrote {name} {img.size}")

    nut = render(CHESTNUT[:9], scale=4)
    nut = crop_content(nut, pad=4)
    nut.save(OUT / "chestnut.png")
    print(f"wrote chestnut.png {nut.size}")

    write_favicons(HAPPY)


if __name__ == "__main__":
    main()

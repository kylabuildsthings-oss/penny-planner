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


def square_canvas(img):
    side = max(img.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
    return canvas


def harden_alpha(img, threshold=32):
    """Drop anti-aliased fringe so browsers cannot plate it as a white square."""
    img = img.convert("RGBA")
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255 if a >= threshold else 0)
    return img


def scale_to(img, size):
    if img.width == size and img.height == size:
        return img
    return img.resize((size, size), Image.NEAREST)


def write_favicons_from_sprite(sprite_path):
    """Build site icons from the cute Penny sprite, not the crude 32x32 grid."""
    import base64
    import io

    src = harden_alpha(Image.open(sprite_path).convert("RGBA"))
    src = crop_content(src, pad=2)
    src = square_canvas(src)

    png = scale_to(src, 64)
    png.save(PUBLIC / "favicon.png", "PNG")

    ico32 = scale_to(src, 32)
    ico48 = scale_to(src, 48)
    ico32.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        append_images=[ico48],
        sizes=[(32, 32), (48, 48)],
    )

    buf = io.BytesIO()
    png.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    (PUBLIC / "favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {png.width} {png.height}">\n'
        f'  <image href="data:image/png;base64,{b64}" width="{png.width}" height="{png.height}"/>\n'
        f"</svg>\n"
    )

    apple = scale_to(src, 180)
    apple.save(PUBLIC / "apple-touch-icon.png", "PNG")
    print(f"wrote favicons from {sprite_path.name} png={png.size}")


def main():
    # Do not regenerate public/sprites from the ASCII grids — those would
    # overwrite the cute Penny art used in the header.
    write_favicons_from_sprite(OUT / "penny-happy.png")


if __name__ == "__main__":
    main()

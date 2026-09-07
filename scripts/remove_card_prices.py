"""Удаление цен с карточек товаров (products__price, catalog-list__item-price, tovar__price, related__price)."""
import re
import pathlib

root = pathlib.Path("src")
rx = re.compile(
    r"[ \t]*<div class=\"(?:products__price|catalog-list__item-price|tovar__price|related__price)\">.*?</div>[ \t]*\r?\n?",
    re.S,
)
files = 0
blocks = 0
for f in root.rglob("*.astro"):
    t = f.read_text(encoding="utf-8")
    nt, n = rx.subn("", t)
    if n:
        f.write_text(nt, encoding="utf-8")
        files += 1
        blocks += n
print(f"files={files} blocks={blocks}")

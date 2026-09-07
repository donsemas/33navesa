"""Удаление цен артикулов '| Артикул XXX по цене NNNN' из описаний.
'По цене от производителя' не трогаем (другой смысл). Точку после цены сохраняем."""
import re
import pathlib

rx = re.compile(r"\s*\|\s*Артикул\b.*?по цене\s+(?=[\d.])[\d ]*")

files = 0
n = 0
for f in pathlib.Path("src").rglob("*.astro"):
    t = f.read_text(encoding="utf-8")
    nt, c = rx.subn("", t)
    if c:
        f.write_text(nt, encoding="utf-8")
        files += 1
        n += c
print(f"files={files} removed={n}")

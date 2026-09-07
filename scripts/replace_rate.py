"""Замена старой ставки 5400₽/м² на 6800₽/м² (только с символом ₽ — итоги артикулов 54000 не трогаем)."""
import pathlib

n = 0
files = 0
for f in pathlib.Path("src").rglob("*.astro"):
    t = f.read_text(encoding="utf-8")
    nt = t.replace("5400₽", "6800₽").replace('price: "5400"', 'price: "6800"')
    if nt != t:
        f.write_text(nt, encoding="utf-8")
        files += 1
        n += t.count("5400₽") + t.count('price: "5400"')
print(f"files={files} replacements={n}")

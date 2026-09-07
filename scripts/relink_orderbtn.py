"""Кнопки 'Уточнить цену' -> /cena/ (страница с калькулятором).
A: модальные <a href=\"#order\" data-fancybox class=\"btn product__bt-order\"> (data-fancybox снимаем, иначе откроется как модалка).
B: <div class=\"tovar__button\"><a href=\"<товар>\" role=\"button\"><span>Уточнить цену</span>."""
import re
import pathlib

rx_b = re.compile(
    r'(<div class="tovar__button">\s*<a href=")[^"]*("\s*role="button">\s*<span class="button-text">Уточнить цену</span>)'
)

fa = fb = 0
for f in pathlib.Path("src").rglob("*.astro"):
    t = f.read_text(encoding="utf-8")
    nt = t.replace(
        'href="#order" data-fancybox class="btn product__bt-order"',
        'href="/cena/" class="btn product__bt-order"',
    )
    if nt != t:
        fa += 1
    nt, cb = rx_b.subn(r"\1/cena/\2", nt)
    if cb:
        fb += 1
    if nt != t:
        f.write_text(nt, encoding="utf-8")
print(f"typeA_files={fa} typeB_files={fb}")

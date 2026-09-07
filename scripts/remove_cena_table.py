"""Удаление таблицы цен со страницы /cena/ (блок res-tabl целиком)."""
import re
import pathlib

f = pathlib.Path("src/pages/cena/index.astro")
t = f.read_text(encoding="utf-8")
nt, n = re.subn(r'<div class="res-tabl">.*?</table>\s*</div>', "", t, flags=re.S)
f.write_text(nt, encoding="utf-8")
print(f"tables_removed={n}")

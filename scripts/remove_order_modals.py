"""Удаление осиротевших модалок <div id=\"order\" class=\"modal\"> (364 товарные страницы).
#order2 в футере живая — не трогаем (ищем точное '<div id=\"order\" ' с пробелом)."""
import re
import pathlib

START = '<div id="order" class="modal">'
rx_open = re.compile(r"<div\b")
rx_close = re.compile(r"</div>")

files = 0
for f in pathlib.Path("src").rglob("*.astro"):
    t = f.read_text(encoding="utf-8")
    idxs = [m.start() for m in re.finditer(r'<div id="order" ', t)]
    if not idxs:
        continue
    assert len(idxs) == 1, f"multiple modals in {f}"
    s = idxs[0]
    # баланс div от начала модалки
    depth = 0
    pos = s
    end = None
    while True:
        mo = rx_open.search(t, pos)
        mc = rx_close.search(t, pos)
        assert mc, f"no close in {f}"
        if mo and mo.start() < mc.start():
            depth += 1
            pos = mo.end()
        else:
            depth -= 1
            pos = mc.end()
            if depth == 0:
                end = pos
                break
    block = t[s:end]
    assert 'id="order-form"' in block, f"unexpected block in {f}"
    # подчистить пустые строки вокруг
    pre = t[:s].rstrip() + "\n"
    post = t[end:].lstrip()
    nt = pre + post
    assert '<div id="order" ' not in nt, f"leftover in {f}"
    f.write_text(nt, encoding="utf-8")
    files += 1
print(f"modals_removed={files}")

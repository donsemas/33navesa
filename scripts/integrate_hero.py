"""Встройка Hero в главную: импорт, <Hero/> после шапки, удаление старого слайдера,
понижение дубля H1 каталога до H2 (вид сохраняется классом catalog-h1)."""
import io
import pathlib

p = pathlib.Path("src/pages/index.astro")
t = io.open(p, encoding="utf-8").read()

# 1. импорт Hero
old_imp = 'import Footer from "../components/Footer.astro";'
assert t.count(old_imp) == 1, "import anchor"
t = t.replace(old_imp, old_imp + '\nimport Hero from "../components/Hero.astro";', 1)

# 2. <Hero /> после шапки
old_hdr = "  <Header />\n"
assert t.count(old_hdr) == 1, "header anchor"
t = t.replace(old_hdr, "  <Header />\n  <Hero />\n", 1)

# 3. вырезать слайдер целиком (от slider до первого catalog-list)
s = t.find('<div class="slider">')
e = t.find('<div class="catalog-list">')
assert s > 0 and e > s, "slider bounds"
assert t.count('<div class="slider">') == 1, "single slider"
t = t[:s] + t[e:]

# 4. дубль H1 -> H2 с сохранением вида
old_h1 = "<h1>Навесы из поликарбоната</h1>"
assert t.count(old_h1) == 1, "catalog h1"
t = t.replace(
    old_h1,
    '<h2 class="catalog-h1">Навесы из поликарбоната</h2>',
    1,
)

io.open(p, "w", encoding="utf-8").write(t)
print("integrated: slider removed, hero in, h1 demoted")

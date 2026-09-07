"""Встройка калькулятора в /cena/: импорт PriceCalc, <PriceCalc/> над контентом,
скрытие дубля-калькулятора в сайдбаре, подключение price-calc.js."""
import io
import pathlib

p = pathlib.Path("src/pages/cena/index.astro")
t = io.open(p, encoding="utf-8").read()

old_imp = 'import Footer from "../../components/Footer.astro";'
assert t.count(old_imp) == 1, "import anchor"
t = t.replace(
    old_imp,
    'import Footer from "../../components/Footer.astro";\nimport PriceCalc from "../../components/PriceCalc.astro";',
    1,
)

old_sb = "<Sidebar />"
assert t.count(old_sb) == 1, "sidebar anchor"
t = t.replace(old_sb, "<Sidebar showCalculator={false} />", 1)

old_main = "<main set:html={`"
assert t.count(old_main) == 1, "main anchor"
t = t.replace(old_main, "<main>\n<PriceCalc />\n<div set:html={`", 1)

old_end = "</div>`} />"
assert t.count(old_end) == 1, "main end anchor"
t = t.replace(old_end, "</div>`}></div>\n</main>", 1)

old_css = '<link rel="stylesheet" href="/wp-content/themes/naves/css/media.css" />'
assert t.count(old_css) == 1, "css anchor"
t = t.replace(
    old_css,
    old_css + '\n  <script src="/js/price-calc.js" defer></script>',
    1,
)

io.open(p, "w", encoding="utf-8").write(t)
print("price calc integrated into cena")

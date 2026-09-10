"""Генератор дерева сайта из sitemap.xml.
Выход: site-tree.mm (Freeplane/XMind), site-tree.html (браузер),
       site-tree.md (VS Code + Markmap).
Запуск:
  python scripts/build_site_tree.py                                   # свой сайт (dist)
  python scripts/build_site_tree.py --url https://site.ru/sitemap.xml --domain site.ru --out reports/site-tree-site
"""
import argparse
import html as htmlmod
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def build_tree(urls, domain):
    root = {"_urls": [], "_kids": {}}
    for u in urls:
        path = u.split(domain, 1)[-1].strip("/")
        node = root
        if not path:  # главная
            root["_urls"].append(u)
            continue
        parts = path.split("/")
        for p in parts:
            node = node["_kids"].setdefault(p, {"_urls": [], "_kids": {}})
        node["_urls"].append(u)
    return root


def esc_mmap(s):
    return htmlmod.escape(s, quote=True)


def to_mm(node, name):
    kids = "".join(to_mm(v, k) for k, v in sorted(node["_kids"].items()))
    leaf = f'<node TEXT="{esc_mmap(name)}">'
    if node["_urls"] and not node["_kids"]:
        leaf = f'<node TEXT="{esc_mmap(name)}" LINK="{esc_mmap(node["_urls"][0])}">'
    inner = ""
    if node["_urls"] and node["_kids"]:
        inner = f'<node TEXT="&#9733; {esc_mmap(node["_urls"][0])}" LINK="{esc_mmap(node["_urls"][0])}"/>'  # noqa
    return f"{leaf}{inner}{kids}</node>"


def count_pages(node):
    n = len(node["_urls"])
    for v in node["_kids"].values():
        n += count_pages(v)
    return n


def to_html(node, name, depth=0):
    total = count_pages(node)
    label = f"{htmlmod.escape(name)} ({total})" if depth else f"{htmlmod.escape(name)} — {total} стр."
    kids = "".join(to_html(v, k, depth + 1) for k, v in sorted(node["_kids"].items()))
    if not kids:
        link = node["_urls"][0] if node["_urls"] else "#"
        return f'<li><a href="{htmlmod.escape(link)}" target="_blank">{htmlmod.escape(name)}</a></li>'
    own = ""
    if node["_urls"]:
        own = f' <a href="{htmlmod.escape(node["_urls"][0])}" target="_blank">↗</a>'
    return f"<li><details{' open' if depth < 2 else ''}><summary>{label}{own}</summary><ul>{kids}</ul></details></li>"  # noqa


def to_md(node, name, depth=1):
    total = count_pages(node)
    lines = [f'{"#" * min(depth, 6)} {name} ({total})']
    for k, v in sorted(node["_kids"].items()):
        lines.append(to_md(v, k, depth + 1))
    return "\n".join(lines)


def load_urls(args):
    if args.url:
        req = urllib.request.Request(args.url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        xml = ET.fromstring(data)
    else:
        xml = ET.parse(ROOT / "dist" / "sitemap-0.xml").getroot()
        return [e.text.strip() for e in xml.findall(
            "{http://www.sitemaps.org/schemas/sitemap/0.9}url/"
            "{http://www.sitemaps.org/schemas/sitemap/0.9}loc")] if False else None
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    if isinstance(xml, ET.Element):
        root = xml
    else:
        root = xml.getroot()
    if root.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}sitemapindex":
        urls = []
        for sm in root.findall("s:sitemap/s:loc", ns):
            with urllib.request.urlopen(
                urllib.request.Request(sm.text.strip(), headers={"User-Agent": "Mozilla/5.0"}),
                timeout=60,
            ) as r:
                sub = ET.fromstring(r.read())
            urls += [e.text.strip() for e in sub.findall("s:url/s:loc", ns)]
        return urls
    return [e.text.strip() for e in root.findall("s:url/s:loc", ns)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=None)
    ap.add_argument("--domain", default="33navesa.ru")
    ap.add_argument("--out", default=str(ROOT / "reports" / "site-tree"))
    args = ap.parse_args()

    if args.url:
        urls = load_urls(args)
    else:
        xml = ET.parse(ROOT / "dist" / "sitemap-0.xml")
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [e.text.strip() for e in xml.getroot().findall("s:url/s:loc", ns)]

    tree = build_tree(urls, args.domain)
    total = count_pages(tree)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    prefix = out.name

    mm = ('<map version="1.0.1">'
          f'<node TEXT="{args.domain} — {total} стр.">'
          + "".join(to_mm(v, k) for k, v in sorted(tree["_kids"].items()))
          + "</node></map>")
    (out.parent / f"{prefix}.mm").write_text(mm, encoding="utf-8")

    body = "".join(to_html(v, k, 1) for k, v in sorted(tree["_kids"].items()))
    page = f"""<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<title>{args.domain} — дерево сайта ({total})</title>
<style>body{{font:14px/1.5 Arial,sans-serif;max-width:900px;margin:20px auto;padding:0 15px}}
summary{{cursor:pointer;padding:2px 0}}ul{{margin:2px 0}}a{{color:#0b5ed7}}</style></head>
<body><h1>{args.domain} — {total} стр.</h1>
<p>Главная: <a href="https://{args.domain}/" target="_blank">/</a></p>
<ul>{body}</ul></body></html>"""
    (out.parent / f"{prefix}.html").write_text(page, encoding="utf-8")

    (out.parent / f"{prefix}.md").write_text(
        f"# {args.domain} ({total})\n" + "\n".join(to_md(v, k, 2) for k, v in sorted(tree["_kids"].items())),
        encoding="utf-8",
    )
    print(f"OK: {total} url -> {prefix}.mm / .html / .md")


if __name__ == "__main__":
    main()

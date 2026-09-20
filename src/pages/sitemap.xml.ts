export const prerender = true;

// Fallback для /sitemap.xml — часть внешних чекеров стучится именно сюда.
// Канонический файл — /sitemap-index.xml (с дефисом, генерирует @astrojs/sitemap).
// 301 задан в onreza.rules.toml (id "sitemap-xml"); этот эндпоинт страхует:
// edge-правила Onreza по факту не срабатывают (проверено 20.09.2026 —
// /uslugi/montazh-2/ отдаёт 200 вместо 301), тогда отдаётся валидный XML
// с 200 вместо 404. Для поисковиков валидный индекс по этому URL ок.
export async function GET({ site }: { site: URL | undefined }) {
  const base = (site?.toString() ?? "https://33navesa.ru/").replace(/\/$/, "");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    `<sitemap><loc>${base}/sitemap-0.xml</loc></sitemap>` +
    `</sitemapindex>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

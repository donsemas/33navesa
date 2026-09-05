export const prerender = true;

// Fallback для legacy Yoast/WordPress URL sitemap_index.xml (с подчёркиванием).
// Канонический файл — /sitemap-index.xml (с дефисом, генерирует @astrojs/sitemap).
// Основной 301 задан в public/_redirects; этот эндпоинт страхует хостинги,
// которые _redirects игнорируют (тогда отдаётся валидный XML с 200 вместо 404).
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

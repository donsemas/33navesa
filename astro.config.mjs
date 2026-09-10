import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://33navesa.ru",
  output: "static",
  integrations: [tailwind(), sitemap({
    // страницы-заглушки редиректов — не для индекса
    filter: (page) => !page.includes("montazh-2") && !page.includes("navesy-dlya-mangala"),
  })],
  trailingSlash: "always",
});

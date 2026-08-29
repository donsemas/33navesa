import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://33navesa.vercel.app",
  output: "static",
  integrations: [tailwind(), sitemap()],
  trailingSlash: "always",
});

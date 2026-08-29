import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  integrations: [tailwind()],
  // Сохраняем точные URL без добавления trailingSlash, чтобы совпасть с WP
  trailingSlash: "always",
});

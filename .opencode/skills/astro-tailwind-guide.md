# Astro + Tailwind CSS — Гайд по сборке проектов

> Скилл для сборки статических проектов на **Astro 4.x + @astrojs/tailwind 6.x + Tailwind 3.4**. Проверен на проекте `33navesaASTRO` (458 страниц, миграция с WordPress, SEO 1:1).

---

## 1. Базовая инициализация

### 1.1 `package.json`
```json
{
  "name": "33naves-astro",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": { "astro": "^4.16.0" },
  "devDependencies": {
    "@astrojs/tailwind": "^6.0.2",
    "tailwindcss": "^3.4.19"
  }
}
```

### 1.2 `astro.config.mjs`
```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  trailingSlash: "always", // критично для SEO при миграции с WP (/katalog/ == /katalog/)
  integrations: [tailwind()],
});
```
- `trailingSlash: "always"` — сохраняет структуру WP (`/blog/post/` а не `/blog/post`). Если сменить — потеря canonical и 301.
- `output: "static"` — SSG, весь сайт в `dist/`.

### 1.3 `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: { extend: {} },
  plugins: [],
}
```
- `content` ОБЯЗАТЕЛЬНО включает `*.astro`, иначе purging съест классы из `Header.astro`.
- `postcss.config.js` генерируется `npx tailwindcss init -p`, не править.

### 1.4 `src/styles/base.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Импортируется в каждой странице `import "../styles/base.css"` или в Layout. Без него Tailwind не инжектится.

> **Проверка:** `npx astro build` должен закончиться `✓ Completed` без ошибки `references an asset in the "public/" directory. Please add the "is:inline"`.

---

## 2. Правильная структура `src/`

```
src/
├── components/          # Переиспользуемые UI-блоки
│   ├── Header.astro     # шапка (top-bar + header + nav-box + nav-mob)
│   ├── Footer.astro     # подвал (footer + copyright + модалки + mob-box)
│   ├── Card.astro       # пример: карточка товара
│   └── Breadcrumbs.astro
├── layouts/
│   └── BaseLayout.astro # <html><head> SEO + слоты
├── pages/               # Файл = URL (строго 1:1 с WP)
│   ├── index.astro      # /
│   ├── blog/
│   │   ├── index.astro              # /blog/
│   │   └── besedki-iz-polikarbonata/index.astro
│   └── katalog/
│       ├── index.astro
│       └── besedki/besedki-iz-metalla/index.astro
├── styles/
│   └── base.css
└── env.d.ts
public/
├── uploads/             # ← wp-content/uploads (2027 файлов), путь /uploads/...
├── wp-content/themes/naves/ # css/js/img/fonts (215 файлов) для обратной совместимости
├── favicon.gif
└── robots.txt
```

**Правила:**
- `src/pages/**/*.astro` — **единственный источник URL**. Имя файла/папки = URL. `katalog/besedki/index.astro` → `/katalog/besedki/`. Никогда не переименовывать кириллицу, иначе 404 и потеря SEO.
- `public/` копируется 1:1 в `dist/` без обработки. Всё что должно быть доступно по `/uploads/xxx.jpg` класть в `public/uploads/`.
- Не хранить оригиналы HTML в корне (`blog/`, `katalog/` со старыми `index.html`) рядом с `src/` после миграции — только для архива. Источник истины — `src/pages/`.
- `wp-content` после чистки оставляем только `themes` (css) и `uploads` (img). `plugins/` и `wp-includes/` удаляются (в проекте было 2730 файлов мусора).

---

## 3. Правила выноса UI-компонентов

### 3.1 Когда выносить?
- Повтор >1 раза → компонент.
- Шапка/подвал — **всегда** `Header.astro` / `Footer.astro` (в проекте 10931 и 18547 симв. соответственно).
- Карточка, кнопка, пагинация, хлебные крошки, форма — отдельные `.astro`.

### 3.2 Header.astro — эталон
```astro
---
// Header.astro - общая шапка, вынесена из WP, Tailwind + оригинальные классы
---
<div class="top-bar">
  <div class="container top-bar__row">
    <div class="top__slogan">Изготовление навесов...</div>
    <div class="top-forms">
      <a href="#feedback" data-fancybox>Напишите нам</a>
    </div>
  </div>
</div>
<header> ... </header>
<div class="nav-box">...</div>
<div class="nav-mob">...</div>
```
- Сохраняем оригинальные классы (`header__logo`, `catalog-navigation__list`) чтобы старый `main.css` продолжал работать.
- Добавляем Tailwind-утилиты поверх, не переписывая: `class="header__row flex items-center justify-between"` — гибрид.

### 3.3 Footer.astro — эталон
Содержит `<footer>`, `.copyright`, `.btt`, `#callback`, `#feedback`, `#search`, `.mob-box` и `<script is:inline>`. Всё до `</body>` без `<body>`.

### 3.4 Импорты с учётом глубины
```astro
// src/pages/index.astro (depth 0)
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/base.css";

// src/pages/katalog/besedki/besedki-iz-metalla/index.astro (depth 3)
import Header from "../../../../components/Header.astro";
import Footer from "../../../../components/Footer.astro";
import "../../../../styles/base.css";
```
Формула: `ups = '../' * (depth + 1)` — где `depth = len(parent.parts)`. Генерировать скриптом при конвертации.

### 3.5 Props и слоты
```astro
// components/Card.astro
---
interface Props { title: string; img: string; price: string; href: string }
const { title, img, price, href } = Astro.props;
---
<div class="box bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
  <a href={href}><img src={img} alt={title} loading="lazy" /></a>
  <h3 class="text-lg font-bold mt-2">{title}</h3>
  <span class="text-red-600">Цена от {price} ₽/м²</span>
</div>
```

---

## 4. Оптимизация изображений через `<Image />`

### 4.1 Почему не `<img>`?
`astro:assets` даёт: WebP/AVIF, `srcset`, lazy, `width/height` против CLS, кэш `/_astro/`.

### 4.2 Подключение
```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
export default defineConfig({
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
  integrations: [tailwind()]
});
```

### 4.3 Использование
```astro
---
import { Image } from "astro:assets";
import spr1 from "../../../public/uploads/2022/04/spr1.jpg"; // или из src/assets
---
<Image src={spr1} alt="Навесы" width={400} height={250} format="webp" densities={[1,2]} loading="lazy" class="rounded-lg" />
```
- Для миграций: массово заменять `src="/uploads/..."` → импорт через `astro:assets`. Оставить `src="/uploads/..."` только для внешних CMS-картинок.
- Обязательно `width` + `height` — без них CLS и ошибка build.
- Для `public/uploads` (2027 файлов) — выгоднее перенести часто используемые в `src/assets/` и импортировать, редкие оставить в `public/`.

### 4.4 Чек-лист
- [ ] `sharp` установлен (`npm i sharp`)
- [ ] Нет `<img>` без `alt`
- [ ] `loading="lazy"` для ниже фолда, `eager` для hero
- [ ] `format="webp"` или `avif` для экономии 30-40% трафика

---

## 5. SEO-настройки

### 5.1 Head на каждой странице (1:1 с WP)
```astro
---
const title = 'Беседки из металла купить...';
const description = '⭐ Донгруп 33 навеса...';
const canonical = '/katalog/besedki/besedki-iz-metalla/';
const ldJson = '{"@context":"https://schema.org"...}';
---
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:site_name" content="Фабрика навесов" />
  {ldJson && <script type="application/ld+json" set:html={ldJson} />}
  <link rel="stylesheet" href="/wp-content/themes/naves/css/main.css" />
</head>
```
- `title` 30-60 симв., уникальный. Извлекать из `<title>` WP.
- `description` 120-160 симв., с ключевым словом в начале.
- `canonical` — абсолютный или root-relative, без `?` и без дублирования `/page/2` (пагинация удалена).
- `og:*` дублируют title/description — критично для Яндекс.
- JSON-LD `yoast-schema-graph` переносить как есть через `set:html`.

### 5.2 Техничка
- `robots.txt` в `public/` → `dist/robots.txt`
- `sitemap.xml` генерировать через `@astrojs/sitemap` (старые `attachment-sitemap.xml` удалены).
- `trailingSlash: "always"` + `<link rel="canonical">` — защита от дублей.
- Нет `/wp-json/`, `/feed/`, `/author/`, `/page/`, `/attachment/` — всё вычищено.

### 5.3 Конвертация 458 страниц
Скрипт `convert.py`:
- `depth → import path`
- `top-bar...nav-mob` → `Header.astro`, `<footer>...` → `Footer.astro`, середина → `set:html`
- `/wp-content/uploads/` → `/uploads/` (совместимость с `public/uploads`)
- Проверка: `src/pages/katalog/besedki/besedki-iz-polikarbonata/index.astro` === URL `/katalog/besedki/besedki-iz-polikarbonata/`

---

## 6. Чистая адаптивная верстка

### 6.1 Mobile-first
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="catalog-list__item p-4 md:p-6">
```

### 6.2 Контейнер
```css
/* tailwind.config.js -> extend */
container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } }
```
Использовать `<div class="container">` как в оригинале, но дополнять `mx-auto px-4`.

### 6.3 Брейкпоинты
- `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280` — не изобретать.
- Навигация: `hidden lg:flex` для `catalog-navigation`, `lg:hidden` для `nav-mob__bt`.

### 6.4 Скрипты
```astro
<script is:inline src="/wp-content/themes/naves/js/script.js"></script>
<script is:inline src="/wp-content/themes/naves/js/main.js"></script>
```
- `is:inline` обязателен для `public/` ассетов, иначе ошибка `Could not load ... astro&type=script`.
- jQuery + Fancybox оставлять как есть, мигрировать на нативный JS постепенно.

### 6.5 Чек-лист верстки
- [ ] Нет горизонтального скролла на 320px
- [ ] `img { max-width:100%; height:auto }` (уже в `main.css`)
- [ ] Тап-таргет ≥44px
- [ ] `font-display: swap` для `montserrat/raleway/roboto`
- [ ] Контраст AA

---

## 7. Команды и деплой

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # → dist/ (458 страниц ~ 73s)
npm run preview # проверка dist
```

**Деплой статики:** `dist/` + `public/` (uploads, themes). Любой S3/Nginx/Cloudflare Pages. Не нужен Node на проде.

---

## 8. Частые ошибки

| Ошибка | Причина | Фикс |
|---|---|---|
| `Could not load ... public/` | `<script src="/...">` без `is:inline` | Добавить `is:inline` |
| Классы Tailwind не применяются | `content` не включает `*.astro` | Поправить `tailwind.config.js` |
| 404 на `/katalog/besedki` | `trailingSlash` mismatch | `always` + `index.astro` в папке |
| Дубли canonical | осталось `/page/2/` | Удалить пагинацию, оставить только первый `index.astro` |
| Mojibake `ÐÑ` | `Get-Content` без UTF-8 | Читать через `Read` tool или `python ... encoding='utf-8'` |

---

*Версия скилла: 1.0 (2026-08-29), проект 33navesaASTRO, Astro 4.16 + Tailwind 3.4.*

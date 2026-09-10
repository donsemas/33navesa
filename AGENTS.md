# AGENTS.md — 33navesa (Astro)

## Стек и деплой
- Astro 4, output static, Tailwind, sitemap. Сайт: https://33navesa.ru
- Деплой: push в `main` (github.com/donsemas/33navesa) → Onreza, ~2-3 мин.
- Сборка: `npm run build` (~50-60 сек, 427 стр.). Проверка: `npm run dev` / `npm run preview -- --host`.

## Где что править
- Мобильные фиксы — ТОЛЬКО в `src/styles/base.css` (подключается после темы, побеждает `media.css`).
- Hero-блок — `src/components/Hero.astro` (scoped `<style>`, брейкпоинты 768 / 460).
- Тема WordPress (`style.css`, `media.css`) — не трогать, только переопределять в `base.css`.
- Логотип в `media.css` имеет `width:100%` на ≤767px — при правках шапки сбрасывать в `width:auto`.

## Правила
- Стиль коммитов: `fix:` / `style:` / `feat:` / `chore:` (как в истории).
- НЕ коммитить `.env`, секреты, `node_modules/`, `dist/`.
- Коммит/пуш — только по явной просьбе («пуш»).
- После пуша напоминать: ждать 2-3 мин + жёсткое обновление на телефоне.
- Ответы пользователю — короткие, по-русски, без воды.

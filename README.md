# Car Catalog

Профессиональный каталог автомобилей на Nuxt 4: быстрый список, фильтры с синхронизацией URL, SEO-friendly карточки и расширенные данные через CarQuery API.

## Quick Start (30 seconds)

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## What Is Implemented

- SSR-приложение на Nuxt 4 с TypeScript и Pinia.
- Каталог и фильтры (поиск, марка, диапазон года) с синхронизацией query-параметров.
- Детальная страница авто по slug-маршруту: `/car/:slug` (пример: `toyota-camry-2020`).
- Транслитерация slug для кириллицы в `app/utils/carSlug.ts`.
- Блок локальных данных (`/api/cars`) и блок данных CarQuery (`/api/carquery/:make/:model/:year`).
- Tooltip-пояснения источников данных в заголовках секций.
- Fancybox lightbox при клике по фото на странице автомобиля.
- SCSS-стилизация и БЭМ-именование классов.
- Обновлённые `AppHeader` и `AppFooter` (копирайт, иконка GitHub-заглушка).
- Кастомный favicon: `public/car-filled.svg`.

## Tech Stack

- Nuxt `4.2.2`
- Vue `3.5.26`
- Pinia `3.0.4`
- Sass `1.97.3`
- ESLint + Prettier
- Fancybox (`@fancyapps/ui`)

## Project Structure

```text
app/
├── assets/styles/        # SCSS tokens, mixins, global styles
├── components/           # UI-компоненты (header, footer, cards, tooltip)
├── composables/          # useCarFilters
├── data/                 # cars.json
├── pages/
│   ├── index.vue         # Каталог
│   └── car/[slug].vue    # Детальная страница
├── stores/               # Pinia store
└── utils/                # slug/transliteration helpers

server/api/
├── cars.get.ts
└── carquery/[...slug].get.ts

types/
└── car.ts
```

## Architecture

```mermaid
flowchart TD
  A[Browser] --> B[Nuxt Pages]
  B --> C[index.vue]
  B --> D[car/[slug].vue]
  C --> E[Pinia cars store]
  D --> E
  E --> F[/api/cars]
  E --> G[/api/carquery/:make/:model/:year]
  G --> H[CarQuery API]
  E -.->|persist apiData| I[localStorage]
```

## Scripts

```bash
npm run dev
npm run build
npm run build:spa
npm run preview
npm run generate
npm run lint
npm run lint:fix
npm run format
```

## Validation Before PR

```bash
npm run lint
npm run build
```

Ручная проверка:
- фильтры и query-параметры;
- переходы по slug-ссылкам карточек;
- загрузка/ошибки/пустые ответы CarQuery;
- открытие фото через Fancybox.

# Media Tracker App

Modern media-tracking experience for anime, manga, TV, movies, novels, and more. Built with Expo Router, NativeWind/Tailwind, React Native Reusables, SQLite, and Drizzle ORM.

## ✨ Highlights

- Full seven-screen UX (Home, Library, Search & Discovery, Add/Edit Entry, Detail, Profile/Stats, Settings) wired via a bottom tab navigator + nested stacks.
- Shared component library (cards, chips, section headers, charts, loaders, forms) for consistent UI patterns.
- Local-first persistence using Expo SQLite + Drizzle ORM with optimistic mutations through a `MediaProvider` context.
- Tailwind-only styling with strict reuse of RN Reusables primitives (no custom CSS files).
- Built-in mock data (`lib/data/mock.ts`) for offline demos plus seeding on first launch.

## 🗂️ Key folders

| Path | Purpose |
| --- | --- |
| `app/` | Expo Router routes for tabs, detail stack, and settings. |
| `components/` | Shared UI primitives (cards, chips, charts, forms, etc.). |
| `providers/media-provider.tsx` | Context for queries, stats, filters, and optimistic mutations. |
| `lib/db/` | SQLite schema + Drizzle helpers + seed utilities. |
| `lib/types/` | Strongly typed domain models (media, stats, filters). |
| `docs/architecture.md` | High-level implementation strategy and navigation map. |

## 🚀 Run locally

```bash
pnpm install
pnpm dev
```

The command boots Expo Dev Server. Use on-screen prompts to open iOS (`i`), Android (`a`), or Web (`w`). You can also scan the QR code with Expo Go on a physical device.

## 🧰 Tooling & scripts

- `pnpm dev` – start Expo (clears cache for reliable NativeWind class recompiles).
- `pnpm android | ios | web` – platform-specific simulators.
- `pnpm clean` – reset `.expo` + `node_modules`.

## 🧱 Data flow quick reference

1. `providers/MediaProvider` runs SQLite migrations via `lib/db/index.ts`, seeds demo data, and exposes `entries`, `stats`, and helper mutations (`incrementProgress`, `toggleFavorite`, `saveEntry`, `updateStatus`).
2. Screens subscribe with the `useMedia()` hook to display lists, stats, and charts while receiving optimistic updates.
3. Shared cards/form controls live under `components/cards|shared|forms` and rely exclusively on RN Reusables + Tailwind utility classes.

## 📦 Deployment

This project works with Expo Go for rapid testing. When you're ready to ship, follow the [EAS Build](https://docs.expo.dev/build/introduction/), [EAS Update](https://docs.expo.dev/eas-update/introduction/), and [EAS Submit](https://docs.expo.dev/submit/introduction/) guides.

---

Questions or ideas? Check `docs/architecture.md` for the full UI/UX specification summary and future enhancement notes.

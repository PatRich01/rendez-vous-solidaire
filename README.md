# Rendez-vous Solidaire — PWA & Share Instructions

This repository is an Expo + React Native app with web support via `expo-router`.

## Quick start (dev web)

Install dependencies (pnpm recommended):

```bash
pnpm install
pnpm dev
# or
# npm install
# npm run dev
```

Start web:

```bash
pnpm web
# or
# npm run web
```

Open the app in Chrome. The PWA manifest is available at `/manifest.json` and the service worker is at `/sw.js`.

## Build and export web (PWA)

```bash
pnpm build:web
pnpm export:web
```

Serve the `./dist/web` folder from a static host (Netlify, Vercel, GitHub Pages, or any static server). On mobile browsers (Chrome on Android), open the site and use the browser menu to "Install" or "Add to Home screen".

## Share link from the app

On the rendez-vous detail screen there's a **Share** button that uses the Web Share API where supported, and falls back to React Native's `Share` API.

## Native builds (optional)

This project includes scripts for EAS builds. Configure `eas.json` and credentials, then run:

```bash
pnpm run eas:build:android
pnpm run eas:build:ios
```

See Expo docs for EAS setup: https://docs.expo.dev/eas/

## Icons

SVG icons are in `web/icons/`. For best cross-platform compatibility, add PNG icons at `web/icons/icon-192.png` and `web/icons/icon-512.png` and update `web/manifest.json` accordingly.

## Generating platform icons

Run the included icon generator to produce PNG icons at common sizes (outputs to `web/icons` and `assets/icons`):

```bash
pnpm generate:icons
```

This requires `sharp` — it is added as a devDependency. If installation fails on Windows, install build tools or use a container.

## CI / EAS secrets

To run EAS builds in CI you must add the following repository secrets:
- `EAS_TOKEN` — an EAS API token (see https://docs.expo.dev/eas-cli/credentials/)

The GitHub Actions workflow will log in with `EAS_TOKEN` and run `eas build` for the `production` profile when a tag `v*` is pushed.

## iOS icon guidance

The generator now includes iOS sizes (20, 29, 40, 60, 76, 83, 120, 152, 167, 180, 1024). After running `pnpm generate:icons`, verify the following files exist under `assets/icons` and `web/icons`:

- `icon-20.png`, `icon-29.png`, `icon-40.png`, `icon-60.png`, `icon-76.png`, `icon-83.png`, `icon-120.png`, `icon-152.png`, `icon-167.png`, `icon-180.png`, `icon-1024.png`

Use these to populate Xcode asset catalogs if you do manual native packaging; Expo will pick up `assets/icons/icon-512.png` as the main app icon by default.

## Notes

- Ensure `expo-cli` and `eas-cli` are installed globally if you plan to use those scripts.
- PWA install behavior varies by platform and browser.

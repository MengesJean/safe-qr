# Safe QR

Safe QR is a minimalist QR-code generator built with Next.js and shadcn/ui. Enter any URL, generate a high-quality QR code instantly, and download it as a PNG in one click. A three-state theme toggle (light, dark, system) keeps the interface comfortable in any environment.

- **Live demo:** https://safe-qr-ten.vercel.app/
- **Stack:** Next.js App Router · React 19 · shadcn/ui · Tailwind CSS · next-qrcode · next-themes

## Features

- Validate URLs client-side, with automatic `https://` prefixing for convenience
- Generate and display QR codes without storing any data server-side
- Download QR codes as PNG files (timestamped filenames)
- Lock/unlock state to prevent accidental edits after generation
- Theme toggle with light, dark, and system modes

## Getting Started

```bash
# install dependencies
npm install

# run the development server (http://localhost:3000)
npm run dev

# run linting
npm run lint

# create a production build
npm run build
```

The main interface lives in `src/app/page.tsx`; UI primitives are in `src/components/ui`, and theme management is handled by `next-themes` via `src/components/theme-provider.tsx` and the `ThemeToggle` component.

## Usage

1. Enter a valid URL (a green border confirms validation).
2. Click **Generate** to render the QR code and lock the form.
3. Use **Download** to save the PNG (`qr-code-<timestamp>.png`).
4. Press **Generate another QR Code** to reset the form and start over.

## Folder Structure Highlights

```
src/
  app/
    layout.tsx       // global providers and fonts
    page.tsx         // QR generator screen
  components/
    theme-toggle.tsx // light/dark/system dropdown
    ui/              // shadcn/ui primitives in use
  lib/
    utils.ts         // tailwind class helper
```

Feel free to open issues or submit pull requests if you spot bugs or have enhancements in mind. Enjoy building safer sharing flows with QR codes!

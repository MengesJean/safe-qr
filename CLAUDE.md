# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with turbopack (http://localhost:3000)
npm run dev

# Build production version with turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type checking (no emit)
npm run tsc
```

## Architecture Overview

Safe QR is a Next.js 15 QR code generator with Supabase authentication and history tracking.

### Core Components Structure
- **Authentication Flow**: Google OAuth via Supabase with session management
- **QR Generation**: Client-side QR code generation using `next-qrcode` library
- **Data Storage**: Supabase PostgreSQL with `qr_generations` table for history
- **Theme System**: `next-themes` with light/dark/system modes via Radix UI

### Key Architecture Patterns

**Authentication-Gated Features**: The main QR generator (`QrGeneratorWithAuth`) wraps the core functionality with auth checks. Unauthenticated users see a sign-in prompt, authenticated users access both generation and history tabs.

**Metadata Enrichment**: The `/api/metadata` route fetches title and image metadata from target URLs to enhance stored QR code records. This server-side endpoint handles HTML parsing and URL validation.

**Client-Side QR Generation**: QR codes are generated entirely client-side using `next-qrcode`, with no server-side QR processing or storage of QR images themselves.

**Session Management**: The `useSupabaseSession` hook provides reactive session state throughout the app, handling auth state changes and loading states.

### Database Schema

```sql
-- Core table for QR generation history
qr_generations (
  id uuid primary key,
  user_id uuid references auth.users,
  url text not null,
  title text,           -- Extracted from target URL metadata
  image_url text,       -- OG/Twitter image from target URL  
  generated_at timestamptz
)
```

### File Organization

- **`src/app/`**: Next.js App Router pages and API routes
- **`src/components/qr/`**: QR-specific components (generator, history, actions)
- **`src/components/ui/`**: shadcn/ui primitive components
- **`src/hooks/`**: Custom React hooks for Supabase integration
- **`src/lib/`**: Utility functions (Supabase client, QR logging, URL normalization)

### Environment Variables

Required for Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Styling Approach

Uses Tailwind CSS with `class-variance-authority` for component variants. Theme system supports light/dark modes with gradient backgrounds and backdrop blur effects throughout the UI.
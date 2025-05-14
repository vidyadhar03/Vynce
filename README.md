# Vynce - Minimal Build

A minimal version of Vynce that connects with Spotify to generate insights.

## Current Minimal Features

- Basic landing page with navigation
- Authentication (sign in, sign up, callbacks)
- Supabase integration
- Essential API routes

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase with SSR authentication
- TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x
- Supabase account
- Spotify Developer account (for future features)

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Required environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Database Setup

1. Push the database schema to Supabase:
```bash
supabase db push
```

2. Google OAuth Setup in Supabase:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Google provider
   - Add your Google client ID and secret
   - Set authorized redirect URL to: `[YOUR_SITE_URL]/auth/callback`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Code Style

- ESLint and Prettier are configured
- Husky pre-push hooks ensure code quality
- Run `npm run lint -- --max-warnings=0` to check for issues
- Run `npm run format` to format code

### Authentication

The app uses Supabase Auth with:
- Email authentication
- Google OAuth2 with PKCE flow
- Custom sign-in UI at `/sign-in`
- Route protection with middleware

## Deployment Build Checklist

Before deploying to Vercel, verify:

- [ ] **Type Checking**: Run `npm run type-check` to verify TypeScript types
- [ ] **Linting**: Run `npm run lint -- --max-warnings=0` to check for code style issues
- [ ] **Build**: Run `npm run build` to verify the project builds successfully

These checks run automatically in CI/CD and through Husky pre-push hooks.

## Removed Features (Coming Soon)

The following features have been temporarily removed to ensure a stable build:

- PWA functionality
- Playwright E2E tests
- Debug and test pages
- Instagram integration
- Detailed analytics
- Friend-Share Cards
- Marketing pages

## Deployment

The app is configured for streamlined deployment on Vercel:
- Next.js defaults for route handling
- Node.js 20.x runtime

## License

MIT

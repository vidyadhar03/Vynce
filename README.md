# Vynce

A PWA that lets users connect Spotify to generate fun insight-cards and share them on Instagram.

## Features

- **Mood Mirror**: See how your music reflects your emotional journey
- **Attention Tracker**: Discover what captures your interest on Instagram
- **Friend-Share Cards**: Create beautiful cards to share your insights

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase
- TypeScript
- SWR for data fetching
- next-pwa for PWA support

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Spotify Developer account
- Instagram Basic Display API access

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in the environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify

# Instagram API Configuration
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/callback/instagram
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

### Debug Tools

Visit [http://localhost:3000/debug/recent-users](http://localhost:3000/debug/recent-users) to see the 10 most recent Vynce users.

Visit [http://localhost:3000/api/supabase-status](http://localhost:3000/api/supabase-status) to check Supabase connection status.

## Development

### Code Style

- ESLint and Prettier are configured
- Husky pre-push hooks ensure code quality
- Run `npm run lint` to check for issues
- Run `npm run format` to format code

### Testing

```bash
npm test        # Run all tests
npm test -- --watch  # Run tests in watch mode
npx playwright test  # Run E2E tests with Playwright
```

### Authentication

The app uses Supabase Auth with:
- Email magic links (passwordless)
- Google OAuth2 with PKCE flow
- Custom sign-in UI at `/sign-in`
- Route protection with the `WithAuth` component

### PWA

The PWA features are enabled in production only. To test:

```bash
npm run build
npm start
```

## Local QA Checklist

Before pushing changes, ensure your code passes these local quality checks:

- [ ] **Type Checking**: Run `npm run type-check` to verify TypeScript types
- [ ] **Linting**: Run `npm run lint` to check for code style issues
- [ ] **Tests**: Run `npm test` to ensure all tests pass
- [ ] **Build**: Run `npm run build` to verify the project builds successfully
- [ ] **Authentication**: Test sign in, sign up, and OAuth flows
- [ ] **Responsive Design**: Test on mobile, tablet, and desktop viewports
- [ ] **Offline Mode**: Verify PWA functionality works in offline mode
- [ ] **Performance**: Check that page transitions and data fetching are smooth
- [ ] **Accessibility**: Verify forms have labels and images have alt text
- [ ] **Browser Compatibility**: Test in Chrome, Firefox, and Safari

All of these checks run automatically on pre-push through Husky hooks, but it's good practice to run them manually when making significant changes.

## Deployment

The app is configured for deployment on Vercel with:
- Edge runtime for API routes
- Node.js runtime for pages
- Automatic PWA optimization

## Privacy & Security

- End-to-end encryption for data transfer
- No permanent storage of social media data
- GDPR compliant
- User data control and deletion options

## License

MIT

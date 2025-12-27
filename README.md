<div align="center">
  <img src="./public/images/davince-logo.jpeg" alt="Davince Band Logo" width="200"/>

  # Next.js Testimonial Form

  **Production-ready testimonial collection with Google Sheets integration**

  [![CI](https://github.com/rafactx/nextjs-testimonial-form/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rafactx/nextjs-testimonial-form/actions/workflows/ci.yml)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Biome](https://img.shields.io/badge/Biome-2.3-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

  [Features](#features) • [Quick Start](#quick-start) • [CI/CD](#cicd-setup) • [Deployment](#deployment)
</div>

---

## About

Conversational testimonial form built with Next.js 16 App Router, featuring chat-style UI with typing animations. Data syncs automatically to Google Sheets.

Originally created for [Davince Band](https://davince.com.br), fully customizable for any testimonial collection use case.

**Live Demo**: [Coming soon]

### Key Highlights

- 🚀 **Modern Stack** - Next.js 16, React 19, TypeScript, Tailwind CSS 4, Biome
- 💬 **Chat Interface** - Conversational flow with realistic typing animations
- ⚡ **Performance** - Memoized components, debounced scrolling, optimized re-renders
- 📊 **Google Sheets** - Automatic data sync, no database required
- 🔒 **Secure** - Environment validation, CSP headers, server-side credentials
- 🎨 **Themeable** - Dark mode, customizable design tokens
- ♿ **Accessible** - WCAG compliant, keyboard navigation

## Features

**User Experience**
- Multi-step chat flow with typing animations
- Character count (250 limit) with live feedback
- Optional internal feedback field (not published)
- Review screen with inline editing
- Comprehensive loading & error states

**Technical**
- Server-side Google Sheets API integration
- Build-time environment validation
- Type-safe error handling with custom error classes
- Optimized image formats (AVIF/WebP)
- Security headers (CSP, X-Frame-Options, HSTS)
- Pre-commit hooks with Husky + lint-staged

## Quick Start

**Prerequisites**: [Bun](https://bun.sh/) ≥1.0 or Node.js ≥18

```bash
# Clone & install
git clone https://github.com/rafactx/nextjs-testimonial-form.git
cd nextjs-testimonial-form
bun install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Google Sheets credentials

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Google Sheets Setup

<details>
<summary><b>Complete configuration guide</b></summary>

#### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → **APIs & Services** → **Credentials**
3. **Create Credentials** → **Service Account**
4. Complete form → **Create** → Skip permissions → **Done**

#### 2. Generate JSON Key

1. Select service account → **Keys** tab
2. **Add Key** → **Create new key** → **JSON**
3. Download and store securely (never commit to git)

#### 3. Enable API

1. **APIs & Services** → **Library**
2. Search "Google Sheets API" → **Enable**

#### 4. Configure Spreadsheet

1. Create new Google Sheet
2. Share with service account email (from JSON) as **Editor**
3. Copy spreadsheet ID from URL: `docs.google.com/spreadsheets/d/{ID}/edit`

#### 5. Environment Variables

Map JSON values to `.env.local`:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SHEET_NAME=Sheet1
```

⚠️ **Important**: Keep `\n` in `PRIVATE_KEY` (they're line breaks, not literal text)

</details>

## CI/CD Setup

### GitHub Actions

The repository includes a CI workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)) that runs on push/PR:

1. **Lint & Check** - Biome linting, formatting, and type checking
2. **Build** - Next.js production build with mock env vars

**No secrets needed for CI** - build uses mock values to validate env var existence.

### Configuring Secrets (for deployment)

For production deployments on Vercel/other platforms:

1. **GitHub Environments** (recommended for security):
   - Settings → Environments → **New environment** (e.g., "Production")
   - Add secrets:
     - `GOOGLE_SHEETS_CLIENT_EMAIL`
     - `GOOGLE_SHEETS_PRIVATE_KEY`
     - `GOOGLE_SHEETS_SPREADSHEET_ID`
     - `GOOGLE_SHEETS_SHEET_NAME`
   - Configure **Required reviewers** for approval gate
   - Enable **Branch protection** on `main`

2. **Vercel Integration**:
   - Link GitHub repo to Vercel project
   - Add environment variables in Vercel dashboard
   - Auto-deploy on push to `main`

## Scripts

```bash
# Development
bun dev              # Start dev server with hot reload
bun build            # Production build
bun start            # Production server

# Code Quality
bun lint             # Run Biome linter
bun lint:fix         # Auto-fix Biome issues
bun format           # Format code with Biome
bun format:check     # Verify formatting
bun check            # Lint + format + fix (pre-commit)
bun ci               # CI mode (strict, no fixes)
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rafactx/nextjs-testimonial-form)

**Steps**:
1. Import repository on [vercel.com](https://vercel.com)
2. Add environment variables (see [Google Sheets Setup](#google-sheets-setup))
3. Deploy

**CLI**:
```bash
bun add -g vercel
vercel login
vercel --prod
```

### Other Platforms

Works with any Next.js-supporting platform:
- **Netlify** - Use Next.js Runtime plugin
- **Railway** - Auto-deploy from Git
- **Render** - Connect repository
- **AWS Amplify** - Git-based deployment

## Architecture

```
testimonial-form/
├── app/                    # Next.js App Router
│   ├── api/testimonials/  # Submission endpoint (POST)
│   ├── layout.tsx         # Root layout + ThemeProvider
│   └── page.tsx           # Main page
├── components/
│   ├── ui/               # Base components (shadcn/ui)
│   └── testimonial-form.tsx # Main form (585 lines)
├── lib/
│   ├── env.ts            # Build-time validation
│   ├── errors.ts         # Type-safe error classes
│   ├── google-sheets.ts  # Sheets API client
│   └── utils.ts          # Utilities (cn helper)
└── .github/workflows/    # CI pipeline
```

## Troubleshooting

### Build Errors

**`Variáveis de ambiente faltando`**
- **Cause**: Missing required env vars
- **Fix**: Verify `.env.local` has all 4 variables from [Google Sheets Setup](#google-sheets-setup)
- **CI**: Use mock values (already configured in [ci.yml](.github/workflows/ci.yml))

**`Error: Could not load the default credentials`**
- **Cause**: Invalid service account credentials
- **Fix**: Re-download JSON key, verify `PRIVATE_KEY` includes `\n` characters

### Runtime Errors

**`API Request failed with status 403`**
- **Cause**: Service account lacks spreadsheet access
- **Fix**: Share spreadsheet with service account email as Editor

**`Error: Unable to parse range`**
- **Cause**: `SHEET_NAME` doesn't match actual sheet name
- **Fix**: Check sheet tab name in Google Sheets (default: "Sheet1")

### Development Issues

**Pre-commit hook not running**
- **Fix**: `chmod +x .husky/pre-commit && git add .husky/pre-commit`

**Biome errors on CSS files**
- **Expected**: Biome skips CSS (Tailwind not supported), only lints TS/JS/JSON

**Port 3000 already in use**
- **Fix**: `lsof -ti:3000 | xargs kill -9` or change port: `bun dev -- -p 3001`

## Customization

### Theme

Modify design tokens in [app/globals.css](app/globals.css):

```css
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  /* Add custom colors */
}
```

### Messages

Edit conversation flow in [components/testimonial-form.tsx](components/testimonial-form.tsx):

```tsx
const botMessages: Record<Step, string[]> = useMemo(() => ({
  name: ["Custom greeting!", "What's your name?"],
  testimonial: ["Tell us about your experience..."],
  // ...
}), [])
```

### Data Schema

Testimonials saved to Google Sheets:

| Timestamp | Name | Testimonial | Internal Feedback |
|-----------|------|-------------|-------------------|
| 2025-12-27 10:30 | John Doe | Amazing! | Feature request X |

## Performance

**Optimizations**:
- Component memoization (`React.memo`)
- Callback stabilization (`useCallback`)
- Derived state memoization (`useMemo`)
- Debounced scroll (100ms timeout)
- Next.js Image (AVIF/WebP with blur placeholder)
- Tree-shaking (optimized imports)
- Gzip/Brotli compression

**Metrics** (estimated):
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick start**:
1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes + add Biome checks pass
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
5. Push and open PR

## License

MIT License - see [LICENSE](./LICENSE)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Biome](https://biomejs.dev/) - Fast linter & formatter
- [shadcn/ui](https://ui.shadcn.com/) - Component system
- [react-type-animation](https://react-type-animation.netlify.app/) - Typing effects
- [Google Sheets API](https://developers.google.com/sheets/api) - Data storage

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/rafactx">Rafael Teixeira</a></sub>

**[↑ Back to top](#nextjs-testimonial-form)**
</div>

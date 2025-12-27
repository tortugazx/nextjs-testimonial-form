<div align="center">
  <img src="./public/images/davince-logo.jpeg" alt="Davince Band Logo" width="200"/>
  
  # Next.js Testimonial Form
  
  **Production-ready testimonial collection with Google Sheets integration**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Bun](https://img.shields.io/badge/Bun-1.0-f9f1e1?style=for-the-badge&logo=bun)](https://bun.sh/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
  
  [Features](#features) • [Quick Start](#quick-start) • [Deployment](#deployment) • [Contributing](#contributing)
</div>

---

## About

A production-ready testimonial collection form built with Next.js 16, featuring a conversational chat interface with smooth typing animations. Data is automatically synced to Google Sheets for easy management and integration.

Originally created for Davince Band, this template is fully customizable for any project needing testimonial collection.

### Key Highlights

- **Modern Interface** - Chat-style UI with realistic typing animations
- **Performance Optimized** - Memoized components, debounced scrolling, optimized re-renders
- **Production Ready** - Environment validation, comprehensive error handling, security headers
- **Google Sheets Integration** - Automatic data sync with custom spreadsheets
- **CI/CD Pipeline** - GitHub Actions workflow included
- **Fully Responsive** - Works seamlessly across all device sizes
- **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation

## Features

### User Experience
- Interactive chat-based form flow with typing animations
- Real-time character count for testimonials (250 char limit)
- Optional internal feedback field (private, not published)
- Review screen with inline editing before submission
- Comprehensive loading states and error handling
- Smooth animations and transitions

### Technical
- Server-side Google Sheets API integration
- Environment variable validation at build time
- Optimized image formats (AVIF/WebP)
- Security headers (CSP, X-Frame-Options, CORS)
- TypeScript strict mode
- Automatic code formatting and linting
- Pre-commit hooks with Husky and lint-staged

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0 (or Node.js >= 18)
- Google Cloud account with Sheets API enabled
- Git

### Installation

Clone and install:

```bash
git clone https://github.com/rafactx/testimonial-form.git
cd testimonial-form
bun install
```

Configure environment:

```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials (see Google Sheets Setup below)
```

Start development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Google Sheets Setup

<details>
<summary><b>Complete configuration guide</b></summary>

#### Step 1: Create Service Account

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **Service Account**
5. Fill in details and click **Create**
6. Skip optional permissions and click **Done**

#### Step 2: Generate JSON Key

1. Select the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format and download
5. Store securely (never commit to version control)

#### Step 3: Enable API

1. In Cloud Console, go to **APIs & Services** > **Library**
2. Search "Google Sheets API"
3. Click **Enable**

#### Step 4: Configure Spreadsheet

1. Create a new Google Sheet
2. Share with service account email (from JSON file)
3. Grant **Editor** permissions
4. Extract spreadsheet ID from URL: `docs.google.com/spreadsheets/d/{ID}/edit`

#### Step 5: Environment Variables

Open the downloaded JSON file and map values to `.env.local`:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SHEET_NAME=Sheet1
```

**Important:** Preserve `\n` characters in `PRIVATE_KEY` - they represent line breaks.

</details>

## Scripts

```bash
# Development
bun dev              # Start development server with hot reload
bun build            # Build optimized production bundle
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
bun lint:fix         # Auto-fix ESLint errors
bun type-check       # TypeScript compiler check
bun format           # Format with Prettier
bun format:check     # Verify formatting
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rafactx/testimonial-form)

#### Dashboard Method

1. Sign in to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import Git repository
4. Add environment variables:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY` (include quotes and `\n`)
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SHEET_NAME`
5. Deploy

#### CLI Method

```bash
bun add -g vercel
vercel login
vercel --prod
```

### Alternative Platforms

Compatible with any Next.js-supporting platform:
- **Netlify** - Use Next.js plugin
- **AWS Amplify** - Connect Git repository
- **Railway** - One-click deployment
- **Render** - Auto-deploy from Git

## Project Structure

```
testimonial-form/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── testimonials/  # Submission endpoint
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Base UI primitives
│   └── testimonial-form.tsx # Main form component
├── lib/                   # Utilities
│   ├── env.ts            # Environment validation
│   ├── google-sheets.ts  # Sheets integration
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── styles/               # Global styles
└── .github/              # CI/CD workflows
```

## Security

- Environment variables validated at build time
- Security headers configured (CSP, X-Frame-Options, HSTS)
- Credentials never exposed to client-side
- Input validation and sanitization on backend
- No sensitive data in error messages
- HTTPS enforced in production

## Customization

### Theming

Modify theme variables in `@/app/globals.css`:

```css
@layer base {
  :root {
    --primary: 220 90% 56%;
    --secondary: 220 14% 96%;
    /* Add your colors */
  }
}
```

### Messages

Edit conversation flow in `@/components/testimonial-form.tsx`:

```tsx
const botMessages: Record<Step, string[]> = useMemo(() => ({
  name: ["Custom greeting", "What's your name?"],
  testimonial: ["Custom prompt"],
  // ...
}), [])
```

### Data Structure

Testimonials are saved with this schema:

| Timestamp | Name | Testimonial | Internal Feedback |
|-----------|------|-------------|-------------------|
| 1/27/2025 10:30 AM | John Doe | Great service! | Consider adding X feature |

## Performance

Optimizations implemented:

- **Component Memoization** - `React.memo()` prevents unnecessary re-renders
- **Callback Optimization** - `useCallback()` for stable references
- **State Memoization** - `useMemo()` for derived state
- **Debounced Scrolling** - Prevents scroll thrashing
- **Tree Shaking** - Optimized package imports
- **Image Optimization** - Next.js Image with AVIF/WebP
- **Compression** - Gzip/Brotli for responses

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Quick start:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Make changes with tests
4. Run `bun lint` and `bun type-check`
5. Commit with conventional format
6. Push and open Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component primitives
- [react-type-animation](https://react-type-animation.netlify.app/) - Typing effects
- [Google Sheets API](https://developers.google.com/sheets/api) - Data storage

## Support

- **Issues**: [GitHub Issues](https://github.com/rafactx/testimonial-form/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rafactx/testimonial-form/discussions)
- **Email**: rafactx@icloud.com

---

<div align="center">
  
**[↑ Back to top](#nextjs-testimonial-form)**

</div>

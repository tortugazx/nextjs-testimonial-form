<div align="center">
  <img src="./public/images/davince-logo.jpeg" alt="Davince Band Logo" width="200"/>
  
  # Davince Testimonial Form
  
  **Modern, animated testimonial collection form with Google Sheets integration**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Bun](https://img.shields.io/badge/Bun-1.0-f9f1e1?style=for-the-badge&logo=bun)](https://bun.sh/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
  
  [Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment)
</div>

---

## 📖 About

A production-ready testimonial collection form built for Davince Band, featuring a conversational chat-like interface with smooth typing animations. Data is automatically saved to Google Sheets for easy management and integration.

### ✨ Highlights

- 🎨 **Modern UI/UX** - Chat-style interface with typing animations
- ⚡ **Performance Optimized** - Memoized components, debounced scrolling, and optimized re-renders
- 🔒 **Production Ready** - Environment validation, error handling, and security headers
- 📊 **Google Sheets Integration** - Automatic data sync with custom spreadsheets
- 🚀 **CI/CD Ready** - GitHub Actions workflow included
- 📱 **Responsive Design** - Works seamlessly on all device sizes
- ♿ **Accessible** - WCAG compliant with proper ARIA labels

## 🎯 Features

### User Experience
- Interactive chat-based form flow
- Real-time character count for testimonials (250 char limit)
- Optional internal feedback field (private, not published)
- Review screen before submission
- Inline editing of all fields
- Loading states and error handling

### Technical Features
- Server-side Google Sheets API integration
- Environment variable validation at build time
- Optimized image formats (AVIF/WebP)
- Security headers (CSP, X-Frame-Options, etc.)
- TypeScript strict mode
- Automatic code formatting with Prettier
- Pre-commit hooks with Husky

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- Google Cloud account with Sheets API enabled
- Node.js >= 18 (for compatibility)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rafactx/davince-form.git
   cd davince-form
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Google Sheets credentials (see [Google Sheets Setup](#google-sheets-setup))

4. **Run development server**
   ```bash
   bun dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Google Sheets Setup

<details>
<summary><b>Step-by-step configuration guide</b></summary>

#### 1. Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Fill in the details and click **Create**
6. Skip optional permissions and click **Done**

#### 2. Generate JSON Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the file (keep it secure!)

#### 3. Enable Google Sheets API

1. In Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

#### 4. Configure Your Spreadsheet

1. Create a new Google Sheet
2. Share it with the service account email (found in JSON file)
3. Grant **Editor** permissions
4. Copy the spreadsheet ID from URL: `docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

#### 5. Set Environment Variables

Open your downloaded JSON file and copy these values to `.env.local`:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SHEET_NAME=Sheet1
```

> ⚠️ **Important:** Keep the `\n` characters in `PRIVATE_KEY` - they represent line breaks.

</details>

## 📦 Scripts

```bash
# Development
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
bun lint:fix         # Fix ESLint errors
bun type-check       # Run TypeScript compiler check
bun format           # Format code with Prettier
bun format:check     # Check code formatting
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rafactx/davince-form)

#### Via Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your Git repository
4. Configure **Environment Variables**:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY` (include quotes and `\n`)
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SHEET_NAME`
5. Click **Deploy**

#### Via CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Other Platforms

This project can be deployed to any platform that supports Next.js:
- **Netlify**: Use the Next.js plugin
- **AWS Amplify**: Connect your Git repository
- **Railway**: One-click deploy from GitHub
- **Render**: Auto-deploy from Git

## 🏗️ Project Structure

```
davince-form/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── testimonials/  # Testimonial submission endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── testimonial-form.tsx
├── lib/                   # Utilities and helpers
│   ├── env.ts            # Environment validation
│   ├── google-sheets.ts  # Google Sheets integration
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
└── .github/              # GitHub Actions workflows
```

## 🔒 Security

- ✅ Environment variables validated at build time
- ✅ Security headers configured (CSP, X-Frame-Options, etc.)
- ✅ Credentials never exposed to client
- ✅ Input validation on backend
- ✅ No sensitive data in error messages
- ✅ HTTPS enforced in production

## 🎨 Customization

### Styling

The project uses **Tailwind CSS 4** with custom theme configuration. Modify `@/app/globals.css` for theme variables:

```css
@layer base {
  :root {
    --primary: 220 90% 56%;
    --secondary: 220 14% 96%;
    /* ... */
  }
}
```

### Form Messages

Edit bot messages in `@/components/testimonial-form.tsx`:

```tsx
const botMessages: Record<Step, string[]> = useMemo(() => ({
  name: ["Your custom greeting here!", "What's your name?"],
  // ...
}), [])
```

## 📊 Data Structure

Testimonials are saved to Google Sheets with the following structure:

| Timestamp | Name | Testimonial | Internal Feedback |
|-----------|------|-------------|-------------------|
| 12/27/2024 10:30 AM | John Doe | Amazing band! | Maybe more MPB songs |

## 🧪 Performance Optimizations

- **Component Memoization**: `React.memo()` on all presentation components
- **Callback Optimization**: `useCallback()` for event handlers
- **State Memoization**: `useMemo()` for computed values
- **Debounced Scrolling**: Prevents scroll thrashing
- **Package Imports**: Optimized with `optimizePackageImports`
- **Image Optimization**: AVIF/WebP with responsive sizes
- **Compression**: Gzip enabled for all responses

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [react-type-animation](https://react-type-animation.netlify.app/)
- Deployed on [Vercel](https://vercel.com)

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/rafactx/davince-form/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/rafactx/davince-form/discussions)
- 📧 **Email**: [Your email here]

---

<div align="center">
  Made with ❤️ for Davince Band
  
  **[⬆ back to top](#davince-testimonial-form)**
</div>

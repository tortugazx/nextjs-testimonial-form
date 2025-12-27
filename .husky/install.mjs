// Skip Husky installation in CI environments (Vercel, GitHub Actions, etc.)
if (process.env.CI || process.env.VERCEL) {
  process.exit(0)
}

// Import and run Husky installer for local development
const husky = (await import('husky')).default
console.log(husky())

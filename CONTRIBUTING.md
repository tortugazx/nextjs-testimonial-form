# Contributing to Davince Testimonial Form

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Browser, Node/Bun version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies** with `bun install`
3. **Make your changes** following our code style
4. **Add tests** if applicable
5. **Ensure tests pass** with `bun test` (if we add tests)
6. **Lint your code** with `bun run lint`
7. **Format your code** with `bun run format`
8. **Commit with a descriptive message**
9. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/nextjs-testimonial-form.git
cd nextjs-testimonial-form

# Install dependencies
bun install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
bun dev
```

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types when possible
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React

- Use functional components with hooks
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo()` for presentation components
- Keep components small and focused

### Formatting

- We use **Prettier** for code formatting
- Run `bun run format` before committing
- 2 spaces for indentation
- Single quotes for strings
- No semicolons
- Trailing commas in ES5

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new animation to testimonial form
fix: resolve scroll issue on mobile
docs: update README with deployment steps
style: format code with prettier
refactor: extract validation logic to separate file
perf: optimize image loading
test: add unit tests for form validation
chore: update dependencies
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `perf/description` - Performance improvements

## Project Structure

```
davince-form/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── *.tsx           # Feature components
├── lib/                # Utilities and helpers
│   ├── env.ts          # Environment validation
│   ├── google-sheets.ts # Google Sheets API
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```

## Testing

Currently, this project doesn't have automated tests. Contributions adding test coverage are highly welcome!

When we add testing:
- Unit tests with **Vitest** or **Jest**
- Component tests with **React Testing Library**
- E2E tests with **Playwright**

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update .env.local.example if you add new environment variables

## Performance

We care about performance:
- Keep bundle size small
- Optimize images (use AVIF/WebP)
- Memoize expensive operations
- Use React Profiler to check for unnecessary re-renders
- Test on slow 3G networks

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios (WCAG AA)

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Check existing issues and PRs

## Recognition

Contributors will be recognized in our README.md. Thank you for making this project better! 🙏

---

By contributing, you agree that your contributions will be licensed under the MIT License.

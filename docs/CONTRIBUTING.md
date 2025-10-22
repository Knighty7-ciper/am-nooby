# Contributing to NoobBlog

Thank you for your interest in contributing to NoobBlog! 🎉

## Code of Conduct

Be respectful, inclusive, and considerate in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/Knighty7-ciper/noobblog/issues)
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features

1. Check existing feature requests
2. Open a new issue with:
   - Clear description of feature
   - Use cases
   - Mockups if applicable
   - Why it's needed

### Pull Requests

1. **Fork the repository**

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/noobblog.git
   cd noobblog
   \`\`\`

3. **Create a branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

4. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

5. **Make your changes**
   - Follow code style
   - Add tests if applicable
   - Update documentation

6. **Test your changes**
   \`\`\`bash
   pnpm lint
   pnpm build
   \`\`\`

7. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add amazing feature"
   \`\`\`

   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Adding tests
   - `chore:` Maintenance

8. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

9. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template
   - Submit!

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database (Neon)

### Quick Start

\`\`\`bash
# Clone repo
git clone https://github.com/Knighty7-ciper/noobblog.git
cd noobblog

# Run setup script
./setup.sh  # Linux/Mac
setup.bat   # Windows

# Start development
pnpm dev:web    # Main site on :3000
pnpm dev:admin  # Admin on :3001
\`\`\`

## Project Structure

\`\`\`
noobblog/
├── apps/
│   ├── web/        # Main blog application
│   └── admin/      # Admin dashboard
├── packages/
│   ├── database/   # Prisma schema and client
│   └── ui/         # Shared UI components
└── docs/          # Documentation
\`\`\`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types
- Avoid `any` type
- Use interfaces for objects

### React

- Use functional components
- Use hooks appropriately
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions

- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_CASE`
- Files: `kebab-case.tsx`

### Code Style

- 2 spaces indentation
- Single quotes for strings
- Semicolons required
- Trailing commas
- Run `pnpm format` before committing

## Testing

### Writing Tests

\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
\`\`\`

### Running Tests

\`\`\`bash
pnpm test
pnpm test:watch
pnpm test:coverage
\`\`\`

## Database Changes

### Updating Schema

1. Edit `packages/database/prisma/schema.prisma`
2. Run migration:
   \`\`\`bash
   cd packages/database
   pnpm db:push
   \`\`\`
3. Update seed if needed
4. Document changes

## Documentation

- Update relevant docs when changing features
- Add JSDoc comments to functions
- Include examples for complex features
- Keep README up to date

## PR Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Build

2. **Code review** by maintainer:
   - Code quality
   - Follows guidelines
   - Tests included
   - Documentation updated

3. **Approval and merge**

## Release Process

1. Version bump
2. Update CHANGELOG
3. Create release notes
4. Tag release
5. Deploy to production

## Need Help?

- **Discord**: [Join our community](#)
- **Email**: dev@noobblog.com
- **Discussions**: Use GitHub Discussions

## Recognition

All contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Featured on our website

Thank you for making NoobBlog better! 🚀

<![CDATA[<div align="center">

# 🤝 CONTRIBUTING TO SPORTZONE

### Guidelines for Contributing to This Project

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Code Style](#code-style)
4. [Commit Messages](#commit-messages)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Issues](#reporting-issues)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)
- Git

### Fork & Clone

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/sportzone.git
cd sportzone

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_USERNAME/sportzone.git

# 4. Create a feature branch
git checkout -b feature/your-feature-name
```

---

## Development Setup

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your local configuration
```

### 3. Start Development Servers

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:server   # Backend only
npm run dev:client   # Frontend only
npm run dev:ai       # AI service only
```

### 4. Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npm run seed
```

---

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Avoid `any` type when possible

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUserName = (user: User): string => user.name;

// ❌ Bad
const getUserName = (user: any) => user.name;
```

### React Components

```tsx
// ✅ Good - Functional component with proper typing
import { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

### CSS/Tailwind

```tsx
// ✅ Good - Use Tailwind classes
<div className="flex items-center gap-4 p-6 bg-dark-200 rounded-lg">

// ❌ Bad - Avoid inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### API Routes

```typescript
// ✅ Good - Proper error handling
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug }
    });
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    res.json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
# Feature
git commit -m "feat(cart): add quantity increment/decrement buttons"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(api): update product endpoints documentation"

# Refactor
git commit -m "refactor(server): extract validation middleware"
```

---

## Pull Request Process

### 1. Create Your Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, readable code
- Follow code style guidelines
- Add tests if applicable
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests (if available)
npm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat(your-feature): description"
```

### 5. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then on GitHub:
1. Click "Compare & pull request"
2. Fill in the PR template
3. Add labels if applicable
4. Request review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
```

---

## Reporting Issues

### Bug Reports

Include:
- **Description**: Clear description of the bug
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, Node version

### Feature Requests

Include:
- **Description**: Clear description of the feature
- **Use case**: Why this feature is needed
- **Proposed solution**: How you think it could work
- **Alternatives considered**: Other approaches

---

## Project Structure

```
sportzone/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── features/    # Redux slices
│   │   └── services/    # API calls
│
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── services/    # External services
│
└── ai-service/          # Python AI service
```

---

## Questions?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Create a new discussion

---

<div align="center">

**Thank you for contributing to SportZone! 🏃‍♂️**

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>
]]>
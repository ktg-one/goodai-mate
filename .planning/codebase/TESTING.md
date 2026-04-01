# Testing Patterns

**Analysis Date:** 2026-04-01

## Test Framework Status

**Current State:** Testing infrastructure declared but not yet implemented

**Runner:**
- Framework: Vitest (planned, not yet installed)
- Test config file location: `vitest.config.ts` (not present in codebase)
- E2E framework: Playwright (planned, not yet installed)

**Note:** The `__tests__/` directory structure exists with `unit/`, `integration/`, and `e2e/` subdirectories, but no test files are present.

## Test File Organization

**Location Pattern:**
- Unit tests: `__tests__/unit/`
- Integration tests: `__tests__/integration/`
- E2E tests: `__tests__/e2e/`
- Mirror source structure expected: tests parallel `src/` organization

**Directory Structure:**
```
__tests__/
├── unit/              # Unit tests for components, utilities, hooks
├── integration/       # Integration tests for features
└── e2e/              # End-to-end tests (Playwright)
```

**Expected Naming Convention:**
- Unit test for `src/components/ui/button.tsx`: `__tests__/unit/components/ui/button.test.tsx`
- Unit test for `src/lib/utils.ts`: `__tests__/unit/lib/utils.test.ts`
- Integration test: `__tests__/integration/[feature-name].test.tsx`
- E2E test: `__tests__/e2e/[feature-name].spec.ts`

## Planned Test Structure

**Expected Pattern (based on declared framework):**
```typescript
// Example test structure for Vitest
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="outline">Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('outline')
  })
})
```

## Testing Requirements (from CLAUDE.md)

**Unit Testing (Vitest):**
- Test components in isolation
- Test utility functions with various inputs
- Test error cases and edge conditions

**E2E Testing (Playwright):**
- Test user workflows across pages
- Test navigation and routing
- Test forms end-to-end

## Planned Patterns

### Unit Test Setup
- Use Vitest as the test runner
- Testing library utilities for component testing
- Mock external dependencies with Vitest mocking utilities

### Mocking Strategy (planned)
- Mock `next/image` for image components
- Mock `next/navigation` for routing in tests
- Mock `next/font/google` for font loading
- Mock external API calls

### What to Test
- Component rendering with various props
- User interactions (clicks, form submissions)
- Variant application (button sizes, colors)
- Conditional rendering based on props
- Error states and validation messages

### What NOT to Mock
- Internal component composition
- Utility functions like `cn()` (test directly)
- Radix UI primitives (use as-is in tests)

## Testing Patterns for Components

**Form Components (react-hook-form):**
- Use `FormProvider` wrapper in tests
- Test validation error display
- Test form submission
- Mock form submission handlers

**Dialog Components (Radix UI):**
- Test open/close state transitions
- Test content rendering when open
- Test close button functionality
- Test overlay interaction

**UI Variants:**
- Test each variant renders correctly
- Test size variations
- Test dark mode variants
- Verify className application

## Test Commands (anticipated)

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests only
npm run test:unit        # Unit tests only
```

## Coverage Goals

**Target:** Not yet enforced

**Coverage measurement:**
- Planned via Vitest coverage reporter
- Command: `npm run test:coverage`
- Expected to follow: 80% statements, 75% branches, 80% functions, 80% lines

## Test Data & Fixtures

**Location:** Not yet established

**Planned location:** `__tests__/fixtures/` or `__tests__/mocks/`

**Mock data pattern:**
```typescript
// Expected structure for mock factories
export const createMockButton = (overrides = {}) => ({
  variant: 'default',
  size: 'default',
  ...overrides,
})

export const mockApiResponse = <T>(data: T) => ({
  data,
  error: null,
  code: 200,
})
```

## Environment Setup for Testing

**Required packages (declared in CLAUDE.md but not installed):**
- `vitest` — test runner
- `@testing-library/react` — component testing utilities
- `@testing-library/jest-dom` — matchers for assertions
- `@playwright/test` — E2E testing
- `jsdom` or `happy-dom` — DOM simulation for unit tests

**Setup files needed:**
- `vitest.config.ts` — Vitest configuration
- `playwright.config.ts` — Playwright configuration
- `__tests__/setup.ts` — Test environment setup

## Async Testing Pattern

**Expected pattern for async operations:**
```typescript
it('handles async operations', async () => {
  render(<Component />)
  const result = await screen.findByText('loaded')
  expect(result).toBeInTheDocument()
})
```

**For form submission:**
```typescript
it('submits form', async () => {
  const handleSubmit = vi.fn()
  render(<FormComponent onSubmit={handleSubmit} />)
  
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  await waitFor(() => expect(handleSubmit).toHaveBeenCalled())
})
```

## Component Testing Approach

**For CVA Components (Button, Badge, etc.):**
- Test base class application
- Test variant props
- Test size props
- Test className merging (cn utility)
- Test data-attributes are set

**Example for Button component:**
```typescript
describe('Button', () => {
  it('applies variant classes correctly', () => {
    const { container } = render(
      <Button variant="outline">Test</Button>
    )
    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveAttribute('data-variant', 'outline')
  })
})
```

## Integration Testing Approach

**Form Workflows:**
- Test complete form submission with validation
- Test error handling and display
- Test field interdependencies

**API Integration:**
- Mock API responses using MSW (Mock Service Worker) or vitest mocks
- Test loading states
- Test error states
- Test success states

## E2E Testing Approach

**Navigation:**
```typescript
// Example Playwright test
test('navigate and interact with page', async ({ page }) => {
  await page.goto('/')
  await page.click('button')
  await expect(page).toHaveTitle('Expected Title')
})
```

**Form Submission:**
```typescript
test('submit form end-to-end', async ({ page }) => {
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await page.waitForURL('/success')
})
```

## Current Testing Status

**Test Files:** None present

**Next Steps to Implement Testing:**
1. Install Vitest, Testing Library, and Playwright packages
2. Create `vitest.config.ts` with jsdom environment
3. Create `playwright.config.ts` for E2E configuration
4. Create `__tests__/setup.ts` for test environment
5. Write first unit test for `src/lib/utils.ts` (cn function)
6. Write component tests for `src/components/ui/button.tsx`
7. Write form integration test
8. Write E2E tests for main workflows

## TypeScript in Tests

**Pattern:**
- Use TypeScript in test files
- Vitest provides full TypeScript support
- Type test utilities and mocks
- Use `satisfies` operator for type checking test data

---

*Testing analysis: 2026-04-01*

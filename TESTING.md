# Testing Guide for Weekendly

This document describes the testing setup and how to run tests for the Weekendly application.

## Testing Framework

Weekendly uses **Vitest** with **React Testing Library** for testing. This provides:
- Fast test execution
- Excellent React component testing utilities
- Built-in TypeScript support
- Snapshot testing capabilities

## Running Tests

### All Tests
```bash
npm test
```

### Run Tests Once (CI mode)
```bash
npm run test:run
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- ActivityCard.test.tsx
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Test Structure

### Unit Tests
- **`src/state/reducer.test.ts`** - Tests for state management logic
- **`src/utils/holidays.test.ts`** - Tests for holiday detection utilities
- **`src/hooks/usePersist.test.ts`** - Tests for localStorage persistence

### Component Tests
- **`src/components/ActivityCard.test.tsx`** - Tests for activity card component
- **`src/components/HolidayBanner.test.tsx`** - Tests for holiday suggestion banner
- **`src/components/ScheduleView.test.tsx`** - Snapshot tests for schedule view
- **`src/components/DragAndDrop.test.tsx`** - Tests for drag and drop functionality

### Test Utilities
- **`src/test/setup.ts`** - Global test setup and mocks
- **`src/test/test-utils.tsx`** - Custom render function and test helpers

## Test Coverage

The test suite covers:

### Core Functionality
- ✅ Activity selection and scheduling
- ✅ Activity removal and editing
- ✅ Drag and drop interactions
- ✅ State persistence (localStorage)
- ✅ Holiday detection and suggestions
- ✅ Weekend type switching

### Component Behavior
- ✅ ActivityCard rendering and interactions
- ✅ HolidayBanner display and dismissal
- ✅ ScheduleView with different weekend types
- ✅ Form submissions and validation

### Edge Cases
- ✅ Corrupted localStorage data
- ✅ Missing activity properties
- ✅ Invalid drag and drop operations
- ✅ Dismissed holiday suggestions

## Writing New Tests

### Component Tests
```typescript
import { render, screen, userEvent } from '../test/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### Snapshot Tests
```typescript
import { render } from '../test/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('matches snapshot', () => {
    const { container } = render(<MyComponent />);
    expect(container).toMatchSnapshot();
  });
});
```

### Unit Tests
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('returns expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Mocking

### External Libraries
- `@dnd-kit/core` - Drag and drop functionality
- `html2canvas` - Image export functionality
- `localStorage` - Browser storage

### Browser APIs
- `matchMedia` - Media queries
- `ResizeObserver` - Element size observation
- `IntersectionObserver` - Element visibility

## CI/CD

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Multiple Node.js versions (18.x, 20.x)

The CI pipeline includes:
1. Dependency installation
2. Linting (if configured)
3. Test execution
4. Build verification
5. Coverage reporting

## Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the user sees and does
2. **Use Semantic Queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock External Dependencies** - Keep tests isolated and fast
4. **Test Edge Cases** - Include error states and boundary conditions
5. **Keep Tests Simple** - One assertion per test when possible
6. **Use Descriptive Names** - Test names should explain the expected behavior

## Troubleshooting

### Common Issues

**Tests fail with "Cannot find module"**
- Ensure all dependencies are installed: `npm install`
- Check import paths are correct

**Component tests fail with context errors**
- Wrap components with `WeekendProvider` using the custom render function

**Drag and drop tests fail**
- Ensure mocks are properly set up in `setup.ts`
- Check that drag events are properly simulated

**Snapshot tests fail**
- Review the diff to ensure changes are intentional
- Update snapshots with: `npm test -- --update-snapshots`

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --reporter=verbose
```

### Coverage Reports
View detailed coverage reports:
```bash
npm test -- --coverage
open coverage/index.html
```

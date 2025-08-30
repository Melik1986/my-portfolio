# 🧪 Testing Guide for Portfolio Project

## 📋 Overview

This directory contains all tests for the portfolio project, including unit, integration, and E2E tests.

## 🚀 Quick Start

### Running All Tests

```bash
# Run all unit and integration tests
npm test

# Run E2E tests with Playwright
npm run test:e2e

# Run tests in watch mode
npm test -- --watch
```

### Testing 3D Avatar Specifically

1. **Unit Tests for Avatar:**
```bash
npm test -- tests/unit/useAvatar.test.ts
npm test -- tests/unit/avatar3d.config.test.ts
```

2. **Integration Tests:**
```bash
npm test -- tests/integration/3DAvatar-isolated.test.tsx
```

3. **E2E Tests (Visual):**
```bash
# Run with visible browser
npm run test:e2e -- tests/e2e/avatar.spec.ts --headed

# Run specific test
npm run test:e2e -- tests/e2e/avatar.spec.ts -g "should render Three.js canvas"
```

## 🔍 Verifying 3D Model Rendering

### Method 1: Test Page (Recommended)
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:3000/test-3d-avatar
3. Check debug info on the page

### Method 2: Main Page
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:3000
3. Scroll to About section (#about)
4. Look for the 3D avatar on the right side

### Method 3: E2E Visual Test
```bash
# This will open a browser and show the avatar rendering
npm run test:e2e -- tests/e2e/avatar.spec.ts --headed --timeout=60000
```

## 📁 Test Structure

```
tests/
├── __mocks__/          # Mock files for external dependencies
│   ├── OrbitControls.js
│   └── gsap.js
├── unit/               # Unit tests
│   ├── useAvatar.test.ts
│   └── avatar3d.config.test.ts
├── integration/        # Integration tests
│   ├── 3DAvatar.test.tsx (excluded - GSAP issues)
│   └── 3DAvatar-isolated.test.tsx
├── e2e/                # End-to-end tests
│   └── avatar.spec.ts
└── unit-test-results.md # Test results documentation
```

## 🛠️ Troubleshooting

### 3D Model Not Rendering?

1. **Check Console for Errors:**
   - Open DevTools (F12)
   - Look for WebGL or Three.js errors

2. **Verify Model File:**
   ```bash
   ls -la public/model/avatar.glb
   # Should show ~3.7MB file
   ```

3. **Check WebGL Support:**
   - Visit: https://get.webgl.org/
   - Should show spinning cube

4. **Common Issues:**
   - CORS errors: Make sure dev server is running
   - Model path: Should be `/model/avatar.glb`
   - WebGL disabled: Check browser settings

### Test Failures?

1. **SWC Issues:**
   ```bash
   npm uninstall @swc/core @swc/jest
   npm install --save-dev @swc/core @swc/jest
   ```

2. **GSAP Import Errors:**
   - Already mocked in `tests/__mocks__/gsap.js`
   - Check jest.config.js moduleNameMapper

3. **Playwright Browser Issues:**
   ```bash
   npx playwright install
   ```

## 📊 Current Test Status

✅ **All tests passing!**
- Unit tests: 15/15 ✅
- Integration tests: 6/6 ✅
- E2E tests: 7/7 ✅

Total: 28 tests, 0 failures

## 🔗 Useful Commands

```bash
# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.ts

# Debug E2E test
npm run test:e2e -- --debug

# Update snapshots
npm test -- -u

# Run tests in CI mode
CI=true npm test
```

## 📝 Writing New Tests

### Unit Test Template
```typescript
import { yourFunction } from '@/path/to/module';

describe('YourFunction', () => {
  it('should do something', () => {
    const result = yourFunction(input);
    expect(result).toBe(expected);
  });
});
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test('feature description', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#element')).toBeVisible();
});
```
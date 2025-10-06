# Playwright Integration Tests

## Overview

These tests cover ALL user stories from the requirements document using Playwright for end-to-end testing across Chrome, Firefox, and Safari.

## Prerequisites

1. Node.js 18+ installed
2. Spring Boot application running on `http://localhost:8080`
3. Webcam available for camera tests
4. Shelly Duo GU10 bulb on local network (for full integration tests)

## Installation

```bash
cd tests/playwright
npm install
npx playwright install
```

## Running Tests

### All tests (all browsers)
```bash
npm test
```

### Specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### With visible browser (headed mode)
```bash
npm run test:headed
```

### Debug mode
```bash
npm run test:debug
```

## Test Structure

Tests are organized by requirement categories:

1. **Camera Integration** - Requirements 1.x
2. **Manual Color Control** - Requirements 2.x
3. **Automatic Mode** - Requirements 3.x
4. **UI Visibility** - Requirements 6.x
5. **Error Handling** - Requirements 8.x
6. **Cross-Browser** - Requirements 7.x

## TDD Approach

All tests are written to FAIL initially with descriptive error messages. As you implement features:

1. Run the tests to see which ones fail
2. Implement the feature
3. Run tests again to verify they pass
4. Move to the next failing test

## Notes

- Tests require camera permissions - grant when prompted
- Some tests require actual Shelly bulb for full validation
- Tests run sequentially to avoid camera access conflicts
- The web server starts automatically before tests run

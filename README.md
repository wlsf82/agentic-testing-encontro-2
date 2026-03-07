# agentic-testing-encontro-2

[![CI](https://github.com/wlsf82/agentic-testing-encontro-2/actions/workflows/ci.yml/badge.svg)](https://github.com/wlsf82/agentic-testing-encontro-2/actions/workflows/ci.yml)

## EngageSphere Test Suite

A comprehensive Cypress test suite for the EngageSphere application, covering all core functionality, user interactions, and API integrations.

### Test Coverage

The test suite includes the following test scenarios:

#### 1. Core Application Features

- Theme toggle (light/dark mode)
- Personalized greeting with user name and current date

#### 2. Cookie Consent Management

- Accept cookies functionality
- Decline cookies functionality

#### 3. Customer List and Data Filtering

- Initial data load from API
- Filter by company size
- Filter by industry
- Combined filters (size + industry)

#### 4. Pagination and Display Limits

- Next page navigation
- Adjustable items per page
- Pagination with active filters

#### 5. Customer Details Management

- View customer details
- Toggle address visibility
- Return to customer list
- Filter state persistence after viewing details

#### 6. External Integrations and Data Export

- Footer links validation (Podcast, Courses, Blog, YouTube)
- CSV download functionality

### Running the Tests

#### Prerequisites

```bash
npm install
```

#### Open Cypress Test Runner

```bash
npx cypress open
```

#### Run Tests in Headless Mode

```bash
npx cypress run
```

#### Run Specific Test Suite

```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

### Configuration

- **Base URL**: `https://engage-sphere.vercel.app/`
- **API Base URL**: `https://whispering-meadow-44853-562f20cee791.herokuapp.com`
- **Retries**: 2 retries in run mode, 0 in open mode

### Test Structure

The test suite is organized into logical groups:

- Each test group uses `beforeEach` hooks for proper setup
- API requests are intercepted and mocked for reliable testing
- Tests include proper assertions for UI state and data validation
- Combined scenarios test complex user workflows

### Notes

- All test cases are based on the specifications in [`docs/EngageSphere-Automated-Test-Cases.md`](./docs/EngageSphere-Automated-Test-Cases.md)
- API interceptors ensure consistent test data and faster execution
- Tests verify both UI elements and their behavior
- Download tests verify CSV file creation in the downloads folder

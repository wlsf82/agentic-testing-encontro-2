# Cypress Test Organization

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for organizing test files, using hooks effectively, and structuring test cases with the AAA pattern.

## Hooks

To avoid repetitive steps inside `cypress/e2e/**/*.cy.{js,ts}` files, use the `beforeEach` hook.

Below is an example.

```js
// cypress/e2e/settings/settings.cy.{js,ts}

describe("Settings", () => {
  beforeEach(() => {
    cy.login(); // Login first using a custom command.
  });

  it("access the settings page", () => {
    // Already logged in, continue doing whatever this test should do.
  });

  it("does something else", () => {
    // Already logged in, continue doing whatever this test should do.
  });
});
```

### `before`, `after`, and `afterEach`

- Avoid the `before` hook to ensure tests inside the same file can be ran independently.
- Do not use the `after` and `afterEach` hooks to avoid leaving trash behind in case Cypress crashes and never runs such hooks. Instead, we cleanup first using the `beforeEach` hook.

## `testIsolation`

It's strictly forbidden to define `testIsolation: false` in the `cypress.config.{js,ts}` file.

> This ensures every test case is written with test-independence in mind.

## Using `context` for Sub-features

When writing tests for a feature that has sub-features, divide them using the `context` function.

**Good example** 👍

```js
describe("Auth", () => {
  context("Login", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    // Login tests here
  });

  context("Sign in", () => {
    beforeEach(() => {
      cy.visit("/sign-in");
    });

    // Sign in tests here
  });
});
```

> `context` functions can have their own `beforeEach` hook if needed.

**Good example - 2** 👍

```js
describe("Main Feature", () => {
  beforeEach(() => {
    // Common steps shared between `context`s
  });

  context("Sub-feature", () => {
    beforeEach(() => {
      // Common steps of a specific `context`
    });

    // Sub-feature tests here
  });

  context("Sub-feature-2", () => {
    beforeEach(() => {
      // Common steps of another specific `context`
    });

    // Sub-feature-2 tests here
  });
});
```

> If many `context`s have common setup steps, they can share a `beforeEach` in an upper `context` or in the main `describe` function.

**Bad example** 👎

```js
describe("Auth", () => {
  // Test cases of auth sub-features mixed up all together.

  it("login test sample", () => {});

  it("sign in test sample", () => {});

  it("forgot password test sample", () => {});
});
```

## Arrange, Act, Assert (AAA) Pattern

Follow the AAA (Arrange, Act, Assert) pattern for writing tests, and separate each of them between a blank line.

### Example 1

```js
describe("Login", () => {
  it("logs in successfully", () => {
    // Arrange
    cy.visit("/login");

    // Act
    cy.env(["USERNAME", "PASSWORD"]).then(({ USERNAME, PASSWORD }) => {
      cy.get('input[data-testid="username"]').type(USERNAME);
      cy.get('input[data-testid="password"]').type(PASSWORD, {
        log: false,
      });
      cy.contains("button", "Login").click();
    });

    // Assert
    cy.url().should("be.equal", "https://example.com/dashboard");
    cy.contains("h1", "Welcome to the Dashboard").should("be.visible");
  });
});
```

### Example 2 - Many tests with the same arrange steps

```js
describe("Dashboard", () => {
  beforeEach(() => {
    // Arrange
    cy.sessionLogin();
    cy.visit("/dashboard");
  });

  it("opens the dashboard menu", () => {
    // Act
    cy.get("#dashboard-menu-btn").click();

    // Assert
    cy.get("#dashboard-menu-modal").should("be.visible");
  });

  it("closes the dashboard menu", () => {
    // Act
    cy.get("#dashboard-menu-btn").click();
    cy.get("#dashboard-menu-btn").click();

    // Assert
    cy.get("#dashboard-menu-modal").should("not.exist");
  });
});
```

> If many tests share the same arrange steps, move them to the `beforeEach` hook.

### Example 3 - Intermediate Assertions

Sometimes, intermediate assertions might be needed before the final ones to ensure the elements we want to interact with are really there.

```js
describe("Login", () => {
  it("logs in successfully", () => {
    // Arrange
    cy.visit("/login");

    cy.env(["USERNAME", "PASSWORD"]).then(({ USERNAME, PASSWORD }) => {
      cy.get('input[data-testid="username"]')
        // Assert
        .should("be.visible")
        // Act
        .type(USERNAME);
      cy.get('input[data-testid="password"]')
        // Assert
        .should("be.visible")
        // Act
        .type(PASSWORD, {
          log: false,
        });
      cy.contains("button", "Login")
        // Assert
        .should("be.visible")
        // Act
        .click();
    });

    // Assert
    cy.url().should("be.equal", "https://example.com/dashboard");
    cy.contains("h1", "Welcome to the Dashboard").should("be.visible");
  });
});
```

## See Also

- [Authentication](./03-authentication.md) - Session management and login patterns
- [Selectors](./04-selectors.md) - Best practices for element selection
- [Assertions](./06-assertions.md) - Assertion strategies

# Cypress Selectors and Element Selection

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for selecting elements in Cypress tests, including selector strategies and alias usage.

## Selector Principles

First of all:

- Selectors should be resilient to UI changes
- Selectors should reveal intent, not implementation details
- Selectors should be consistent across the entire project
- Selectors should be as simple as possible

## Recommended Selectors Strategy

The recommended selectors approach is as follows.

```js
// If data-testid or similar exist, use them.
cy.get('[data-testid="shopping-cart"]');
// If data-testid is not available, use accessibility (A11y) properties such as aria-label for element selection.
cy.get('[aria-label="Next Page"]');
// If none of the above are present, try descriptive selectors.
cy.get('input[placeholder="Search emojis..."]');
// Otherwise, use id.
cy.get("#avatar");
```

**Priority:** `[data-testid]` > `[aria-label]` > descriptive attributes > `#id`

## What to Avoid

**Avoid** 👎

- Generic classes (e.g., `.btn`)
- Dynamic classes (e.g., `cy.get('.Messenger_openButton_OgKIA')`)
- Generic selectors with indexes, first, or last (e.g., `cy.get('a').first()` or `cy.get('button').eq(3)`)
- Long and hard-to-read selectors (e.g., `cy.get('div > p > span')`)
- **XPATH - NEVER USE XPATH!**

## Using `cy.contains`

Below are examples of how to use and how not to use the `contains` command.

**Good example** 👍

```js
cy.contains("button", "Send"); // Generic selector + element's content that makes it specific.
```

**Bad examples** 👎

```js
cy.contains("Send"); // Too generic

cy.get("button").contains("Send"); // Too many chainings

cy.get("button:contains(Send)"); // Too complex as it depends on JQuery's :contains
```

## Aliases: `cy.get('selector').as('alias')` and `cy.get('@alias')`

To avoid repeating the same selector over and over, give alias to elements, and then, get them by their aliases.

**Good examples** 👍

```js
describe("Sample Test Suite", () => {
  beforeEach(() => {
    cy.visit("https://example.com/login");
    cy.get('input[name="username"]').as("username");
    cy.get('input[name="password"]').as("password");
    cy.get('input[type="submit"]').as("loginButton");
  });

  it("successful login", () => {
    cy.env(["USERNAME", "PASSWORD"]).then(({ USERNAME, PASSWORD }) => {
      cy.get("@username").type(USERNAME);
      cy.get("@password").type(PASSWORD, { log: false });
      cy.get("@loginButton").click();
    });

    cy.url().should("contain", "/dashboard");
    cy.contains("h1", "Welcome to the Dashboard").should("be.visible");
  });

  it("errors on invalid email", () => {
    cy.env(["PASSWORD"]).then(({ PASSWORD }) => {
      cy.get("@username").type("invalid");
      cy.get("@password").type(PASSWORD, { log: false });
      cy.get("@loginButton").click();
    });

    cy.contains(".error", "Invalid email or password.");
    cy.url().should("contain", "/login");
    cy.get("@username").should("be.visible");
  });

  it("errors on invalid password", () => {
    cy.env(["USERNAME"]).then(({ USERNAME }) => {
      cy.get("@username").type(USERNAME);
      cy.get("@password").type("invalid-password", { log: false });
      cy.get("@loginButton").click();
    });

    cy.contains(".error", "Invalid email or password.");
    cy.url().should("contain", "/login");
    cy.get("@username").should("be.visible");
  });

  it("does not enable the login button while username and password are not filled", () => {
    cy.get("@loginButton").should("be.disabled");
  });
});
```

**Bad examples** 👎

```js
describe("Sample Test Suite", () => {
  beforeEach(() => {
    cy.visit("https://example.com/login");
  });

  it("successful login", () => {
    cy.env(["USERNAME", "PASSWORD"]).then(({ USERNAME, PASSWORD }) => {
      cy.get('input[name="username"]').type(USERNAME);
      cy.get('input[name="password"]').type(PASSWORD, { log: false });
      cy.get('input[type="submit"]').click();
    });

    cy.url().should("contain", "/dashboard");
    cy.contains("h1", "Welcome to the Dashboard").should("be.visible");
  });

  it("errors on invalid email", () => {
    cy.env(["PASSWORD"]).then(({ PASSWORD }) => {
      cy.get('input[name="username"]').type("invalid");
      cy.get('input[name="password"]').type(PASSWORD, { log: false });
      cy.get('input[type="submit"]').click();
    });

    cy.contains(".error", "Invalid email or password.");
    cy.url().should("contain", "/login");
    cy.get('input[name="username"]').should("be.visible");
  });

  it("errors on invalid password", () => {
    cy.env(["USERNAME"]).then(({ USERNAME }) => {
      cy.get('input[name="username"]').type(USERNAME);
      cy.get('input[name="password"]').type("invalid-password", { log: false });
      cy.get('input[type="submit"]').click();
    });

    cy.contains(".error", "Invalid email or password.");
    cy.url().should("contain", "/login");
    cy.get('input[name="username"]').should("be.visible");
  });

  it("does not enable the login button while username and password are not filled", () => {
    cy.get('input[type="submit"]').should("be.disabled");
  });
});
```

## See Also

- [Commands](./05-commands.md) - Interacting with selected elements
- [Assertions](./06-assertions.md) - Asserting on element state
- [Test Organization](./02-test-organization.md) - Using aliases in beforeEach

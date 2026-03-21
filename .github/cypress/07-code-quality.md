# Cypress Code Quality and Standards

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers code quality standards, security practices, and formatting conventions for Cypress test code.

## Sensitive Data

No sensitive data should be EVER versioned, and so, they should be set in environment variables prefixed by `CYPRESS_`, (e.g., `CYPRESS_USERNAME`), or defined inside the not-versioned `cypress.env.json` file.

> It's a good practice to have a `cypress.env.example.json` file as an example of how the `cypress.env.json` file should look like.

After that, such data can be retrieved using `cy.env(["ENV_HERE"]).then(({ ENV_HERE }) => { ... })`.

Finally, do not leak sensitive data in the Cypress command logs. To protect data from leaking, use the `{ log: false }` option both in the `cy.env()` command and when typing such data (e.g., in `.type()`).

**Good example** 👍

```js
cy.env(["PASSWORD"], { log: false }).then(({ PASSWORD }) => {
  cy.get('input[data-testid="password"]').type(PASSWORD, { log: false });
});
```

**Bad examples** 👎

```js
cy.get('input[data-testid="password"]').type("hardcoded-sensitive-data"); // Sensitive data should never be hardcoded.

cy.env(["PASSWORD"]).then(({ PASSWORD }) => {
  cy.get('input[data-testid="password"]').type(PASSWORD); // Although the data come from a protected env, it leaks in the Cypress command log.
});
```

## Conditionals Testing

It's discouraged to use conditions in testing code, except in a few exceptions.

Below is an exception example, where we want to validate an API response, and a few fields are optional.

```js
it("returns the correct status and body structure on a simple GET request (with default query params.)", () => {
  cy.request("GET", CUSTOMERS_API_URL).as("getCustomers");

  cy.get("@getCustomers").its("status").should("eq", 200);

  cy.get("@getCustomers")
    .its("body")
    .should("have.all.keys", "customers", "pageInfo");
  cy.get("@getCustomers")
    .its("body.customers")
    .each((customer) => {
      expect(customer.id).to.exist.and.be.a("number");
      expect(customer.name).to.exist.and.be.a("string");
      expect(customer.employees).to.exist.and.be.a("number");
      expect(customer.industry).to.exist.and.be.a("string");

      // Since customer.contactInfo can be null, this condition is accepted. 👍
      if (customer.contactInfo) {
        expect(customer.contactInfo).to.have.all.keys("name", "email");
        expect(customer.contactInfo.name).to.be.a("string");
        expect(customer.contactInfo.email).to.be.a("string");
      }

      // Since customer.address can be null, this condition is accepted. 👍
      if (customer.address) {
        expect(customer.address).to.have.all.keys(
          "street",
          "city",
          "state",
          "zipCode",
          "country",
        );
        expect(customer.address.street).to.be.a("string");
        expect(customer.address.city).to.be.a("string");
        expect(customer.address.state).to.be.a("string");
        expect(customer.address.zipCode).to.be.a("string");
        expect(customer.address.country).to.be.a("string");
      }
    });

  cy.get("@getCustomers")
    .its("body.pageInfo")
    .should("have.all.keys", "currentPage", "totalPages", "totalCustomers");
  cy.get("@getCustomers")
    .its("body.pageInfo")
    .then(({ currentPage, totalPages, totalCustomers }) => {
      expect(currentPage).to.be.a("number");
      expect(totalPages).to.be.a("number");
      expect(totalCustomers).to.be.a("number");
    });
});
```

And below is another exception, where we can control in which viewport tests will run against.

```js
it("logs out", { tags: "@desktop-and-tablet" }, () => {
  cy.visit("/");

  const viewportWidthBreakpoint = Cypress.expose("viewportWidthBreakpoint");

  if (Cypress.config("viewportWidth") < viewportWidthBreakpoint) {
    // 👍
    cy.get(".navbar-toggle.collapsed").should("be.visible").click(); // On smaller viewports, the user must open the menu before clicking the Logout link
  }

  cy.contains(".nav a", "Logout").click();

  cy.get("#email").should("be.visible");
});
```

But this isn't allowed: 👎

```js
// This only works if there's 100% guarantee
// body has fully rendered without any pending changes
// to its state
cy.get('body').then(($body) => {
  // synchronously ask for the body's text
  // and do something based on whether it includes
  // another string
  if ($body.text().includes('some string')) {
    // yup found it
    cy.get(...).should(...)
  } else {
    // nope not here
    cy.get(...).should(...)
  }
})
```

> **Tests must be deterministic.
> Each run should produce the same behavior and results.
> If multiple paths exist, write a separate test for each.**

## Imports of Internal vs. External Packages

To differentiate between internal and external packages, the rule is:

- Import external packages first
- Leave an empty line between the last import of an external package and the beginning of imports of internal ones
- Following the above rules, import internal and external packages in alphabetical order

**Good example** 👍

```js
// External packages
import { expect } from "chai";
import supertest from "supertest";

// Internal modules
import { apiClient } from "../support/apiClient";
import { testData } from "../fixtures/testData";
```

## Indentation

Use two spaces of indentation.

This helps with breaking lines when chaining Cypress commands.

For example:

```js
cy.contains("a", "Privacy Policy")
  .should("be.visible")
  .and("have.attr", "target", "_blank");
```

> If four spaces were used, the chained commands would not align with the `cy` object.

## npm Scripts

There's no need to add `npx` inside the npm scripts.

npm already knows where to find the binaries when calling scripts defined inside the `package.json` file, so, `npx` is not needed.

**Good example** 👍

```json
"scripts": {
  "cy:open": "cypress open",
  "test": "cypress run"
},
```

**Bad example** 👎

```json
"scripts": {
  "cy:open": "npx cypress open",
  "test": "npx cypress run"
},
```

## See Also

- [Project Structure](./01-project-structure.md) - Environment variable configuration
- [Authentication](./03-authentication.md) - Using sensitive credentials
- [Commands](./05-commands.md) - Writing deterministic tests

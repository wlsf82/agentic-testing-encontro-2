# Cypress Commands and Best Practices

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for using Cypress commands, including proper usage patterns and common pitfalls to avoid.

## `cy.request` and `cy.wait('@alias')` with `.then()`

Below are examples of how to use and how not to use the `cy.request` and `cy.wait('@alias')` commands when chaining them to the `.then` command.

### `cy.request().then()`

**Good example** 👍

> Always destructure what's needed from a request's response to avoid duplications like `response.status`, or `response.body`.

```js
cy.request("GET", "https://api.example.com").then(({ body, status }) => {
  expect(status).to.equal(200);
  expect(body.someProperty).should.exist;
});
```

**Bad example** 👎

```js
cy.request("GET", "https://api.example.com").then((response) => {
  expect(response.status).to.equal(200);
  expect(response.body.someProperty).should.exist;
});
```

### `cy.wait('@alias').then()`

**Good example** 👍

> Always destructure what's needed from an intercepted response to avoid duplications like `response.status`, or `response.body`.

```js
cy.intercept("GET", "https://api.example.com").as("alias");

cy.login();

cy.wait("@alias").then(({ status }) => {
  expect(status).to.equal(200);
});

// Continue here.
```

**Bad example** 👎

```js
cy.intercept("GET", "https://api.example.com").as("alias");

cy.login();

cy.wait("@alias").then((response) => {
  expect(response.status).to.equal(200);
});

// Continue here.
```

## Working with the `.last()` Element

When working with the `.last` element, make sure the correct number of elements are visible before getting the last.

This ensures you are selecting the correct element, especially in scenarios where multiple elements with the same selector may render at different times, such as in a dynamic list.

**Good example** 👍

```js
cy.get("ul li")
  // Assert the expected number of elements.
  .should("have.length", 10)
  // All items rendered, now get the last one and make an assertion.
  .last()
  .should("have.text", "Buy Milk");
```

**Bad example** 👎

```js
cy.get("ul li")
  .last() // This may select the wrong element if the list is still rendering.
  .should("have.text", "Buy Milk");
```

## `cy.wait(Number)` is Strictly Forbidden

**NO EXCEPTION** - Using `cy.wait()` with a hardcoded number is strictly forbidden.

Instead of doing something like this: 👎

```js
cy.get(...).type(...)
cy.get(...).type(...)
cy.get(...).click()

cy.wait(3000)

cy.get(...).should('be.visible')
```

Do something like this: 👍

```js
cy.intercept().as('requestThatWillHappenAfterFormSubmit')

cy.get(...).type(...)
cy.get(...).type(...)
cy.get(...).click()

cy.wait('@requestThatWillHappenAfterFormSubmit')

cy.get(...).should('be.visible')
```

### Why This Matters

- Arbitrary waits make tests slower and non-deterministic
- Tests may pass on a fast machine but fail on a slow one
- Using `cy.intercept()` + `cy.wait('@alias')` ensures the test waits for the actual condition to be met
- This approach is faster when the request completes quickly and more reliable when it takes longer

## See Also

- [Selectors](./04-selectors.md) - Selecting elements to interact with
- [Assertions](./06-assertions.md) - Proper assertion patterns
- [Code Quality](./07-code-quality.md) - Keeping tests deterministic

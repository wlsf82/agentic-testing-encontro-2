# Cypress Assertions and Expectations

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for writing assertions in Cypress tests, including choosing the right assertion type and avoiding common mistakes.

## The `.should('be.visible')` vs. `.should('exist')` Assertions

If an element should be visible in the page, always assert that using the `.should('be.visible')` assertion.

Only asserting that an element exists in the DOM is not enough since the element might exist in the DOM but could be hidden by a CSS rule, for example.

### When to Use Each

- **`.should('be.visible')`** - Use when the element should be visible to users
- **`.should('exist')`** - Use only when you need to verify an element is in the DOM but don't care about visibility (rare cases)

**Good example** 👍

```js
cy.get(".avatar").should("be.visible");
```

**Bad examples** 👎

```js
cy.get(".avatar").should("exist"); // Not enough - element might be hidden
```

## Unnecessary Chain of Commands

It's not necessary to ensure the element exists in the DOM if you will assert that it's visible.

> An element cannot be visible without existing in the DOM.

**Good example** 👍

```js
cy.get(".avatar").should("be.visible");
```

**Bad examples** 👎

```js
cy.get(".avatar").should("exist").and("be.visible");

cy.get(".avatar").should("be.visible").and("exist");
```

## Negative Assertions

Always run a positive assertion before a negative one to avoid tests passing prematurely.

**Good example** 👍

```js
it("deletes a note", () => {
  cy.get(".list-group").contains("My note updated").click();
  cy.contains("Delete").click();

  cy.get(".list-group-item").its("length").should("be.at.least", 1); // Ensure you're in the right place before the negative assertion.
  cy.contains(".list-group-item", "My note").should("not.exist");
});
```

**Bad example** 👎

```js
it("deletes a note", () => {
  cy.get(".list-group").contains("My note updated").click();
  cy.contains("Delete").click();

  cy.get(".list-group:contains(My note updated)").should("not.exist"); // This assertion will happen right after the click, when the app might not have redirected to the correct place where the assertion should happen
});
```

### Why Positive Assertions First?

- A negative assertion might pass immediately if you're not in the right state yet
- The positive assertion ensures you've navigated to the expected page/state
- This prevents false positives where tests pass for the wrong reasons

## Using `.its()` Effectively

When accessing properties, use `.its()` followed by assertions rather than `.should()` with callback functions when possible.

**Good example** 👍

```js
cy.get(".list-group-item").its("length").should("be.at.least", 1);
```

## See Also

- [Selectors](./04-selectors.md) - Selecting elements to assert on
- [Commands](./05-commands.md) - Commands that lead to assertions
- [Test Organization](./02-test-organization.md) - AAA pattern with assertions

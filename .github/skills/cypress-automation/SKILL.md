# Skill: Cypress Automation Expert

You are an expert in web test automation using Cypress + TypeScript/JavaScript. Your goal is to write high-quality, deterministic, and maintainable end-to-end tests.

> **Note:** For detailed implementation guidance, examples, and code snippets, refer to the [Cypress Instructions](../../copilot-instructions.md) - a comprehensive guide organized into focused topics.

## Core Principles

- **Test Independence:** Every test must be independent. Never set `testIsolation: false`
- **Deterministic Tests:** Tests must produce the same result every time. No conditional logic based on non-deterministic UI states
- **AAA Pattern:** Follow Arrange-Act-Assert structure with blank lines separating each phase

## Critical Rules

- **No Arbitrary Waits:** `cy.wait(Number)` is strictly forbidden. Use `cy.intercept()` + `cy.wait('@alias')`
- **No XPath:** Never use XPath selectors
- **Selector Priority:** `[data-testid]` > `HTML tag + Tag's content` > `[aria-label]` > `[placeholder]` > `#id` > descriptive class names (e.g., `.submit-button`) > class with static + dynamic parts (e.g., `[class^="foo-"]` || `[class*=" -ooba-"]`) || `class$="-bar"]` > `:nth-child()` || `:nth-of-type()`
- **Visibility over Existence:** Use `.should('be.visible')` not `.should('exist')`
- **Session Caching:** Use `cy.sessionLogin()` for authenticated tests (except login specs)

## Essential Patterns

- Use **`beforeEach`** for setup. Avoid `before`, `after`, `afterEach`
- Use **`context()`** to organize sub-features within `describe()` blocks
- Use **`.as('alias')`** to avoid selector repetition
- Always **destructure** in `.then()` callbacks: `{ body, status }` not `response.body`
- For **`.last()`** elements, verify list length first
- For **negative assertions**, run a positive assertion first
- Use **`{ log: false }`** with sensitive data in `cy.env()` and `.type()`

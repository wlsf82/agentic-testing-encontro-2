# Cypress Testing Instructions

This documentation provides comprehensive guidance for writing Cypress tests in this project. The instructions are organized into focused topic areas for easy navigation and reference.

> **Quick Reference:** For a concise summary of core principles and rules, see the [cypress-automation skill](./skills/cypress-automation/SKILL.md).

## Documentation Structure

The Cypress testing guidelines are organized into the following topic areas:

### 📁 [01. Project Structure](./cypress/01-project-structure.md)

How to organize your Cypress project, including folder structure, configuration files, and environment setup. Covers `baseUrl`, `apiUrl`, fixtures, and support files configuration.

### 🧪 [02. Test Organization](./cypress/02-test-organization.md)

Best practices for organizing test files and test cases. Includes guidance on hooks (`beforeEach`, `before`, `after`, `afterEach`), `testIsolation`, using `context` for sub-features, and the AAA (Arrange-Act-Assert) pattern.

### 🔐 [03. Authentication](./cypress/03-authentication.md)

Session management and authentication patterns using `cy.session` and `cy.sessionLogin` custom commands. Learn how to efficiently cache and restore user sessions across tests.

### 🎯 [04. Selectors](./cypress/04-selectors.md)

Comprehensive selector strategy guidance, including priority order (`data-testid` > `aria-label` > descriptive attributes > `id`), using `cy.contains` effectively, and alias patterns with `.as()` to avoid selector repetition.

### ⚡ [05. Commands](./cypress/05-commands.md)

Best practices for using Cypress commands, including proper destructuring with `cy.request()` and `cy.wait('@alias')`, working with `.last()` elements safely, and the strict prohibition of `cy.wait(Number)`.

### ✅ [06. Assertions](./cypress/06-assertions.md)

Assertion strategies and patterns, including when to use `.should('be.visible')` vs `.should('exist')`, avoiding redundant assertion chains, and writing effective negative assertions.

### 🎨 [07. Code Quality](./cypress/07-code-quality.md)

Code quality standards covering sensitive data handling, conditional testing rules, import organization, indentation standards, and npm script conventions.

## Navigation Tips

- **For quick rules:** Start with the [SKILL.md](./skills/cypress-automation/SKILL.md) for core principles
- **For specific topics:** Jump directly to the relevant topic file above
- **For comprehensive learning:** Read through topics 01-07 in order
- **Each topic file** includes "See Also" sections to related topics

## Contributing

When updating these instructions:

- Keep the `SKILL.md` concise with core rules only
- Place detailed examples and explanations in the appropriate topic file
- Maintain cross-references between related topics
- Follow the established formatting and example patterns

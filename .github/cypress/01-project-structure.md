# Cypress Project Structure

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers the recommended project structure, configuration, and file organization for Cypress projects.

## Files and Folders Structure

It's suggested using the default Cypress files and folders structure, with small modifications, such as specs divided per feature, and tasks inside the support directory, as demonstrated below.

```bash
cypress/
  ├── fixtures/                    # Test data files (JSON, txt, etc.)
  │   └── example.json             # Example fixture file
  ├── e2e/                         # End-to-end test specs, organized by feature
  │   ├── auth/                    # Login feature specs
  │   │   └── login.cy.{js,ts}     # Login test file
  │   ├── dashboard/               # Dashboard feature specs
  │   │   └── dashboard.cy.{js,ts} # Dashboard test file
  │   └── settings/                # Settings feature specs
  │       └── settings.cy.{js,ts}  # Settings test file
  └── support/                     # Support utilities and custom commands
      ├── tasks/                   # Custom tasks for plugins and custom node.js code
      │   └── index.{js,ts}        # Task definitions
      ├── commands.{js,ts}         # Custom Cypress commands
      └── e2e.{js,ts}              # Global setup for e2e tests
cypress.config.{js,ts}             # Cypress configuration file
cypress.env.example.json           # Example environment variables file
cypress.env.json                   # Project-specific environment variables (not versioned)
```

## Configuration Settings

### `baseUrl`

Always define the `baseUrl` in the `cypress.config.{js,ts}` file so tests can run against different environments by simply overwriting it via a command line argument.

For example:

```bash
cypress run --config baseUrl=https://staging.example.com
```

### `apiUrl`

Define the `apiUrl` as an `expose` inside in the `cypress.config.{js,ts}` file so tests can run against different environments by simply overwriting it via a command line argument.

For example:

```bash
cypress run --expose apiUrl=https://api.staging.example.com
```

### Disabling Unused Folders

When not using the `cypress/fixtures/` or `cypress/support/` files and directories, update the `cypress.config.{js,ts}` file as below.

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    fixturesFolder: false, // Do not use fixtures
    supportFile: false, // Do not use support files
  },
});
```

## Environment Variables

No sensitive data should be EVER versioned, and so, they should be set in environment variables prefixed by `CYPRESS_`, (e.g., `CYPRESS_USERNAME`), or defined inside the not-versioned `cypress.env.json` file.

> It's a good practice to have a `cypress.env.example.json` file as an example of how the `cypress.env.json` file should look like.

## See Also

- [Test Organization](./02-test-organization.md) - How to structure test files
- [Authentication](./03-authentication.md) - Session management patterns
- [Code Quality](./07-code-quality.md) - Handling sensitive data

# Cypress Authentication and Session Management

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for handling authentication in Cypress tests using session caching.

## Usage of `cy.session`

For every test case that requires log in as a pre-condition, use a `cy.sessionLogin()` custom command.

> **Important:** The exception for the above rule are for tests inside a `cypress/e2e/auth/login.cy.{js,ts}` file, where the session should not be cached.

The `cy.sessionLogin` custom command uses Cypress's native `cy.session` command, which caches and restores `cookies`, `localStorage`, and `sessionStorage` (i.e. session data) in order to recreate a consistent browser context between tests.

## Example Implementation

Below is an example of how a `cy.sessionLogin` command looks like.

```js
Cypress.Commands.add("sessionLogin", (username, password) => {
  cy.env(["USERNAME", "PASSWORD"]).then(({ USERNAME, PASSWORD }) => {
    const loginUser = username || USERNAME;
    const loginPassword = password || PASSWORD;

    const sessionId = loginUser;

    const setup = () => {
      cy.visit("users/sign_in");

      cy.get('[data-qa-selector="login_field"]').type(loginUser);
      cy.get('[data-qa-selector="password_field"]').type(loginPassword, {
        log: false,
      });
      cy.get('[data-qa-selector="sign_in_button"]').click();

      cy.get(".qa-user-avatar").should("exist");
    };

    const validate = () => {
      cy.visit("");
      cy.location("pathname", { timeout: 1000 }).should(
        "not.eq",
        "/users/sign_in",
      );
    };

    const options = {
      cacheAcrossSpecs: true,
      validate,
    };

    /**
     * @param sessionId string - the id of the session. If the id changes, a new
     * session is created.
     * @param setup function - the function that creates the session.
     * @param options object - an object to add certain characteristics to the
     * session, such as sharing the cached session across specs (test files),
     * and a way to validate if the session is still valid (validate function).
     * If the session gets invalidated, the setup function runs again to recreate it.
     *
     * @example cy.session() // Logs in with the default credentials, or restores an existing session for the default user
     * @example cy.session('user-sample@example.com', '53cr37P@55w0Rd') // Logs in (or restores the session) passing the credentials (username and password)
     *
     * For more details, visit https://docs.cypress.io/api/commands/session
     */
    cy.session(sessionId, setup, options);
  });
});
```

## Key Components

### Session ID

The session ID is used to uniquely identify a session. If the ID changes, a new session is created. Typically use the username as the session ID.

### Setup Function

The function that performs the actual login. This is only executed when a session needs to be created or recreated.

### Validate Function

Optional function to check if the session is still valid. If validation fails, the setup function runs again to recreate the session.

### Options

- `cacheAcrossSpecs: true` - Shares the cached session across different spec files
- `validate` - Function to validate the session is still active

## See Also

- [Test Organization](./02-test-organization.md) - Using beforeEach with session login
- [Code Quality](./07-code-quality.md) - Handling sensitive credentials
- [Selectors](./04-selectors.md) - Selecting login form elements

describe('EngageSphere', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'declined')
    cy.visit('/')
  })

  context('Core Application Features', () => {
    it('successfully toggles between light and dark themes', () => {
      // Arrange
      cy.get('button[aria-label^="theme "]').as('themeToggle')

      // Assert - Initial state
      cy.get('body').should('have.attr', 'data-theme', 'light')

      // Act - Toggle to dark
      cy.get('@themeToggle').click()

      // Assert
      cy.get('body').should('have.attr', 'data-theme', 'dark')

      // Act - Toggle back to light
      cy.get('@themeToggle').click()

      // Assert
      cy.get('body').should('have.attr', 'data-theme', 'light')
    })

    it('displays a generic greeting when no name is entered', () => {
      // Arrange
     const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

      // Assert
      cy.contains('h2', 'Hi there!')
        .should('be.visible')
        .and('contain', currentDate)
    })

    it('displays a personalized greeting when a name is entered', () => {
      // Arrange
      const testName = 'John Doe'
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

      // Act
      cy.get('input[placeholder="E.g., John Doe"]').type(testName)

      // Assert
      cy.contains('h2', `Hi ${testName}!`)
        .should('be.visible')
        .and('contain', currentDate)
    })
  })

  context('Customer List and Data Filtering', () => {
    let apiUrl

    beforeEach(() => {
      apiUrl = Cypress.expose('apiUrl')
    })

    context('Data Loading and Filtering', () => {
      it('successfully loads the first page of customers on start', () => {
        // Arrange
        cy.intercept('GET', `${apiUrl}/customers?page=1&limit=10&size=All&industry=All`, {
          statusCode: 200,
          body: {
            customers: [
              {
                id: 1,
                name: 'Jacobs Co',
                employees: 99,
                industry: 'Logistics',
                size: 'Small'
              }
            ],
            pageInfo: {
              currentPage: 1,
              totalPages: 1,
              totalCustomers: 1
            }
          }
        }).as('initialLoad')

        // Act
        cy.visit('/')

        cy.wait('@initialLoad')

        // Assert
        cy.contains('table', 'Jacobs Co').should('be.visible')
      })

      it('updates the customer list when a size filter is selected', () => {
        // Arrange
        cy.intercept('GET', `${apiUrl}/customers?page=1&limit=10&size=Small&industry=All`, {
          statusCode: 200,
          body: {
            customers: [
              {
                id: 2,
                name: 'Small Corp',
                employees: 50,
                industry: 'Technology',
                size: 'Small'
              }
            ],
            pageInfo: {
              currentPage: 1,
              totalPages: 1,
              totalCustomers: 1
            }
          }
        }).as('filterBySize')

        // Act
        cy.get('select#sizeFilter').select('Small')

        cy.wait('@filterBySize')

        // Assert
        cy.contains('table', 'Small Corp').should('be.visible')
      })

      it('updates the customer list when an industry filter is selected', () => {
        cy.intercept('GET', `${apiUrl}/customers?page=1&limit=10&size=All&industry=Technology`, {
          statusCode: 200,
          body: {
            customers: [
              {
                id: 3,
                name: 'Tech Innovations',
                employees: 200,
                industry: 'Technology',
                size: 'Medium'
              }
            ],
            pageInfo: {
              currentPage: 1,
              totalPages: 1,
              totalCustomers: 1
            }
          }
        }).as('filterByIndustry')

        // Act
        cy.get('select#industryFilter').select('Technology')

        cy.wait('@filterByIndustry')

        // Assert
        cy.contains('table', 'Tech Innovations').should('be.visible')
      })
    })

    context('Pagination and Display Limits', () => {
      it('loads the next set of customers when the "Next" button is clicked', () => {
        // Arrange
        cy.intercept('GET', `${apiUrl}/customers?page=2&limit=10&size=All&industry=All`, {
          statusCode: 200,
          body: {
            customers: [
              {
                id: 11,
                name: 'Page Two Company',
                employees: 150,
                industry: 'Finance',
                size: 'Medium'
              }
            ],
            pageInfo: {
              currentPage: 2,
              totalPages: 2,
              totalCustomers: 20
            }
          }
        }).as('nextPage')

        // Act
        cy.contains('button', 'Next').click()

        cy.wait('@nextPage')

        // Assert
        cy.contains('table', 'Page Two Company').should('be.visible')
      })

      it.skip('loads the previous set of customers when the "Prev" button is clicked', () => {
        // TODO: Implemement this scenario later.
      })

      it('updates the number of customers displayed per page', () => {
        // Arrange
        cy.intercept('GET', `${apiUrl}/customers?page=1&limit=20&size=All&industry=All`, {
          statusCode: 200,
          body: {
            customers: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              name: `Company ${i + 1}`,
              employees: 100 + i,

              industry: 'HR',
              size: 'Medium'
            })),
            pageInfo: {
              currentPage: 1,
              totalPages: 3,
              totalCustomers: 50
            }
          }
        }).as('paginationLimit')

        // Act
        cy.get('select[aria-label="Pagination limit"]').select('20')

        cy.wait('@paginationLimit')

        // Assert
        cy.get('table tbody tr').should('have.length', 20)
      })
    })
  })

  context('Customer Details Management', () => {
    beforeEach(() => {
      cy.get('table').as('customerTable')
    })

    it('navigates to the customer details view', () => {
      // Arrange
      cy.get('@customerTable').should('be.visible')
      cy.get('button[aria-label^="View company:"]').should('have.length.at.least', 1)

      // Act
      cy.get('button[aria-label^="View company:"]').first().click()

      // Assert
      cy.contains('Customer Details').should('be.visible')
      cy.contains('p', 'Company ID:').should('be.visible')
      cy.contains('p', 'Company name:').should('be.visible')
    })

    it('toggles the visibility of the customer\'s address', () => {
      // Arrange
      cy.get('button[aria-label^="View company:"]').should('have.length.at.least', 1)
      cy.get('button[aria-label^="View company:"]').first().click()

      // Act - Show address
      cy.contains('button', 'Show address').click()

      // Assert
      cy.contains('button', 'Hide address').should('be.visible')
      cy.contains('Address').should('be.visible')

      // Act - Hide address
      cy.contains('button', 'Hide address').click()

      // Assert
      cy.contains('button', 'Show address').should('be.visible')
    })

    it('returns to the customer list view from the details view', () => {
      // Arrange
      cy.get('button[aria-label^="View company:"]').should('have.length.at.least', 1)
      cy.get('button[aria-label^="View company:"]').first().click()

      cy.contains('Customer Details').should('be.visible')

      // Act
      cy.contains('button', 'Back').click()

      // Assert
      cy.get('@customerTable').should('be.visible')
      cy.contains('Customer Details').should('not.exist')
    })
  })

  context('External Integrations and Data Export', () => {
    it('contains valid links to external resources in the footer', () => {
      // Arrange
      const expectedLinks = {
        'Podcast': 'https://open.spotify.com/show/5HFlqWkk6qtgJquUixyuKo',
        'Courses': 'https://talking-about-testing.vercel.app/',
        'Blog': 'https://talkingabouttesting.com',
        'YouTube': 'https://youtube.com/@talkingabouttesting'
      }

      // Act & Assert
      Object.entries(expectedLinks).forEach(([text, href]) => {
        cy.contains('a', text)
          .should('be.visible')
          .and('have.attr', 'href', href)
          .and('have.attr', 'target', '_blank')
      })
    })

    it('initiates a CSV download when the button is clicked', () => {
      // Arrange
      const downloadsFolder = Cypress.config('downloadsFolder')

      // Act
      cy.contains('button', 'Download CSV').click()

      // Assert
      cy.readFile(`${downloadsFolder}/customers.csv`, { timeout: 10000 })
        .should('exist')
        .and('contain', 'Company_Name')
    })
  })

  context('Combined Scenarios', () => {
    beforeEach(() => {
      cy.get('select#sizeFilter').as('sizeFilter')
      cy.get('select#industryFilter').as('industryFilter')
      cy.get('table').as('customerTable')
    })

    it('filters data by both size and industry', () => {
      // Arrange
      const apiUrl = Cypress.expose('apiUrl')

      cy.intercept('GET', `${apiUrl}/customers?page=1&limit=10&size=Large%20Enterprise&industry=Technology`, {
        statusCode: 200,
        body: {
          customers: [
            {
              id: 100,
              name: 'Large Tech Corp',
              employees: 5000,
              industry: 'Technology',
              size: 'LargeEnterprise'
            }
          ],
          pageInfo: {
            currentPage: 1,
            totalPages: 1,
            totalCustomers: 1
          }
        }
      }).as('combinedFilter')

      // Act
      cy.get('@sizeFilter').select('Large Enterprise')
      cy.get('@industryFilter').select('Technology')

      cy.wait('@combinedFilter')

      // Assert
      cy.get('@customerTable').contains('Large Tech Corp').should('be.visible')
    })

    it('maintains filter state after viewing customer details and returning', () => {
      // Act - Apply a filter
      cy.get('@industryFilter').select('Technology')

      // Assert
      cy.get('@industryFilter').should('have.value', 'Technology')

      // Act - View details
      cy.get('button[aria-label^="View company:"]').should('have.length.at.least', 1)
      cy.get('button[aria-label^="View company:"]').first().click()

      // Act - Go back
      cy.contains('button', 'Back').click()

      // Assert - Verify filter is still applied
      cy.get('@industryFilter').should('have.value', 'Technology')
    })

    it('handles pagination with active filters', () => {
      // Arrange
      const apiUrl = Cypress.expose('apiUrl')

      cy.intercept('GET', `${apiUrl}/customers?page=2&limit=10&size=Small&industry=All`, {
        statusCode: 200,
        body: {
          customers: [
            {
              id: 50,
              name: 'Small Business Page 2',
              employees: 45,
              industry: 'Retail',
              size: 'Small'
            }
          ],
          pageInfo: {
            currentPage: 2,
            totalPages: 3,
            totalCustomers: 25
          }
        }
      }).as('paginationWithFilter')

      // Act
      cy.get('@sizeFilter').select('Small')
      cy.contains('button', 'Next').click()

      cy.wait('@paginationWithFilter')

      // Assert
      cy.get('@customerTable').contains('Small Business Page 2').should('be.visible')
      cy.get('@sizeFilter').should('have.value', 'Small')
    })
  })
})


describe('Cookie Consent Management', () => {
  beforeEach(() => {
    cy.clearCookie('cookieConsent')
    cy.visit('/')
    cy.contains('button', 'Accept').as('acceptButton')
    cy.contains('button', 'Decline').as('declineButton')
  })

  it('hides the cookie banner when the "Accept" button is clicked', () => {
    // Act
    cy.get('@acceptButton').should('be.visible').click()

    // Assert
    cy.get('body').should('be.visible')
    cy.get('@acceptButton').should('not.exist')
  })

  it('hides the cookie banner when the "Decline" button is clicked', () => {
    // Act
    cy.get('@declineButton').should('be.visible').click()

    // Assert
    cy.get('body').should('be.visible')
    cy.get('@declineButton').should('not.exist')
  })
})
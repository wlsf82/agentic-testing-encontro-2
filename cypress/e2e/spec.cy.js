describe('EngageSphere Test Suite', () => {
  const API_BASE_URL = 'https://whispering-meadow-44853-562f20cee791.herokuapp.com'

  context('Core Application Features', () => {
    beforeEach(() => {
      cy.setCookie('cookieConsent', 'declined')
      cy.visit('/')
    })

    it('successfully toggles between light and dark themes', () => {
      cy.get('body').should('have.attr', 'data-theme', 'light')

      cy.get('button[aria-label^="theme "]').click()

      cy.get('body').should('have.attr', 'data-theme', 'dark')

      cy.get('button[aria-label^="theme "]').click()

      cy.get('body').should('have.attr', 'data-theme', 'light')
    })

    it('displays a personalized greeting when a name is entered', () => {
      const testName = 'John Doe'
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

      cy.get('input[placeholder="E.g., John Doe"]')
        .type(testName)

      cy.get('h2')
        .contains('Hi')
        .should('contain', `Hi ${testName}!`)
        .and('contain', currentDate)
    })
  })

  context('Cookie Consent Management', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('hides the cookie banner when the "Accept" button is clicked', () => {
      cy.get('button').contains('Accept').should('be.visible').click()
      cy.get('button').contains('Accept').should('not.exist')
    })

    it('hides the cookie banner when the "Decline" button is clicked', () => {
      cy.visit('/') // Refresh to show cookie banner again
      cy.get('button').contains('Decline').should('be.visible').click()
      cy.get('button').contains('Decline').should('not.exist')
    })
  })

  context('Customer List and Data Filtering', () => {
    beforeEach(() => {
      cy.setCookie('cookieConsent', 'declined')
      cy.visit('/')
    })

    context('Data Loading and Filtering', () => {
      it('successfully loads the first page of customers on start', () => {
        cy.intercept('GET', `${API_BASE_URL}/customers?page=1&limit=10&size=All&industry=All`, {
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

        cy.visit('/')
        cy.wait('@initialLoad')
        cy.get('table').should('be.visible')
        cy.get('table').contains('Jacobs Co')
      })

      it('updates the customer list when a size filter is selected', () => {
        cy.intercept('GET', `${API_BASE_URL}/customers?page=1&limit=10&size=Small&industry=All`, {
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

        cy.get('select#sizeFilter').select('Small')
        cy.wait('@filterBySize')
        cy.get('table').contains('Small Corp')
      })

      it('updates the customer list when an industry filter is selected', () => {
        cy.intercept('GET', `${API_BASE_URL}/customers?page=1&limit=10&size=All&industry=Technology`, {
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

        cy.get('select#industryFilter').select('Technology')
        cy.wait('@filterByIndustry')
        cy.get('table').contains('Tech Innovations')
      })
    })

    context('Pagination and Display Limits', () => {
      it('loads the next set of customers when the "Next" button is clicked', () => {
        cy.intercept('GET', `${API_BASE_URL}/customers?page=2&limit=10&size=All&industry=All`, {
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

        cy.get('button').contains('Next').click()
        cy.wait('@nextPage')
        cy.get('table').contains('Page Two Company')
      })

      it('updates the number of customers displayed per page', () => {
        cy.intercept('GET', `${API_BASE_URL}/customers?page=1&limit=20&size=All&industry=All`, {
          statusCode: 200,
          body: {
            customers: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              name: `Company ${i + 1}`,
              employees: 100 + i,
              industry: 'Various',
              size: 'Medium'
            })),
            pageInfo: {
              currentPage: 1,
              totalPages: 5,
              totalCustomers: 100
            }
          }
        }).as('paginationLimit')

        cy.get('select[aria-label="Pagination limit"]').select('20')
        cy.wait('@paginationLimit')
        cy.get('table tbody tr').should('have.length', 20)
      })
    })
  })

  context('Customer Details Management', () => {
    beforeEach(() => {
      cy.setCookie('cookieConsent', 'declined')
      cy.visit('/')
      // Ensure we have a customer to view
      cy.get('table').should('be.visible')
    })

    it('navigates to the customer details view', () => {
      cy.get('button[aria-label^="View company:"]').first().click()
      cy.contains('Customer Details').should('be.visible')
      cy.get('p').contains('Company ID:').should('be.visible')
      cy.get('p').contains('Company name:').should('be.visible')
    })

    it('toggles the visibility of the customer\'s address', () => {
      cy.get('button[aria-label^="View company:"]').first().click()

      // Show address
      cy.get('button').contains('Show address').click()
      cy.get('button').contains('Hide address').should('be.visible')

      // Verify address details are visible
      cy.contains('Address').should('be.visible')

      // Hide address
      cy.get('button').contains('Hide address').click()
      cy.get('button').contains('Show address').should('be.visible')
    })

    it('returns to the customer list view from the details view', () => {
      cy.get('button[aria-label^="View company:"]').first().click()
      cy.contains('Customer Details').should('be.visible')

      cy.get('button').contains('Back').click()
      cy.get('table').should('be.visible')
      cy.contains('Customer Details').should('not.exist')
    })
  })

  context('External Integrations and Data Export', () => {
    beforeEach(() => {
      cy.setCookie('cookieConsent', 'declined')
      cy.visit('/')
    })

    it('contains valid links to external resources in the footer', () => {
      const expectedLinks = {
        'Podcast': 'https://open.spotify.com/show/5HFlqWkk6qtgJquUixyuKo',
        'Courses': 'https://talking-about-testing.vercel.app/',
        'Blog': 'https://talkingabouttesting.com',
        'YouTube': 'https://youtube.com/@talkingabouttesting'
      }

      Object.entries(expectedLinks).forEach(([text, href]) => {
        cy.get('a').contains(text)
          .should('have.attr', 'href', href)
          .and('have.attr', 'target', '_blank')
      })
    })

    it('initiates a CSV download when the button is clicked', () => {
      // Set up download verification
      const downloadsFolder = Cypress.config('downloadsFolder')

      cy.get('button').contains('Download CSV').click()

      // Verify CSV file was downloaded
      cy.readFile(`${downloadsFolder}/customers.csv`, { timeout: 10000 })
        .should('exist')
        .and('contain', 'Company_Name')
    })
  })

  context('Combined Scenarios', () => {
    beforeEach(() => {
      cy.setCookie('cookieConsent', 'declined')
      cy.visit('/')
    })

    it('filters data by both size and industry', () => {
      cy.intercept('GET', `${API_BASE_URL}/customers?page=1&limit=10&size=Large%20Enterprise&industry=Technology`, {
        statusCode: 200,
        body: {
          customers: [
            {
              id: 100,
              name: 'Large Tech Corp',
              employees: 5000,
              industry: 'Technology',
              size: 'Large'
            }
          ],
          pageInfo: {
            currentPage: 1,
            totalPages: 1,
            totalCustomers: 1
          }
        }
      }).as('combinedFilter')

      cy.get('select#sizeFilter').select('Large Enterprise')
      cy.get('select#industryFilter').select('Technology')
      cy.wait('@combinedFilter')
      cy.get('table').contains('Large Tech Corp')
    })

    it('maintains filter state after viewing customer details and returning', () => {
      // Apply a filter
      cy.get('select#industryFilter').select('Technology')
      cy.get('select#industryFilter').should('have.value', 'Technology')

      // View details
      cy.get('button[aria-label^="View company:"]').first().click()

      // Go back
      cy.get('button').contains('Back').click()

      // Verify filter is still applied
      cy.get('select#industryFilter').should('have.value', 'Technology')
    })

    it('handles pagination with active filters', () => {
      cy.get('select#sizeFilter').select('Small')

      cy.intercept('GET', `${API_BASE_URL}/customers?page=2&limit=10&size=Small&industry=All`, {
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

      cy.get('button').contains('Next').click()
      cy.wait('@paginationWithFilter')
      cy.get('table').contains('Small Business Page 2')
      cy.get('select#sizeFilter').should('have.value', 'Small')
    })
  })
})

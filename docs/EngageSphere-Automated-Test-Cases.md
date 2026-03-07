# EngageSphere Automated Test Cases

This document provides a comprehensive list of automated test cases for the **EngageSphere** application. These cases are designed to ensure the application's core functionality, user interface, and API integrations are robust and reliable.

## 1. Core Application Features

The application includes several global features that enhance user experience, such as theme management and personalized greetings. These features are essential for maintaining a consistent and user-friendly interface.

| Test Case | Description | Elements & Selectors | Assertions |
| :--- | :--- | :--- | :--- |
| **Theme Toggle** | It successfully toggles between light and dark themes. | **Button:** `button[aria-label^="theme "]` | The `aria-label` attribute changes between "theme light activated" and "theme dark activated." |
| **Personalized Greeting** | It displays a personalized greeting when a name is entered. | **Input:** `input#name` or `input[placeholder="E.g., John Doe"]`<br>**Greeting:** `h2:contains("Hi")` | Entering "John Doe" results in the text "Hi John Doe! It is [Current Date]" being displayed. |

## 2. Cookie Consent Management

The cookie consent flow is a critical part of the application's compliance and user privacy settings. It ensures that users have control over their data tracking preferences.

| Test Case | Description | Elements & Selectors | Assertions |
| :--- | :--- | :--- | :--- |
| **Accept Cookies** | It hides the cookie banner when the "Accept" button is clicked. | **Button:** `button:contains("Accept")` | The cookie banner container is removed from the DOM. |
| **Decline Cookies** | It hides the cookie banner when the "Decline" button is clicked. | **Button:** `button:contains("Decline")` | The cookie banner container is removed from the DOM. |

## 3. Customer List and Data Filtering

The main functionality of EngageSphere revolves around displaying and filtering a list of customers. This data is fetched from an external API, and the application supports various filtering and pagination options.

### 3.1 Data Loading and Filtering

The application fetches customer data based on size and industry filters. These interactions trigger specific API calls that can be intercepted and mocked for testing purposes.

| Test Case | Description | Elements & Selectors | API Endpoint & Mock |
| :--- | :--- | :--- | :--- |
| **Initial Data Load** | It successfully loads the first page of customers on start. | **Table:** `table` | `GET /customers?page=1&limit=10&size=All&industry=All`<br>**Mock:** `{"customers": [{"id": 1, "name": "Jacobs Co", "employees": 99, "industry": "Logistics", "size": "Small"}], "total": 1}` |
| **Filter by Size** | It updates the customer list when a size filter is selected. | **Select:** `select#sizeFilter` | `GET /customers?page=1&limit=10&size=Small&industry=All` |
| **Filter by Industry** | It updates the customer list when an industry filter is selected. | **Select:** `select#industryFilter` | `GET /customers?page=1&limit=10&size=All&industry=Technology` |

### 3.2 Pagination and Display Limits

Users can navigate through the customer list using pagination controls and adjust the number of items displayed per page.

| Test Case | Description | Elements & Selectors | API Endpoint |
| :--- | :--- | :--- | :--- |
| **Next Page** | It loads the next set of customers when the "Next" button is clicked. | **Button:** `button:contains("Next")` | `GET /customers?page=2&limit=10&size=All&industry=All` |
| **Pagination Limit** | It updates the number of customers displayed per page. | **Select:** `select[aria-label="Pagination limit"]` | `GET /customers?page=1&limit=20&size=All&industry=All` |

## 4. Customer Details Management

The customer details view provides in-depth information about a specific company, including its address and contact information.

| Test Case | Description | Elements & Selectors | Assertions |
| :--- | :--- | :--- | :--- |
| **View Details** | It navigates to the customer details view. | **Button:** `button[aria-label^="View company:"]` | The "Customer Details" section is displayed with the correct Company ID and Name. |
| **Toggle Address** | It toggles the visibility of the customer's address. | **Button:** `button:contains("Show address")`<br>**Button:** `button:contains("Hide address")` | Clicking "Show address" reveals the address details; clicking "Hide address" hides them. |
| **Back to List** | It returns to the customer list view from the details view. | **Button:** `button:contains("Back")` | The main customer table is displayed again. |

## 5. External Integrations and Data Export

The application provides links to external resources and allows users to export the customer data for offline use.

| Test Case | Description | Elements & Selectors | Assertions |
| :--- | :--- | :--- | :--- |
| **Footer Links** | It contains valid links to external resources in the footer. | **Links:** `a:contains("Podcast")`, `a:contains("Courses")`, `a:contains("Blog")`, `a:contains("YouTube")` | Each link has a valid `href` attribute pointing to the correct external URL. |
| **Download CSV** | It initiates a CSV download when the button is clicked. | **Button:** `button:contains("Download CSV")` | Clicking the button triggers a browser download of a `.csv` file. |

> **Note:** All API requests are made to the base URL: `https://whispering-meadow-44853-562f20cee791.herokuapp.com`. Intercepting these requests allows for comprehensive testing of the application's data handling and error states.

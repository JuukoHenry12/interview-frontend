
Project Name
Overview

Brief description of the project, what it does, and its purpose.

What Was Implemented
User Authentication – Login and session management using NextAuth.js with email/password.

CRUD Operations for Products –

Display products in a paginated table

Add new products via modal form

Edit and delete existing products with confirmation alerts

Image uploads for product images

Responsive UI – Built with Tailwind CSS, works on desktop and mobile screens, including responsive tables, buttons, and modals.

Forms and Validation –

Custom forms for product creation and user interactions

Phone input validation using react-phone-input-2

SweetAlert2 for success/error notifications

API integration with Axios for data submission and retrieval

Tech Decisions & Assumptions

Next.js – chosen for server-side rendering, API routes, and React-based architecture.

Tailwind CSS – for quick, responsive styling.

Axios – for API calls.

React Icons – for consistent iconography.

NextAuth.js / Session management – to handle authentication.

Assumptions:

Backend API is RESTful and available at BASE_URL.

Users are expected to have modern browsers for full functionality.

Setup Instructions

Clone the repository:

git clone https://github.com/your-username/your-project.git
cd frontend


Install dependencies:

npm install --force


Set environment variables in .env.local:



Run the development server:

npm run dev


Open the app in your browser at:

http://localhost:3000

How to Run the Project

Development mode:

npm run dev


Production build:

npm run build
npm run start

Known Limitations

Some UI components are not fully responsive on smaller screens.

Limited error handling for API failures.

Authentication only supports email/password login.

No offline support implemented.

Additional Notes

API endpoints are expected to follow REST conventions.

For any environment-specific changes, update .env.local.

Styling conventions follow Tailwind CSS utility classes.
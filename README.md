# CLOCKER

## Overview

Clocker is a comprehensive application designed to streamline the process of time measurement for tasks, catering to both employers and employees. This app provides an intuitive interface for tracking the time spent on various tasks, enhancing productivity and accountability within the workplace.

## Prerequisites

- Node.js (version 20.x or later)
- npm (version 6.x or later)

## Installation

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Backend

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Applications

### Frontend

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will start the Nuxt application using Vite as the bundler. The application will be available at `http://localhost:3000`.

### Backend

1. **Start the NestJS server:**

   ```bash
   npm run start:dev
   ```

   This will start the NestJS application in development mode. The server will be running at `http://localhost:3001` (or another port if configured differently).

## Additional Scripts

### Frontend

- **Build for production:**

  ```bash
  npm run build
  ```

- **Preview the production build:**

  ```bash
  npm run preview
  ```

### Backend

- **Build the application:**

  ```bash
  npm run build
  ```

- **Run the application in production mode:**

  ```bash
  npm run start
  ```

## Notes

- Ensure that both the frontend and backend applications are running simultaneously for full functionality.
- Adjust the port numbers in the configuration files if there are any conflicts.

## Technologies Used

- **Frontend:**

  - **Nuxt:** A powerful framework for building server-side rendered Vue.js applications.
  - **Vue:** A progressive JavaScript framework for building user interfaces.
  - **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, providing enhanced code quality and maintainability.
  - **Vite:** A fast and modern build tool that serves as a development server and bundler.

- **Backend:**
  - **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
  - **Prisma:** A next-generation ORM that simplifies database access and management.
  - **SendGrid:** A cloud-based email delivery service for sending notifications and alerts.

## Environment Configuration

To run the application, you need to set up environment variables. Create a `.env` file in the root directory of both the frontend and backend projects with the necessary configurations. Sample configurations are located in .template.env files

# Job Tracker

Job Tracker is a web application that helps users manage their job applications. Users can add, edit, delete, and track the status of their job applications. The application also includes user authentication, password reset functionality, and the ability to export job data as a JSON file.

## Live Demo

Check out the live demo [https://job-tracker-blush.vercel.app/](https://job-tracker-blush.vercel.app/).

## Test Account

- **Username**: `user@example.com`
- **Password**: `password123`


## Example
![Job Tracker Demo](./Demo.gif)

## Features

- User authentication (login, registration, and JWT-based authentication)
- Password reset functionality (forgot password and reset password)
- Job management (CRUD operations for jobs)
- Drag-and-drop functionality for managing job statuses
- Export functionality to download jobs as a JSON file

## Technologies Used

- Frontend: React, Axios, @hello-pangea/dnd
- Backend: Node.js, Express, PostgreSQL, bcryptjs, jsonwebtoken, nodemailer
- Deployment: Vercel (Frontend), Render (Backend)

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job-tracker.git
   cd job-tracker
   ```

2. Install dependencies for the backend:
   ```bash
   cd Backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the `Backend` directory with the following environment variables:
   ```env
   PORT=5000
   Connection_String=your_postgresql_connection_string
   DATABASE_SSL=true
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

2. Create a `.env` file in the `frontend` directory with the following environment variables:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

### Database Setup

1. Create a PostgreSQL database and run the following SQL commands to set up the necessary tables:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE jobs (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     company VARCHAR(255) NOT NULL,
     status VARCHAR(50) NOT NULL,
     user_id INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd Backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Deployment

### Frontend Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the frontend:
   ```bash
   cd frontend
   vercel
   ```

### Backend Deployment

1. Deploy the backend to Render:
   - Follow the instructions on [Render](https://render.com/) to deploy your backend.

2. Set environment variables on Render:
   - Add the necessary environment variables in the Render dashboard.

## Technologies Used

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)
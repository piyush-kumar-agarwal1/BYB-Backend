# BYB Backend Project

## Overview

This project is a backend server built using Express.js and MongoDB. It provides RESTful APIs for user authentication, user profile management, and handling watchlists and ratings for media content.

## Project Structure

```
byb-backend
├── src
│   ├── config          # Configuration files
│   ├── controllers     # Controllers for handling requests
│   ├── middleware      # Middleware functions
│   ├── models          # Mongoose models
│   ├── routes          # API routes
│   ├── types           # TypeScript types
│   ├── utils           # Utility functions
│   ├── app.ts          # Express app initialization
│   └── server.ts       # Server entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # NPM package configuration
└── tsconfig.json       # TypeScript configuration
```

## Installation

1. Clone the repository:
   ```
   git clone <YOUR_GIT_URL>
   ```
2. Navigate to the project directory:
   ```
   cd byb-backend
   ```
3. Install the necessary dependencies:
   ```
   npm install
   ```

## Configuration

- Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret:
  ```
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```

## Running the Application

To start the server, run:

```
npm run dev
```

## API Endpoints

- **Authentication**

  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Log in an existing user

- **User Management**
  - `GET /api/user/profile` - Get user profile
  - `PUT /api/user/profile` - Update user profile

## Technologies Used

- Express.js
- MongoDB (Mongoose)
- TypeScript
- JWT for authentication

## License

This project is licensed under the MIT License.

# Course Selling Backend
 Backend of course selling application with user/admin role and purchase tracking

## Overview

This project is a backend service for a course-selling platform that supports user and admin roles, course creation, and purchase-based access control.

It is primarily built to explore backend architecture, data modeling, and role-based authentication, with a focus on designing scalable schemas for real-world use cases.


## Features
-User & Admin authentication (JWT)
-Course creation by admins
-Course purchase and access tracking
-MongoDB data modeling with seaparate purchase collection

## Tech Stack
-Node.js
-Express
-MongoDB + Mongoose
-JWT Authentication

## Data Modeling
-Users and Admins modeled separately
-Courses owned by Admins
-Purchases act as a join collection between users and courses

## Environment Setup
1. Clone the repository
2. Install dependencies (bash npm install)
3. Create a .env file using the provided .env.example
4. Add teh required environment variables:
    *MONGO_URL  
    *JWT_ADMIN_PASSWORD
    *JWT_USER-PASSWORD
5. Start the server (bash npm start)

## Known Limitations / Future Improvements
-No transactional guarantees yet (to be added later)

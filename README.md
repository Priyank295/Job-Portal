<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/XXvs7IQ.jpeg" alt="Project logo"></a>
</p>
<h3 align="center">JOB PORTAL</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/Priyank295/Job-Portal/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)

</div>

---

<p align="center"> The Job Application Management System is a comprehensive platform designed to streamline the recruitment process for companies. It provides functionalities for different user roles, including Admin, Recruiter, Hiring Manager, and Candidate, to manage job postings, applications, and hiring decisions efficiently.
    <br> 
</p>

## 📝 Table of Contents

- [Key Features](#features)
- [Setting up a local environment](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Installing Part](#installing)

- [Authors](#authors)

## Key Features <a name = "features"></a>

- **User Authentication and Authorization**: Secure user registration and login with role-based access control.
- **Admin Dashboard**: Allows administrators to manage user roles and view system-wide statistics.
- **Recruiter Dashboard**: Enables recruiters to create job postings, approve or reject candidate applications, and manage job listings.
- **Hiring Manager Dashboard**: Allows hiring managers to approve job postings, review approved applications, and make final hiring decisions.
- **Candidate Dashboard**: Provides candidates with the ability to view job listings, apply for jobs, and track the status of their applications.
- **Notifications**: Real-time notifications for recruiters and hiring managers about new applications and job approvals.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development
and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **MongoDB**: Install MongoDB from [mongodb.com](https://www.mongodb.com/)

### Installing <a name = "installing"></a>

A step-by-step series of examples that tell you how to get a development environment running.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Priyank295/Job-Portal
   cd Job-Portal
   ```
2. **Backend Setup**:

   - Navigate to the backend directory:

   ```
   cd backend
   ```

   - Install dependencies:

   ```
   npm install
   ```

   - Create a .env file and add your MongoDB connection string and JWT secret:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   - Start the backend server:

   ```
   nodemon app.js
   ```

3. **Frontend Setup**:
   - Navigate to the frontend directory
   ```
   cd ../frontend
   ```
   - Install dependencies:
   ```
   npm install
   ```
   - Start the frontend development server:
   ```
   npm run dev
   ```

## 🎈 Usage <a name="usage"></a>

1. Admin:

- Log in as an admin to manage user roles and view system-wide statistics.

2. Recruiter:

- Log in as a recruiter to create job postings, approve or reject candidate applications, and manage job listings.

3. Hiring Manager:

- Log in as a hiring manager to approve job postings, review approved applications, and make final hiring decisions.

4. Candidate:

- Log in as a candidate to view job listings, apply for jobs, and track the status of your applications.

## ⛏️ Built With <a name = "tech_stack"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [ReactJs](https://react.dev/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@Priyank295](https://github.com/Priyank295) - Idea & Initial work

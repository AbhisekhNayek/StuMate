# StuMate - Placement and Student Helper

StuMate is a web application built using the MERN (MongoDB, Express.js, React, Node.js) stack with Firebase integration. It serves as a University Placement Management System and provides students with tools for generating resumes, finding placement opportunities, and more.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **University Placement Management**: Manage placement opportunities, applications, and interviews.
- **Resume Generator**: Create and edit professional resumes.
- **Student Dashboard**: Access and manage your placement-related information.
- **Admin Dashboard**: Control and monitor placement-related data.
- **Firebase Integration**: Authentication, storage, and real-time database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB set up and running.
- Firebase project for authentication and data storage.
- Set Up Dependencies
## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/stumate.git
   ```

2. Change to the project directory:

   ```bash
   cd stumate
   ```

3. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

4. Install client dependencies:

   ```bash
   cd ../client
   npm install
   ```

## Configuration

1. Create a `.env` file in the `server` directory with the following configuration:

   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_uri
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_DATABASE_URL=your_firebase_database_url
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

2. Configure Firebase authentication and storage rules.

## Usage

1. Start the server:

   ```bash
   cd server
   npm start
   ```

2. Start the client:

   ```bash
   cd ../client
   npm start
   ```

3. Access the application at http://localhost:3000 in your web browser.

## Contributing

Feel free to contribute to this project. Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE.md).
```

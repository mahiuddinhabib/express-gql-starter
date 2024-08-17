# Library Management App

This project is a **Library Management App** built using **Express** and **GraphQL**. It provides a robust and scalable backend solution for managing users, books, and reading lists with role-based access control, pagination, error handling, searching, sorting, and filtering. Additionally, it supports file uploads using AWS S3 with signed URLs.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Running the Application](#running-the-application)
-   [License](#license)

## Features

-   **Role-Based Access Control (RBAC)**

    -   **Librarian:** Full access to manage users, books, and reading lists.
    -   **User:** Limited access to view and manage their own reading lists and view books.

-   **Pagination**

    -   Supports pagination with customizable page size, total count, and total pages.

-   **Error Handling**

    -   Centralized and consistent error handling with a global error format.

-   **Searching, Sorting, and Filtering**

    -   Flexible search, sort, and filter functionality on various fields.

-   **File Upload**
    -   Supports file uploads to AWS S3 using signed URLs.

## Technologies Used

-   **Backend:**

    -   [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
    -   [GraphQL](https://graphql.org/) - A query language for APIs and a runtime for fulfilling those queries.
    -   [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - A GraphQL server for building modern apps.
    -   [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript (ES7, ES6, ES5).
    -   [PostgreSQL](https://www.postgresql.org/) - Powerful, open source object-relational database system.
    -   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.

-   **Security:**

    -   [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication.
    -   [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing for secure storage.

-   **File Storage:**
    -   [AWS S3](https://aws.amazon.com/s3/) - Scalable object storage for file uploads.

## Project Structure

```plaintext
├── src
│   ├── db
|   |   ├── migrations
|   |   ├── entities
|   |   ├── subscribers
|   |   └── dataSource.ts
│   ├── graphql
│   │   ├── user
│   │   |   ├── typeDef.ts
│   │   |   ├── resolver.ts
│   │   |   ├── service.ts
│   │   |   └── index.ts
│   │   ├── ......
|   |   ├── ......
│   │   └── index.ts
│   ├── config
│   ├── enums
|   |   ├── ......
|   |   └── ......
│   ├── errors
│   |   ├── errorFormatter.ts
│   |   └── ......
│   ├── helpers
│   |   ├── ......
│   |   └── ......
│   ├── middlewares
│   |   ├── ......
|   |   └── ......
│   ├── utils
|   |   ├── ......
|   |   └── ......
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
├── ......
└── ......
```

## Getting Started

### Prerequisites

-   Node.js
-   PostgreSQL
-   AWS S3
-   yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mahiuddinhabib/express-gql-starter.git
cd library-management-app
```

2. Install the dependencies:

```bash
yarn
```

3. Create a `.env` file in the root directory and add the following environment variables:

```plaintext
PORT=4000
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/library

#bcrypt config
BCRYPT_SALT_ROUNDS=your_salt_rounds

# JWT Config
JWT_SECRET='your_secret'
JWT_EXPIRES_IN='your_expires'
JWT_REFRESH_SECRET='your_refresh_secret'
JWT_REFRESH_EXPIRES_IN='your_refresh_expires'

# AWS S3 Config
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

### Running the Application

1. Run the migrations:

```bash
yarn migrate:run
```

2. Start the server:

```bash
yarn dev
```

3. Open your browser and navigate to `http://localhost:4000/graphql` to access the GraphQL Playground.

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/MIT) file for details.

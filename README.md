# Xerostomia Backend

A NestJS-based backend for the Xerostomia project, using Prisma as the ORM with PostgreSQL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Clinician Management](#clinician-management)
  - [Demographics](#demographics)
  - [Reports](#reports)
  - [User Management](#user-management)

---

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm

---

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:port/xerostomia_db"
   JWT_SECRET="your-jwt-secret"
   REFRESH_SECRET="your-refresh-secret"
   ```

3. **Database Migration**:

   ```bash
   npx prisma migrate dev
   ```

4. **Start the application**:
   ```bash
   npm run start:dev
   ```

---

## API Documentation

### Authentication (`/auth`)

| Method   | Endpoint            | Description                                             | Auth Required       |
| :------- | :------------------ | :------------------------------------------------------ | :------------------ |
| **POST** | `/auth/create-user` | Creates a new user in the system.                       | Admin Only          |
| **POST** | `/auth/signin`      | Authenticates a user and returns access/refresh tokens. | No                  |
| **GET**  | `/auth/refresh`     | Refreshes the access token using a valid refresh token. | Yes (Refresh Token) |

### Clinician Management (`/clinician`)

| Method   | Endpoint                    | Description                                           | Auth Required |
| :------- | :-------------------------- | :---------------------------------------------------- | :------------ |
| **POST** | `/clinician/pair-clinician` | Establishes a link between a clinician and a patient. | Admin Only    |

### Demographics (`/demographics`)

| Method    | Endpoint                                | Description                                       | Auth Required |
| :-------- | :-------------------------------------- | :------------------------------------------------ | :------------ |
| **POST**  | `/demographics/create-demographic-data` | Saves initial demographic information for a user. | Yes           |
| **PATCH** | `/demographics/update-demographic-data` | Updates existing demographic records.             | Yes           |
| **POST**  | `/demographics/view-demographic-data`   | Retrieves demographic data for a specific user.   | Yes           |

### Reports (`/reports`)

| Method   | Endpoint                            | Description                                                 | Auth Required |
| :------- | :---------------------------------- | :---------------------------------------------------------- | :------------ |
| **POST** | `/reports/view-user-reports`        | Lists all reports associated with a specific user.          | Yes           |
| **POST** | `/reports/generate-report`          | Creates a new report and uploads associated files (images). | Yes           |
| **GET**  | `/reports/images/:userID/:reportID` | Fetches the images assigned to a specific report.           | Yes           |

### User Management (`/user`)

| Method    | Endpoint                                      | Description                                                 | Auth Required |
| :-------- | :-------------------------------------------- | :---------------------------------------------------------- | :------------ |
| **PATCH** | `/user/update-user-data`                      | Modifies core user profile information.                     | Admin Only    |
| **GET**   | `/user/view-users/:chooseRole/:ofClinicianID` | Retrieves users filtered by role and clinician association. | Yes           |

---

## License

UNLICENSED

# Serum-Bank API

### Technologies

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### Description

This project is a serum bank management system developed with the NestJS framework and TypeORM. The system is responsible for managing and processing serum samples in a database, including the creation, updating, and querying of information about serums and their positions.

### Steps to Run the Project:

#### Dependencies

Open the terminal and run the following command:

```bash
npm install
```

#### Environment

Create a .env file in the root of the project following the template below:

#### Email Configuration

- EMAIL_HOST=smtp.gmail.com
- EMAIL_USER=leo@email.com
- EMAIL_PASS=xxsaZAE2x

#### Database Configuration

- DB_HOST=localhost
- DB_PORT=5432
- DB_USERNAME=root
- DB_PASSWORD=root
- DB_DATABASE=postgres
- DB_DATABASE_TEST=postgres

#### Node Environment

- NODE_ENV=development
- APP_PORT=3000

#### JWT Secret

- JWT_SECRET=secretKey
- JWT_EXPIRES_IN=1800s

#### Command to Run Tests

```bash
npx jest
```

#### Commands to Run the Project

Open the terminal and run these commands:

- Start the database container

```bash
docker compose up
```

- Run the NestJS application

```bash
npm run start
```

#### Default User

- email: admin@admin.com
- password: admin

#### Documentation

To view the API documentation, access:

```
http://localhost:3000/api#/
```
#### Front-end example

<div align="left">
  <img width="350" alt="Screenshot 2024-08-17 at 14 27 23" src="https://github.com/user-attachments/assets/18fc76ff-bf17-40b1-a7e2-1b8c0757b447">
  <img width="350" alt="Screenshot 2024-08-17 at 14 23 49" src="https://github.com/user-attachments/assets/3e3c31ed-059c-4d51-b8ad-21017e3ec6e0">
  <img src="https://github.com/user-attachments/assets/dbd0d1cf-4efb-497e-ae42-ab9e72349267" alt="API Documentation Screenshot" width="350" />

</div>

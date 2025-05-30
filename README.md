# Serum-Bank API

### Technologies

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### Description

This project is a serum bank management system developed with the NestJS framework and TypeORM. The system is responsible for managing and processing serum samples in a database, including the creation, updating, and querying of information about serums and their positions.

### Steps to Run the Project:

#### Environment

Create a .env file in the root of the project following the template below:

#### Email Configuration

- EMAIL_HOST=smtp.gmail.com
- EMAIL_USER=leo@email.com
- EMAIL_PASS=xxsaZAE2x

#### Database Configuration

- DB_USERNAME=root
- DB_PASSWORD=root
- DB_DATABASE=SQL_LITE
- DB_DATABASE_TEST=SQL_LITE_TEST

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

- Start the app with docker

```bash
docker compose up
```

- Without docker:

#### Dependencies

Open the terminal and run the following command:

```bash
npm install
```

- Run the NestJS application

```bash
npm run start:dev
```

#### Default User

- email: admin@admin.com
- password: admin

#### Documentation

To view the API documentation, access:

```
http://localhost:3000/api#/
```
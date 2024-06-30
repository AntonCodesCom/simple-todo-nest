# Simple Todo (NestJS)

A Todo app backend built with NestJS.

## Features

- Todo CRUD RESTful API.
- Data validation of HTTP requests.
- JWT based user authentication.
- Password hashing with Argon2.
- PostgreSQL database interaction with Prisma ORM.
- Database migrations.
- Database seeding (non-production only).
- Type safety between app and database.
- Complete and functional Swagger API docs.
- Graceful environment variables handling.
- Pre-commit code formatting.
- Covered with automated tests.

## Installation

1.  Clone this repository.

1.  Install dependencies:

        npm install

1.  Define necessary environment variables (see instructions in the [`.env.example`](.env.example) file).

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# internal unit and integration tests
$ npm run test

# test coverage
$ npm run test:cov
```

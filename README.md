# Simple Todo (NestJS)

A Todo app API backend built with NestJS.

This is the backend for the Todo app frontend:

- Remix version: https://github.com/AntonCodesCom/simple-todo-remix
- Next.js version: https://github.com/AntonCodesCom/simple-todo-nextjs

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

        git clone https://github.com/AntonCodesCom/simple-todo-nest
        cd simple-todo-nest

1.  Install dependencies:

        npm install

1.  Define necessary environment variables (see instructions in the [.env.example](.env.example) file).

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
$ npm run test
```

# Project Title

## Technology Stack

- **React + Vite**: This project is built using React, a powerful JavaScript library to build user interfaces, and Vite,
  a modern front-end build tool offering a faster and leaner development experience. The combination of React and Vite
  gives the optimal development experience for building complex web interfaces.

- **Prisma**: Prisma, an open-source database toolkit, is used as an interface to the database. It simplifies database
  access and operations by providing an Object-Relational Mapping (ORM) layer. Prisma supports a multitude of databases
  and can be used to build various types of servers.

- **Axios**: Axios, a promise-based HTTP client, is used for handling HTTP requests. It allows both request and response
  interception, supports async/await syntax, and can transform request and response data.

## Setup and Run

**Service**:

1. Run `docker-compose.yml` with the command `docker-compose up`.
2. Seed the database using `npx prisma db seed`.
3. Generate the Prisma client using `npx prisma generate`.
4. Start the server using `npm run devStart`. The server starts on `port 3001`.

**Client**:

1. Start the client using `npm run dev`. The client application will run on `port 5173`.
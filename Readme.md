# RailRoad

RailRoad is a web application that allows users to securely create accounts, log in, manage trains and stations, filter schedules, book tickets, and validate them. The application provides both a user-friendly web interface as well as an API accessible via Postman for testing purposes. RailRoad project demonstrates efficient CRUD operations, authentication, and validation.

## Features

- User authentication with role-based access control (e.g., admin features).
- Create, update, delete, and filter **Trains** and **Stations**.
- Book and validate **Tickets**.
- REST API available for programmatic access via tools like Postman.

<br>

### Prerequisites

NodeJS & MongoDB

#### 1. Clone the repository:

```bash
git clone https://github.com/zakaribel-dev/RailRoad.git
```

#### 2. Install dependencies:

```npm install```   if you ever encounter a runtime error with sharp, run : npm install sharp --platform=win32 --arch=x64 --force


#### 3. Set up environment variables:

Create a .env file in the root directory with the following values:

```bash
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PORT=3000
```
#### 4. Start the application:

```bash
npm start
```
then go to http://localhost:3000/

## Organization and Task Management
To stay organized during the project, I used a Trello board to track progress, manage tasks, and set priorities. This helped me meet deadlines and maintain an efficient workflow.


## Architecture

- <b>Routes</b>: Define the endpoints for interacting with the app.
- <b>Controllers</b>: Handle the logic for processing requests and responses.
- <b>Services</b>: Contain the business logic and interact with the DAOs.
- <b>DAOs</b>: (Data Access Objects): Handle direct interaction with the database.

This structure promotes scalability and maintainability by making the codebase easier to manage, debug, and extend.
## Tests

npm run train <br>
or <br>
npm run ticket


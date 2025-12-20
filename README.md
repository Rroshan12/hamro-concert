# Hamro Concert API

Backend for the **Hamro Concert** application, built with Node.js, TypeScript, and Drizzle ORM.

## Getting Started
Clone the repository:
git clone <your-repo-url>
cd <your-repo-folder>

## Database Setup
Start the database using Docker:
docker-compose up -d

## Backend Setup
Navigate to the backend folder and install dependencies:
cd hamro-concert.api
npm install

## Environment Variables Backend
Create a `.env` file with: example is shown below
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser 
DB_PASSWORD=mypassword
DB_NAME=littledb

## Database Migrations
Generate and apply migrations:
npm run migrate:generate
npm run migrate:update-database

## Available Scripts
npm start – Start the backend server
npm run migrate:generate – Create a new migration
npm run migrate:update-database – Apply migrations to the database

## API Endpoints
GET /concerts – List all events
GET /concerts/:id – Get a single event
POST /concerts – Create a new event
PUT /concerts/:id – Update an event
DELETE /concerts/:id – Delete an event

## Notes
Ensure Docker  is installed and running
Configure `.env` with correct database credentials

## Tech Stack
Node.js, TypeScript, Drizzle ORM, Docker, PostgreSQL

## License
MIT



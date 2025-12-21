# Hamro Concert API

Backend for the **Hamro Concert** application, built with Node.js, TypeScript, and Drizzle ORM.

# Getting Started

Clone the repository:
git clone https://github.com/Rroshan12/hamro-concert.git
git checkout main

# Database Setup

Start the database using Docker:

docker-compose up -d

# Backend Setup
Navigate to the backend folder and install dependencies:

cd hamro-concert.api

npm install

# Environment Variables Backend

Create a `.env` file with: example is shown below

PORT=3000

DB_HOST=localhost

DB_PORT=5432

DB_USER=myuser 

DB_PASSWORD=mypassword

DB_NAME=littledb


# Start Backend

npm run dev

migration and seed happen automatically

if not run :

cd hamro-concert.api

npm run  migrate:generate

npm run  migrate:update-database


# Start FrontEnd


Navigate to the frontend folder and install dependencies:

cd hamro-concert.frontend

npm install

npm run dev





# API Endpoints

Swagger Doc For Api
http://localhost:3000/docs

# Test

Navigate to the test folder and install dependencies:

cd hamro-concert.api.test

npm install

node test-concurrent-seat-booking.js

node test-multiple-seat-booking.js

# Tech Stack
Node.js, TypeScript, Drizzle ORM, Docker, PostgreSQL






# Preventing Double-Booking & Race Conditions

This service ensures data integrity during high-concurrency ticket sales across multiple API instances.

# The Problem: Why Serializable Isolation Failed
Initially, i used Serializable Isolation, which uses an optimistic approach. When two instances read the same seat simultaneously, the database doesn't block them immediately. Instead, it waits until the "commit" phase to check for conflicts, often killing both transactions with 40001 Serialization Errors. This caused crashes during debugging and forced complex retry loops under high load.



# The Solution: Pessimistic Locking (FOR UPDATE)
i shifted to a pessimistic strategy using  'SELECT ... FOR UPDATE' . This acts as a physical gatekeeper:

Queueing: If Instance A locks a seat, Instance B is paused by the database until Instance A finishes.

Validation: Once Instance B is "released," it re-checks the seat status. It sees the updated is_booked value and returns a clean error instead of a duplicate booking.

# Atomic Integrity
Everything is wrapped in a Database Transaction. If any step fails from stock decrement to sale creation—the Rollback command restores all rows. This prevents "ghost bookings" ensuring seats are only taken if the payment and inventory updates succeed simultaneously.




# License
MIT



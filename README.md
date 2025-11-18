# CRUD with Redis and Prisma ORM

A complete CRUD (Create, Read, Update, Delete) application demonstrating the integration of Redis caching with Prisma ORM and PostgreSQL database.

## Features

- ✅ **Create** - Add new users to the database
- ✅ **Read** - Retrieve users with Redis caching for improved performance
- ✅ **Update** - Modify user data with automatic cache invalidation
- ✅ **Delete** - Remove users with cache cleanup
- ✅ **Caching Strategy** - Automatic Redis caching with 1-hour TTL
- ✅ **Cache Invalidation** - Smart cache invalidation on updates and deletes

## Tech Stack

- **Prisma ORM** - Database ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Redis** - In-memory cache for performance optimization
- **Node.js** - JavaScript runtime
- **dotenv** - Environment variable management

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL database server
- Redis server

**OR** use Docker (recommended):
- Docker and Docker Compose

## Installation

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Crud-redis-
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start PostgreSQL and Redis using Docker:
```bash
docker-compose up -d
```

4. The `.env` file is already configured for Docker. No changes needed!

5. Generate Prisma Client:
```bash
npm run db:generate
```

6. Run database migrations:
```bash
npm run db:migrate
```

7. Run the application:
```bash
npm start
```

### Option 2: Using Local Services

1. Clone the repository:
```bash
git clone <repository-url>
cd Crud-redis-
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database and Redis credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crud_redis_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

4. Generate Prisma Client:
```bash
npm run db:generate
```

5. Run database migrations:
```bash
npm run db:migrate
```

## Usage

Run the application:
```bash
npm start
```

This will execute a demo showcasing all CRUD operations with Redis caching.

## Available Scripts

- `npm start` - Run the application
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Docker Commands

- `docker-compose up -d` - Start PostgreSQL and Redis in the background
- `docker-compose down` - Stop and remove containers
- `docker-compose logs -f` - View logs from containers

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   └── migrations/        # Database migrations
├── index.js               # Main application with CRUD operations
├── package.json           # Project dependencies
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
└── README.md             # Project documentation
```

## How It Works

### Caching Strategy

1. **Read Operations**: 
   - First checks Redis cache
   - If not found, queries PostgreSQL
   - Stores result in Redis with 1-hour TTL

2. **Write Operations**:
   - Updates database via Prisma
   - Invalidates related cache entries
   - Ensures data consistency

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  age       Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Functions

The application exports the following functions:

- `createUser(name, email, age)` - Create a new user
- `getUserById(id)` - Get user by ID (with caching)
- `getAllUsers()` - Get all users
- `updateUser(id, data)` - Update user data
- `deleteUser(id)` - Delete user

## Example Usage

```javascript
import { createUser, getUserById, updateUser, deleteUser } from './index.js';

// Create a user
const user = await createUser('John Doe', 'john@example.com', 25);

// Get user (first call - from database)
const foundUser = await getUserById(user.id);

// Get user again (from cache)
const cachedUser = await getUserById(user.id);

// Update user (invalidates cache)
await updateUser(user.id, { age: 26 });

// Delete user (invalidates cache)
await deleteUser(user.id);
```

## License

ISC

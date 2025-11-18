# Quick Start Guide

## 🚀 Quick Start with Docker (Easiest)

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL and Redis
docker-compose up -d

# 3. Generate Prisma Client
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Run the demo
npm start
```

## 📝 Code Examples

### Import the functions
```javascript
import { createUser, getUserById, updateUser, deleteUser } from './index.js';
```

### Create a user
```javascript
const user = await createUser('John Doe', 'john@example.com', 25);
// Returns: { id: '...', name: 'John Doe', email: 'john@example.com', age: 25, ... }
```

### Get user by ID (with caching)
```javascript
const user = await getUserById(userId);
// First call: fetches from database and caches
// Second call: fetches from Redis cache (faster!)
```

### Update a user
```javascript
const updated = await updateUser(userId, { age: 26 });
// Updates database and invalidates cache
```

### Delete a user
```javascript
await deleteUser(userId);
// Deletes from database and invalidates cache
```

### Get all users
```javascript
const users = await getAllUsers();
// Returns array of all users
```

## 🛠️ Useful Commands

```bash
# View database in GUI
npm run db:studio

# Check Docker services status
docker-compose ps

# View Docker logs
docker-compose logs -f

# Stop Docker services
docker-compose down
```

## 🔍 Testing the Cache

Run the application twice to see caching in action:

```bash
npm start
```

Look for these messages:
- "User not in cache, fetching from database" (1st read)
- "User found in cache" (2nd read)
- "User updated and cache invalidated" (on update)

## 📚 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Documentation](https://redis.io/documentation)
- [Node.js Redis Client](https://github.com/redis/node-redis)

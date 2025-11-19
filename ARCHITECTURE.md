# Architecture Overview

## System Components

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Node.js   │◄────►│    Redis    │      │  PostgreSQL  │
│ Application │      │   (Cache)   │      │  (Database)  │
│  (index.js) │◄─────┴─────────────┘      └──────────────┘
│             │                                    ▲
└─────────────┘                                    │
       │                                           │
       └───────────────────────────────────────────┘
                    Prisma ORM
```

## Data Flow

### Read Operation (GET)
1. Request for user by ID
2. Check Redis cache
3. If cache HIT: Return cached data (fast!)
4. If cache MISS: Query PostgreSQL via Prisma
5. Store result in Redis with TTL (3600s)
6. Return data

### Write Operations (CREATE/UPDATE/DELETE)
1. Request to modify data
2. Execute operation in PostgreSQL via Prisma
3. Invalidate related cache entry in Redis
4. Return result

## Cache Strategy

- **Cache Key Pattern**: `user:{userId}`
- **TTL (Time To Live)**: 3600 seconds (1 hour)
- **Invalidation**: On UPDATE and DELETE operations
- **Storage Format**: JSON string

## Database Schema

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

## Benefits

### Performance
- **Reduced Database Load**: Frequently accessed data served from cache
- **Lower Latency**: Redis (in-memory) is faster than PostgreSQL queries
- **Scalability**: Can handle more concurrent reads

### Data Consistency
- **Cache Invalidation**: Ensures cache and database stay in sync
- **Atomic Operations**: Prisma transactions for data integrity

### Developer Experience
- **Simple API**: Easy-to-use CRUD functions
- **Type Safety**: Prisma generates TypeScript types
- **Easy Setup**: Docker Compose for local development

## Technology Choices

### Why Redis?
- Ultra-fast in-memory data store
- Built-in TTL support
- Simple key-value operations
- Industry standard for caching

### Why Prisma?
- Type-safe database access
- Automatic migrations
- Intuitive query API
- Great developer experience

### Why PostgreSQL?
- Reliable ACID compliance
- Rich data types
- Proven at scale
- Open source

## Environment Variables

```
DATABASE_URL      - PostgreSQL connection string
REDIS_HOST        - Redis server hostname
REDIS_PORT        - Redis server port
```

## Error Handling

- Connection errors logged to console
- Database errors propagated with messages
- Redis failures don't crash the app
- Graceful shutdown on exit

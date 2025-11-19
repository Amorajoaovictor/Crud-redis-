import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();
let redisClient;

// Initialize Redis client
async function initRedis() {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    }
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));

  await redisClient.connect();
}

// Redis cache key helper
function getCacheKey(id) {
  return `user:${id}`;
}

// CREATE - Create a new user
async function createUser(name, email, age) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        age
      }
    });
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}

// READ - Get user by ID (with Redis caching)
async function getUserById(id) {
  try {
    const cacheKey = getCacheKey(id);
    
    // Try to get from cache first
    const cachedUser = await redisClient.get(cacheKey);
    
    if (cachedUser) {
      console.log('User found in cache');
      return JSON.parse(cachedUser);
    }
    
    // If not in cache, get from database
    console.log('User not in cache, fetching from database');
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (user) {
      // Store in cache for 1 hour (3600 seconds)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
      console.log('User cached');
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error.message);
    throw error;
  }
}

// READ - Get all users
async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error getting all users:', error.message);
    throw error;
  }
}

// UPDATE - Update user by ID
async function updateUser(id, data) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data
    });
    
    // Invalidate cache
    const cacheKey = getCacheKey(id);
    await redisClient.del(cacheKey);
    console.log('User updated and cache invalidated:', user);
    
    return user;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
}

// DELETE - Delete user by ID
async function deleteUser(id) {
  try {
    const user = await prisma.user.delete({
      where: { id }
    });
    
    // Invalidate cache
    const cacheKey = getCacheKey(id);
    await redisClient.del(cacheKey);
    console.log('User deleted and cache invalidated:', user);
    
    return user;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
}

// Main function to demonstrate CRUD operations
async function main() {
  try {
    await initRedis();
    
    console.log('\n=== CRUD Operations Demo ===\n');
    
    // CREATE
    console.log('1. Creating users...');
    const user1 = await createUser('João Silva', 'joao@example.com', 25);
    const user2 = await createUser('Maria Santos', 'maria@example.com', 30);
    
    // READ ALL
    console.log('\n2. Getting all users...');
    const allUsers = await getAllUsers();
    console.log('All users:', allUsers);
    
    // READ BY ID (first call - from database)
    console.log('\n3. Getting user by ID (first call)...');
    const foundUser1 = await getUserById(user1.id);
    console.log('Found user:', foundUser1);
    
    // READ BY ID (second call - from cache)
    console.log('\n4. Getting same user by ID (second call - should be from cache)...');
    const foundUser2 = await getUserById(user1.id);
    console.log('Found user:', foundUser2);
    
    // UPDATE
    console.log('\n5. Updating user...');
    const updatedUser = await updateUser(user1.id, { age: 26 });
    console.log('Updated user:', updatedUser);
    
    // READ BY ID (after update - cache should be invalidated)
    console.log('\n6. Getting user after update (cache invalidated)...');
    const foundUser3 = await getUserById(user1.id);
    console.log('Found user:', foundUser3);
    
    // DELETE
    console.log('\n7. Deleting user...');
    await deleteUser(user2.id);
    
    // READ ALL (after delete)
    console.log('\n8. Getting all users after delete...');
    const remainingUsers = await getAllUsers();
    console.log('Remaining users:', remainingUsers);
    
    console.log('\n=== Demo completed successfully ===\n');
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await redisClient.quit();
    await prisma.$disconnect();
  }
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export functions for use in other modules
export {
  initRedis,
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  prisma,
  redisClient
};

/**
 * Example usage of CRUD operations
 * 
 * This file demonstrates how to use the CRUD functions
 * in your own code.
 */

import {
  initRedis,
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  prisma,
  redisClient
} from './index.js';

async function exampleUsage() {
  try {
    // Initialize Redis connection
    await initRedis();

    // 1. Create a new user
    console.log('Creating a new user...');
    const newUser = await createUser(
      'Example User',
      'example@test.com',
      28
    );
    console.log('Created:', newUser);

    // 2. Get user by ID (will fetch from database and cache)
    console.log('\nFetching user by ID...');
    const user = await getUserById(newUser.id);
    console.log('Found:', user);

    // 3. Get user by ID again (will fetch from cache)
    console.log('\nFetching user by ID again (from cache)...');
    const cachedUser = await getUserById(newUser.id);
    console.log('Found (cached):', cachedUser);

    // 4. Get all users
    console.log('\nFetching all users...');
    const allUsers = await getAllUsers();
    console.log(`Total users: ${allUsers.length}`);

    // 5. Update user
    console.log('\nUpdating user...');
    const updatedUser = await updateUser(newUser.id, {
      name: 'Updated Name',
      age: 29
    });
    console.log('Updated:', updatedUser);

    // 6. Delete user
    console.log('\nDeleting user...');
    await deleteUser(newUser.id);
    console.log('User deleted successfully');

    // 7. Verify deletion
    console.log('\nVerifying deletion...');
    const deletedUser = await getUserById(newUser.id);
    console.log('User exists:', deletedUser !== null);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Clean up connections
    await redisClient.quit();
    await prisma.$disconnect();
  }
}

// Run the example
exampleUsage();

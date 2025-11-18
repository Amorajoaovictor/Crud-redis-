#!/bin/bash

echo "=== CRUD Redis + Prisma Test Script ==="
echo ""

# Check if PostgreSQL is available
echo "1. Checking PostgreSQL availability..."
if command -v psql &> /dev/null; then
    echo "   ✓ PostgreSQL CLI found"
else
    echo "   ⚠ PostgreSQL CLI not found (psql command)"
fi

# Check if Redis is available
echo ""
echo "2. Checking Redis availability..."
if command -v redis-cli &> /dev/null; then
    echo "   ✓ Redis CLI found"
    if redis-cli ping &> /dev/null; then
        echo "   ✓ Redis server is running"
    else
        echo "   ⚠ Redis server not responding"
        echo "   Note: You can start Redis with: redis-server"
    fi
else
    echo "   ⚠ Redis CLI not found (redis-cli command)"
fi

echo ""
echo "3. Project structure:"
echo "   - index.js (main CRUD application)"
echo "   - prisma/schema.prisma (database schema)"
echo "   - .env.example (environment template)"
echo "   - README.md (documentation)"

echo ""
echo "4. Next steps to run the application:"
echo "   a) Ensure PostgreSQL server is running"
echo "   b) Ensure Redis server is running"
echo "   c) Update .env with your database credentials"
echo "   d) Run: npm run db:migrate"
echo "   e) Run: npm start"

echo ""
echo "=== Test script completed ==="

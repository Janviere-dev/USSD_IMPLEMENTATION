#!/bin/bash

# Quick Start Setup Script for MoMo Press

echo "🚀 MoMo Press - Quick Setup"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo -e "${GREEN}✓ Node.js detected${NC}"

# Setup Backend
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo "To start backend: cd backend && npm run dev"

# Setup Frontend
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd ../mpressClean

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo "To start frontend: cd mpressClean && npm start"

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n📝 Next Steps:"
echo "1. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Update API URL:"
echo "   Edit src/api/config.ts with your local IP"
echo "   Find IP: ifconfig | grep 'inet '"
echo ""
echo "3. Start Metro Bundler:"
echo "   cd mpressClean && npm start"
echo ""
echo "4. Run on Android:"
echo "   npx react-native run-android"
echo ""
echo "📖 For full guide, see INTEGRATION_GUIDE.md"

#!/bin/bash

echo "🚀 Starting Waternity Platform Local Development"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start Hardhat node in background
echo -e "${GREEN}⛓️  Starting Hardhat local blockchain...${NC}"
npm run hardhat > hardhat.log 2>&1 &
HARDHAT_PID=$!

# Wait for Hardhat to start
echo "Waiting for Hardhat to start..."
sleep 5

# Check if Hardhat is running
if ! ps -p $HARDHAT_PID > /dev/null; then
    echo -e "${RED}❌ Failed to start Hardhat node${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Hardhat node started (PID: $HARDHAT_PID)${NC}"

# Deploy contracts
echo -e "${GREEN}📄 Deploying smart contracts...${NC}"
npm run deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Contract deployment failed${NC}"
    kill $HARDHAT_PID
    exit 1
fi

echo -e "${GREEN}✅ Contracts deployed successfully${NC}"

# Start Next.js development server
echo -e "${GREEN}🌐 Starting Next.js frontend on port 3333...${NC}"
echo -e "${YELLOW}📌 Access the application at: http://localhost:3333${NC}"
npm run dev

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $HARDHAT_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT 
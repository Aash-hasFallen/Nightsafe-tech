#!/bin/bash

echo "🚀 INITIALIZING NIGHTSAFE: SMART CAMPUS GUARDIAN..."
echo "--------------------------------------------------"
echo "SYSTEM CORE: NEXT.JS 15 (APP ROUTER)"
echo "THEME ID: FUTURISTIC_NEON_DARK"
echo "LOCATION BASE: PARUL UNIVERSITY"
echo "--------------------------------------------------"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 PREPARING SYSTEM ASSETS (Installing dependencies)..."
    npm install
fi

echo "🔐 STARTING SECURE PROTOCOL AT http://localhost:3000"
npm run dev

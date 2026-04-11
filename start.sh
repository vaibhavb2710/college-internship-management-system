#!/bin/bash
# College Internship Management System - Startup Script (macOS/Linux)
# This script starts both the backend and frontend servers

echo ""
echo "==========================================="
echo "College Internship Management System"
echo "Startup Script - macOS/Linux"
echo "==========================================="
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! mongosh --eval "db.version()" > /dev/null 2>&1; then
    echo "[WARNING] MongoDB might not be running!"
    echo "Please start MongoDB first:"
    echo "  macOS: brew services start mongodb-community"
    echo "  Linux: sudo systemctl start mongod"
    echo ""
fi

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "[ERROR] Backend virtual environment not found!"
    echo "Please run setup first:"
    echo "  cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start Backend
echo "Starting Backend Server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==========================================="
echo "Servers starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Test Login (if database seeded):"
echo "  Email: rahul.sharma@vit.edu.in (Student)"
echo "  Password: student123"
echo "==========================================="
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

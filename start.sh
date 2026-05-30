#!/bin/bash
# HeartCare AI — Start both servers

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting HeartCare AI..."

# Start Django backend
echo "▶️  Starting Django backend on port 8000..."
cd "$PROJECT_DIR/backend"
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Start React frontend
echo "▶️  Starting React frontend on port 5173..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ HeartCare AI is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin"
echo ""
echo "📋 Login credentials:"
echo "   Admin:   admin / Admin@123"
echo "   Doctor:  dr_sharma / Doctor@123"
echo "   Patient: patient1 / Patient@123"
echo ""
echo "Press Ctrl+C to stop all servers"

wait

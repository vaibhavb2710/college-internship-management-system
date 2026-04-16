
# 🔄 Frontend-Backend Development Flow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

                          YOU (Developer)
                               │
                               │ Edit Files
                               ↓
        ┌──────────────────────────────────────────┐
        │      Frontend Source Files (.tsx)        │
        │      src/app/components/                 │
        │      src/services/                       │
        │      src/styles/                         │
        └──────────────────────────────────────────┘
                               │
                               │ Ctrl+S Save
                               ↓
               ┌───────────────────────────┐
               │   Vite File Watcher       │
               │   (dev mode enabled)      │
               └───────────────────────────┘
                               │
                               ├─ Detects change
                               ├─ Recompiles changed modules
                               └─ Triggers HMR
                                          │
                                          ↓
                    ┌─────────────────────────────────┐
                    │   Hot Module Replacement (HMR)  │
                    │   WebSocket: localhost:5173     │
                    │   Injects updates into browser  │
                    └─────────────────────────────────┘
                                          │
                                          ↓
                    ┌─────────────────────────────────┐
                    │     Running Browser Tab         │
                    │   http://localhost:5173         │
                    │   Shows changes instantly!      │
                    │   State preserved (no reload)   │
                    └─────────────────────────────────┘
                                          │
                        ┌─────────────────┴──────────────────┐
                        │ (When making API calls)            │
                        ↓                                     ↓
            ┌──────────────────────┐      ┌────────────────────────────┐
            │  /api/* Proxy rules  │      │  Proxy interceptor still   │
            │  (vite.config.ts)    │      │  works during HMR          │
            └──────────────────────┘      └────────────────────────────┘
                        │                               │
                        └───────────────────┬───────────┘
                                          │ Forward to backend
                                          ↓
        ┌──────────────────────────────────────────┐
        │    Flask Backend Server                  │
        │    http://127.0.0.1:5000                 │
        │    (Development mode, auto-reload on)    │
        └──────────────────────────────────────────┘
                               │
                               │ File changes
                               ↓
        ┌──────────────────────────────────────────┐
        │      Backend Source Files (.py)          │
        │      backend/routes/                     │
        │      backend/models/                     │
        │      backend/middleware/                 │
        └──────────────────────────────────────────┘
                               │
                               │ Ctrl+S Save
                               ↓
               ┌───────────────────────────┐
               │  Flask File Watcher       │
               │  (use_reloader=True)      │
               └───────────────────────────┘
                               │
                               ├─ Detects .py file change
                               ├─ Terminates Flask process
                               └─ Restarts Flask
                                          │
                                          ↓
                    ┌─────────────────────────────────┐
                    │   New routes/models loaded      │
                    │   API endpoints updated         │
                    │   Frontend API calls see new    │
                    │   code immediately              │
                    └─────────────────────────────────┘
                                          │
                                          ↓
                    ┌─────────────────────────────────┐
                    │     MongoDB Database            │
                    │     :27017                      │
                    │     (Your data persists)        │
                    └─────────────────────────────────┘
```

## Communication Flow Chart

```
Example: User Saves Changes to Admin Dashboard

STEP 1: Frontend File Changes
────────────────────────────────
src/app/components/admin-dashboard.tsx
                    │
                    ├─ Developer presses Ctrl+S
                    │
                    └─→ Saved to disk

STEP 2: Vite Detection & HMR
────────────────────────────────
Vite File Watcher detects .tsx change
                    │
                    ├─ Parses changed component
                    ├─ Finds dependencies
                    ├─ Recompiles only changed code (not whole app!)
                    │
                    └─→ Creates HMR update payload

STEP 3: Browser Update
────────────────────────────────
HMR WebSocket sends update to browser
                    │
                    ├─ Browser receives new module
                    ├─ React updates component
                    ├─ State and props preserved!
                    │
                    └─→ User sees changes instantly (~100ms)
                        WITHOUT page reload!

STEP 4: API Call (if component makes API call)
────────────────────────────────
Frontend makes fetch('/api/announcements')
                    │
                    ├─ Vite proxy intercepts
                    ├─ Routes to 127.0.0.1:5000/api/announcements
                    │
                    └─→ Hits Flask backend

────────────────────────────────────────────────────────

Example: User Saves Changes to Backend Route

STEP 1: Backend File Changes
────────────────────────────────
backend/routes/announcements.py
                    │
                    ├─ Developer presses Ctrl+S
                    │
                    └─→ Saved to disk

STEP 2: Flask Detection & Reload
────────────────────────────────
Flask Reloader detects .py change
                    │
                    ├─ Signals running Flask process
                    ├─ Gracefully shuts down
                    ├─ Restarts Python interpreter
                    ├─ Reimports all modules with new code
                    │
                    └─→ New routes/models loaded

STEP 3: Terminal Output
────────────────────────────────
Terminal shows:
"Restarting with reloader"
"Running on http://127.0.0.1:5000"
                    │
                    └─→ User knows backend is ready

STEP 4: Frontend Sees Changes
────────────────────────────────
Frontend API calls now hit new code
                    │
                    ├─ GET /api/announcements → new route handler
                    ├─ POST /api/announcements → updated logic
                    ├─ Response now has updated data/schema
                    │
                    └─→ Frontend receives new API response
                        User sees updated data!
```

## Key Features of This Setup

### 🟢 Frontend Auto-Reload (Vite HMR)
```
What: Hot Module Replacement
Why: Changes show instantly without page reload
How: WebSocket connection from Vite server
When: Save any .tsx, .css, .ts file
Result: State preserved, UI updates in microseconds
```

### 🟢 Backend Auto-Reload (Flask Reloader)
```
What: Automatic Flask process restart
Why: New code loaded without manual restart
How: File watcher detects .py changes
When: Save any Python file
Result: Routes/models updated, new code available
```

### 🟢 Seamless Proxy Integration
```
What: Frontend /api calls go to backend
Why: No CORS issues, single origin
How: Vite proxy configured in vite.config.ts
When: Always (development and production)
Result: Frontend and backend work together seamlessly
```

## Startup Scripts Explained

### `dev-start.bat` (Main Script)
```
What it does:
  1. Checks Node.js is installed ✓
  2. Checks Python is installed ✓
  3. Checks MongoDB is running ⚠
  4. Starts Backend in new Terminal Window
  5. Waits 2 seconds for backend startup
  6. Starts Frontend in new Terminal Window
  7. Shows help text and keeps main window open

Result:
  - Two terminal windows: one for each server
  - Easy to keep both running visibly
  - Can stop each independently
```

### `dev-frontend-only.bat`
```
When to use: Backend already running elsewhere
What it does: Start frontend on port 5173+
Result: Only frontend terminal window opens
```

### `dev-backend-only.bat`
```
When to use: Frontend already running elsewhere
What it does: Start backend on port 5000
Result: Only backend terminal window opens
```

### `backend/run_dev.py`
```
What it does:
  - Imports Flask app in development mode
  - Enables debug=True for detailed errors
  - Enables use_reloader=True for auto-restart
  - Binds to 127.0.0.1:5000
  - Shows startup message

Features:
  - Auto-reloads on .py file changes
  - Shows detailed error tracebacks
  - Can be stopped with Ctrl+C
```

## Port Management

### Ports Used
```
Frontend:  localhost:5173  (fallback to 5174, 5175, etc)
           └─ Uses: Vite dev server
           └─ Proxies /api to backend
           └─ HMR WebSocket on same port

Backend:   127.0.0.1:5000
           └─ Uses: Flask development server
           └─ Serves REST API
           └─ Database operations

Database:  127.0.0.1:27017
           └─ Uses: MongoDB server
           └─ Stores all application data
```

### Port Conflict Resolution
```
❌ Port 5173 in use?
   └─ Vite automatically tries 5174, 5175, ...
   └─ Check terminal for actual port
   └─ No action needed!

❌ Port 5000 in use?
   └─ Need to free it or change FLASK_PORT
   └─ Use: FLASK_PORT=5001 in backend/.env
   └─ Or kill process using port 5000

❌ Port 27017 in use?
   └─ MongoDB conflict
   └─ Stop other MongoDB instance
   └─ Or change MONGODB_URI in config
```

## Development Workflow Benefits

### Before This Setup ❌
```
1. Manually restart Flask after each Python change
2. Manually refresh browser after each React change
3. Lose component state on page refresh
4. Slow feedback loop (minutes per test)
5. Hard to debug async issues
```

### With This Setup ✅
```
1. Flask auto-restarts on .py save
2. React HMR on .tsx save (no refresh!)
3. State preserved across updates
4. Getting feedback in ~100-500ms
5. Easy to test rapid changes
```

## Configuration Files

### `vite.config.ts`
```typescript
server: {
  port: 5173,
  strictPort: false,          // Allow fallback to next port
  hmr: {
    host: 'localhost',        // HMR listens on localhost
    port: 5173,               // HMR on same port as dev server
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',  // Forward to backend
      changeOrigin: true,
      rewrite: (path) => path,
    },
  },
}
```

### `backend/run_dev.py`
```python
app.run(
    host='127.0.0.1',         # Bind to localhost
    port=5000,                # Flask port
    debug=True,               # Enable debug mode
    use_reloader=True,        # Enable auto-reload
    use_debugger=True,        # Enable debugger
)
```

### `backend/config.py`
```python
class DevelopmentConfig(Config):
    DEBUG = True              # Debug mode enabled
    TESTING = False
```

## Files Structure

```
Project/
├── 🚀 dev-start.bat                ← START HERE
├── 📖 QUICK_START.md               ← Quick guide  
├── 📚 DEV_SERVER_GUIDE.md          ← Full documentation
│
├── Frontend (http://localhost:5173)
│   ├── vite.config.ts              ← HMR + Proxy configured
│   ├── src/
│   │   ├── main.tsx
│   │   ├── app/components/         ← Edit these, HMR reloads
│   │   ├── services/               ← API calls
│   │   └── styles/
│   └── package.json                ← npm run dev
│
└── Backend (http://127.0.0.1:5000)
    ├── run_dev.py                  ← Development runner
    ├── app.py                      ← Flask app
    ├── config.py                   ← Environment config
    ├── routes/                     ← Edit these, auto-restarts
    ├── models/                     ← Edit these, auto-restarts
    └── requirements.txt            ← Python dependencies
```

---

## 🎯 Next Steps

1. **Run the servers:**
   ```bash
   dev-start.bat
   ```

2. **Edit some code and watch it reload:**
   - Edit `src/app/components/student-dashboard.tsx`
   - Save
   - See it update in the browser instantly!

3. **Edit backend code and watch it reload:**
   - Edit `backend/routes/announcements.py`
   - Save  
   - See "Restarting with reloader" message

4. **Your development is now 10x faster!** 

---

**This architecture provides:**
- ✅ Instant feedback on changes
- ✅ No manual restarts needed
- ✅ Full browser state preserved
- ✅ Seamless frontend-backend communication
- ✅ Professional development experience

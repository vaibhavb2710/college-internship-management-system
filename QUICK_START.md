# 🚀 Unified Development Setup - Quick Start Guide

## What You Have Now

Your project now has **automatic frontend and backend synchronization** with hot reload enabled for both!

---

## ✅ Quick Start (Recommended)

### Just Double-Click This File:
```
dev-start.bat  ← Double-click this! 🎯
```

**What it does:**
1. ✓ Starts Flask backend with auto-reload (http://127.0.0.1:5000)
2. ✓ Starts Vite frontend with HMR (http://localhost:5173+)
3. ✓ Opens new windows for each server
4. ✓ All file changes auto-reload instantly

---

## 📁 New Files Created

| File | Purpose | When to Use |
|------|---------|------------|
| `dev-start.bat` | Start BOTH servers | **Use this first!** ✨ |
| `dev-frontend-only.bat` | Start frontend only | If backend is already running |
| `dev-backend-only.bat` | Start backend only | If frontend is already running |
| `dev-start.ps1` | PowerShell version | PowerShell users |
| `backend/run_dev.py` | Development server runner | Auto-called by dev-start.bat |
| `DEV_SERVER_GUIDE.md` | Complete documentation | Reference guide |

---

## 🔄 The Auto-Reload Connection

### How Changes Update Instantly

```
YOU SAVE A FILE
    ↓
🔍 File watcher detects change
    ↓
⚡ For Frontend (.tsx, .css, .ts):
   └─→ Vite recompiles → HMR updates browser (usually <100ms)
    ↓
⚡ For Backend (.py):
   └─→ Flask restarts → New routes/models loaded
    ↓
✅ Changes visible immediately!
```

### Example Workflows

**Updating Admin Dashboard:**
1. Edit `src/app/components/admin-dashboard.tsx`
2. Save (Ctrl+S)
3. **Browser updates in 50-100ms** ← No refresh needed!

**Updating Announcement API:**
1. Edit `backend/routes/announcements.py`
2. Save (Ctrl+S)
3. **Terminal shows "Restarting with reloader"**
4. **Frontend API calls hit new code instantly**

**Changing Database Models:**
1. Edit `backend/models/announcement.py`
2. Save (Ctrl+S)
3. **Backend restarts** → New model methods available

---

## 🎯 Step-by-Step First Run

### 1️⃣ Prerequisites Check
- [ ] Node.js installed (check: `node --version`)
- [ ] Python installed (check: `python --version`)
- [ ] MongoDB running (check: `mongod` or MongoDB service)
- [ ] In project root directory

### 2️⃣ Start Servers
```bash
# Option A: Just double-click
dev-start.bat

# Option B: From command prompt
dev-start.bat

# Option C: Manual
# Terminal 1:
cd backend
python run_dev.py

# Terminal 2:
npm run dev
```

### 3️⃣ Open Browser
- Click: http://localhost:5173 (or check terminal for actual port)
- You should see the Login page

### 4️⃣ Verify Auto-Reload Works

**Test Frontend Auto-Reload:**
1. Open `src/app/components/student-dashboard.tsx`
2. Find `return (` statement
3. Add a `<h1>TEST</h1>` line temporarily
4. Save
5. **Check browser - it updates WITHOUT refresh!** ✨

**Test Backend Auto-Reload:**
1. Open `backend/routes/announcements.py`
2. Find `@announcements.route('/api/announcements')`
3. Add a comment like `# Test reload`
4. Save
5. **Check backend terminal - it shows restarting!** 🔄

---

## 📊 Server Status Checklist

### Frontend Server
```
✓ Terminal shows: "VITE v6.3.5 ready in XXX ms"
✓ URL shows: "Local: http://localhost:5173"
✓ Browser shows: Login page loads without errors
✓ DevTools (F12) Console: No red errors
```

### Backend Server
```
✓ Terminal shows: "Running on http://127.0.0.1:5000"
✓ Terminal shows: "Database indexes created successfully"
✓ No error messages in red text
✓ API accessible: curl http://127.0.0.1:5000/api/announcements
```

---

## 🛠️ Common Tasks

### Add a New Frontend Component
```
1. Create: src/app/components/my-component.tsx
2. Edit it
3. Save
4. HMR automatically reloads ← No page refresh needed!
```

### Add a New Backend Route
```
1. Edit: backend/routes/announcements.py
2. Add your route function
3. Save
4. Backend restarts in 1-2 seconds
5. Frontend can immediately call new route
```

### Change Database Model
```
1. Edit: backend/models/announcement.py
2. Update schema or methods
3. Save
4. Backend reloads model
5. Routes using it pick up changes
```

### Test API Endpoint
```bash
# While both servers running:
curl -X GET http://127.0.0.1:5000/api/announcements

# Or open in browser:
http://127.0.0.1:5000/api/announcements
```

---

## ❌ Common Issues & Quick Fixes

### Port Already in Use
```
❌ "Port 5173 is already in use"
✅ Vite automatically uses 5174, 5175, etc.
   Check terminal for actual port number!

❌ "Port 5000 is already in use"
✅ Stop the other process:
   - Task Manager → find python.exe → End Process
   - Or change FLASK_PORT in backend/run_dev.py
```

### MongoDB Connection Error
```
❌ "Error: connect ECONNREFUSED 127.0.0.1:27017"
✅ Start MongoDB:
   - Windows Service: Services app → MongoDB → Right-click → Start
   - Or run: mongod
   - Or check it's actually installed
```

### Blank Page in Browser
```
❌ Browser shows blank page
✅ Try:
   1. Hard refresh: Ctrl+Shift+R
   2. Check browser console (F12) for red errors
   3. Check backend is running properly
   4. Check terminal for Flask/Vite errors
```

### Changes Not Showing Up
```
❌ File saved but changes not visible
✅ For Frontend:
   - Check red dot next to filename (unsaved indicator)
   - Look for HMR message in browser console
   - Try Ctrl+Shift+R hard refresh
   
✅ For Backend:
   - Check "Restarting with reloader" message
   - Check for Python syntax errors
   - Check file was actually saved
```

---

## 📝 File Structure

```
Project Root/
├── dev-start.bat                    ← START HERE! 🚀
├── dev-start.ps1                    
├── dev-frontend-only.bat            
├── dev-backend-only.bat             
├── DEV_SERVER_GUIDE.md              ← Full documentation
├── vite.config.ts                   ← HMR configured ✓
├── src/
│   └── app/
│       └── components/              ← Edit these, HMR reloads
│       └── ...
├── backend/
│   ├── run_dev.py                   ← Development server ✓
│   ├── run_server.py                ← Production server
│   ├── app.py
│   ├── config.py
│   ├── models/                      ← Changes trigger restart
│   ├── routes/                      ← Changes trigger restart
│   └── ...
└── ...
```

---

## 🎯 Development Workflow Summary

```
1. ✅ Double-click or run: dev-start.bat

2. ⏳ Wait for both servers to start (~5 seconds)

3. 🌐 Open browser: http://localhost:5173

4. 💻 Edit your code (frontend OR backend)

5. 💾 Save file (Ctrl+S)

6. ✨ Changes appear INSTANTLY!
   - Frontend: HMR (no page reload needed)
   - Backend: Auto-restart (new API available)

7. 🧪 Test your changes

8. 🔁 Go to step 4, repeat!
```

---

## 🔐 What's Different in Development

### Enabled Features (Development Only):
✅ Debug mode active
✅ Auto-reload on file changes  
✅ HMR in frontend
✅ Detailed error messages
✅ CORS from localhost

### Disabled Features (Development Only):
⚠️ Not suitable for production
⚠️ Debug info exposed
⚠️ Auto-reload CPU overhead
⚠️ No compression

**→ For production, use:** `npm run build` and change FLASK_ENV to production

---

## 💡 Pro Tips

1. **Keep terminal windows visible** → See real-time HMR and reload messages
2. **Open DevTools (F12)** → Check Console for HMR heartbeat
3. **Use browser refresh** → F5 for full reload, Ctrl+Shift+R for hard refresh
4. **Check file saved** → Look for unsaved indicator (dot) in editor tabs
5. **Look at terminal output** → Error messages usually explain what's wrong

---

## ✅ You're All Set!

Everything is configured for development with instant auto-reload. Just double-click `dev-start.bat` and you're ready to code! 🚀

---

**Need help?** Check `DEV_SERVER_GUIDE.md` for detailed documentation.

**Questions about the system?** Check `README.md` or `IMPLEMENTATION_SUMMARY.md`.

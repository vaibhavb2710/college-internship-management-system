# Development Environment Setup Guide

## 🚀 Quick Start

### Option 1: Batch File (Recommended for Windows)
```bash
# Just double-click this file:
dev-start.bat

# Or from command prompt:
dev-start.bat
```

### Option 2: PowerShell
```powershell
# Run in PowerShell:
.\\dev-start.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\\dev-start.ps1
```

### Option 3: Manual Start (for troubleshooting)

**Terminal 1 - Backend:**
```bash
cd backend
python run_dev.py
```

**Terminal 2 - Frontend (in project root):**
```bash
npm run dev
```

---

## 🔄 Auto-Reload System Explained

### Frontend Auto-Reload (Vite HMR)
- **Port:** http://localhost:5173
- **How It Works:** When you save any `.tsx`, `.ts`, `.css`, or other source files, Vite automatically:
  - Recompiles only the changed modules
  - Hot-injects updates into the running browser
  - **No full page refresh needed** - state is preserved
- **File Watch:** Monitors all files in `src/` directory
- **Browser DevTools:** Open DevTools to see HMR updates in console

### Backend Auto-Reload (Flask Reloader)
- **Port:** http://127.0.0.1:5000
- **How It Works:** When you save any `.py` file in `backend/`, Flask:
  - Detects the change
  - Automatically restarts the server
  - Reloads all routes and models
  - **API continues working** - frontend sees new endpoints
- **File Watch:** Monitors `backend/` directory for all `.py` files
- **Terminal Output:** Shows "restarting with reloader" message

---

## 📁 File Watching Behavior

### Frontend Changes That Auto-Reload:
✅ Component files (`.tsx`)
✅ Service files (`.ts`)
✅ Style files (`.css`)
✅ Configuration files (`vite.config.ts`)

### Backend Changes That Auto-Reload:
✅ Model files (`models/*.py`)
✅ Route files (`routes/*.py`)
✅ Middleware files (`middleware/*.py`)
✅ Configuration files (`config.py`, `app.py`)
✅ Any other Python files

---

## 🔌 Connection Flow

```
┌─────────────────────┐
│   Browser Tab       │
│ localhost:5173      │
└──────────┬──────────┘
           │
           │ HTTP + WebSocket (HMR)
           │
┌──────────▼──────────┐
│   Vite Dev Server   │
│   :5173 / :5174...  │
│   (Auto-Reload)     │
└──────────┬──────────┘
           │
           │ Proxy /api to backend
           │
┌──────────▼──────────┐
│   Flask Backend     │
│   127.0.0.1:5000    │
│   (Auto-Reload)     │
└─────────────────────┘
           │
           │ MongoDB operations
           │
┌──────────▼──────────┐
│    MongoDB          │
│    :27017           │
└─────────────────────┘
```

---

## ⚙️ Configuration Files

### `.env` File (Optional - Backend)
Create `backend/.env` to override defaults:
```env
FLASK_ENV=development
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
MONGODB_URI=mongodb://localhost:27017/internship_management
JWT_SECRET=your-dev-secret-key
```

### `vite.config.ts` (Frontend)
Already configured for:
- HMR on localhost:5173
- Proxy to backend at /api
- Port fallback (5173 → 5174 → 5175...)
- React and Tailwind plugins

### `config.py` (Backend)
Already configured for:
- Debug mode enabled in development
- Auto-reload enabled
- CORS for localhost:5173

---

## 🐛 Troubleshooting

### Issue: "Port 5173 is already in use"
**Solution:** Vite automatically uses next available port (5174, 5175...)
- Check the terminal output for the actual URL
- Or manually change port in `vite.config.ts`

### Issue: "Port 5000 is already in use"
**Solution:** 
1. Kill the process using port 5000:
   ```bash
   # PowerShell
   Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property ProcessId | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
   
   # Or change port in backend/.env:
   FLASK_PORT=5001
   ```

### Issue: "MongoDB connection refused"
**Solution:** Start MongoDB
```bash
# Windows - if installed as service
sc start MongoDB

# Or run MongoDB manually
mongod
```

### Issue: "Frontend shows blank page after backend restart"
**Solution:** Vite might have lost connection
- Press F5 or Ctrl+Shift+R in browser for hard refresh
- Or check browser console for errors (F12)
- Check terminal for actual port number if different

### Issue: "Changes not showing up"
**Frontend:**
1. Check file was actually saved (look for dot indicator in editor)
2. Open DevTools (F12) and check Network tab
3. Check browser console for HMR messages
4. Try hard refresh: Ctrl+Shift+R

**Backend:**
1. Check terminal for "Restarting with reloader" message
2. Make sure you saved a `.py` file, not just JSON
3. Check there are no Python syntax errors
4. Try manual restart: Stop and run `python run_dev.py` again

---

## 📋 Workflow Example

1. **Start Servers:**
   ```bash
   dev-start.bat
   ```

2. **Frontend Changes (e.g., update AdminDashboard):**
   - Edit `src/app/components/admin-dashboard.tsx`
   - Save file (Ctrl+S)
   - Check terminal for HMR message
   - Browser updates automatically in ~100ms
   - No refresh needed, state preserved

3. **Backend Changes (e.g., update announcement route):**
   - Edit `backend/routes/announcements.py`
   - Save file (Ctrl+S)
   - Check terminal for "Restarting with reloader"
   - Frontend API calls now hit updated backend
   - Check browser console for new errors

4. **Database Changes:**
   - Edit `backend/models/announcement.py`
   - Save file
   - Backend restarts
   - New model methods available to routes

---

## 🎯 Key Directories to Watch

### Frontend (Auto-reloaded):
- `src/app/components/` - UI components
- `src/services/` - API calls
- `src/styles/` - CSS files
- `src/main.tsx` - Entry point

### Backend (Auto-reloaded):
- `backend/routes/` - API endpoints
- `backend/models/` - Database models
- `backend/middleware/` - Auth, CORS, etc
- `backend/app.py` - Flask app config

---

## 🔐 Security Notes

⚠️ **Development Only:**
- JWT_SECRET should be changed in production
- Debug mode is enabled (don't expose in production)
- CORS allows localhost only (in development)
- Auto-reload should be disabled in production

---

## ✅ Verification Checklist

- [ ] Both servers start without errors
- [ ] Frontend loads at http://localhost:5173 (or 5174+)
- [ ] Backend responds at http://127.0.0.1:5000/api/announcements
- [ ] Changes to `.tsx` files auto-reload in browser
- [ ] Changes to `.py` files restart backend
- [ ] API calls from frontend reach backend
- [ ] Browser DevTools shows HMR messages
- [ ] Backend terminal shows "Restarting with reloader"

---

## 🚀 Production Deployment Notes

When deploying to production:
1. Use `npm run build` to create optimized frontend build
2. Use `backend/run_server.py` with `debug=False`
3. Disable auto-reload: `use_reloader=False`
4. Set `FLASK_ENV=production`
5. Use proper secrets management
6. Enable CSRF protection
7. Configure CORS properly

---

**Happy Coding! 🎉**

If you have issues, check the terminal output carefully - it usually shows exactly what went wrong.

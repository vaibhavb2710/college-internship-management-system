#!/usr/bin/env python
"""
Development server runner with Flask's auto-reload enabled.
Watches for file changes and automatically restarts the server.
"""
from app import create_app
import os

if __name__ == '__main__':
    os.environ['FLASK_ENV'] = 'development'
    
    app = create_app('development')
    host = app.config['FLASK_HOST']
    port = app.config['FLASK_PORT']
    
    print("\n" + "="*70)
    print("🚀 DEVELOPMENT SERVER STARTING")
    print("="*70)
    print(f"📍 Backend API: http://127.0.0.1:{port}")
    print(f"🔄 Auto-reload enabled - changes will restart the server")
    print(f"⚠️  Do NOT change FLASK_HOST, it should be 0.0.0.0 for development")
    print("💡 Press CTRL+C to stop")
    print("="*70 + "\n")
    
    # Run with debug=True for auto-reload
    app.run(
        host='127.0.0.1',  # Use 127.0.0.1 for local development (Windows compatibility)
        port=port,
        debug=True,
        use_reloader=True,
        use_debugger=True
    )

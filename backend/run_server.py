#!/usr/bin/env python
"""
Production-ready server runner using werkzeug's make_server
instead of Flask's development server.
"""
from app import create_app
from werkzeug.serving import make_server
import sys

if __name__ == '__main__':
    app = create_app()
    host = app.config['FLASK_HOST']
    port = app.config['FLASK_PORT']
    
    print(f'Starting server on {host}:{port}')
    print(f'Press CTRL+C to stop')
    
    server = make_server(host, port, app)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down...')
        server.shutdown()
        sys.exit(0)

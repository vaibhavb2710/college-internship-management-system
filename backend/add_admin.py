
"""
Script to add an admin user to the database.
Run: python add_admin.py
"""

from app import create_app
from models.user import User
import sys


def add_admin_user():
    """Create an admin user."""
    app = create_app()

    with app.app_context():
        try:
            admin_email = "admin@vit.edu.in"
            existing_admin = User.find_by_email(admin_email)

            if existing_admin:
                print(f"[INFO] Admin user with email '{admin_email}' already exists")
                print(f"Email: {admin_email}")
                print("Password: admin123")
                return

            print("Creating admin user...")
            User.create(
                email=admin_email,
                password="admin123",
                first_name="Admin",
                last_name="User",
                role="admin",
            )

            print("\n" + "=" * 50)
            print("[OK] Admin user created successfully")
            print("=" * 50)
            print(f"Email: {admin_email}")
            print("Password: admin123")
            print("=" * 50)
            print("\nYou can now login with these credentials.")

        except Exception as error:
            print(f"[ERROR] Error creating admin user: {error}")
            sys.exit(1)


if __name__ == "__main__":
    add_admin_user()

"""
Seed script to populate initial data into MongoDB.
Run: python seed_data.py
"""

from app import create_app, mongo
from models.announcement import Announcement
from models.company import Company
from models.coordinator import Coordinator
from models.internship import Internship
from models.student import Student
from models.user import User
import sys


COORDINATORS_DATA = [
    {
        "department": "CMPN",
        "email": "cmpn.coordinator@vit.edu.in",
        "password": "cmpn123",
        "first_name": "Aarav",
        "last_name": "Patil",
    },
    {
        "department": "INFT",
        "email": "coordinator@vit.edu.in",
        "password": "coordinator123",
        "first_name": "Rajesh",
        "last_name": "Kumar",
    },
    {
        "department": "EXTC",
        "email": "extc.coordinator@vit.edu.in",
        "password": "extc123",
        "first_name": "Sneha",
        "last_name": "More",
    },
    {
        "department": "EXCS",
        "email": "excs.coordinator@vit.edu.in",
        "password": "excs123",
        "first_name": "Nikhil",
        "last_name": "Sawant",
    },
    {
        "department": "BIOMED",
        "email": "biomed.coordinator@vit.edu.in",
        "password": "biomed123",
        "first_name": "Maya",
        "last_name": "Joshi",
    },
]


STUDENTS_DATA = [
    {
        "email": "rahul.sharma@vit.edu.in",
        "first_name": "Rahul",
        "last_name": "Sharma",
        "roll_number": "2021CMPN001",
        "branch": "CMPN",
        "year": "Third Year",
        "skills": ["Java", "DSA", "React", "SQL"],
    },
    {
        "email": "priya.sharma@vit.edu.in",
        "first_name": "Priya",
        "last_name": "Sharma",
        "roll_number": "2021INFT002",
        "branch": "INFT",
        "year": "Third Year",
        "skills": ["Node.js", "MongoDB", "Python", "AWS"],
    },
    {
        "email": "anjali.desai@vit.edu.in",
        "first_name": "Anjali",
        "last_name": "Desai",
        "roll_number": "2021EXTC003",
        "branch": "EXTC",
        "year": "Final Year",
        "skills": ["Embedded C", "IoT", "MATLAB", "PCB Design"],
    },
    {
        "email": "rohan.kale@vit.edu.in",
        "first_name": "Rohan",
        "last_name": "Kale",
        "roll_number": "2021EXCS004",
        "branch": "EXCS",
        "year": "Final Year",
        "skills": ["Cybersecurity", "Linux", "Network Security", "Python"],
    },
    {
        "email": "neha.iyer@vit.edu.in",
        "first_name": "Neha",
        "last_name": "Iyer",
        "roll_number": "2021BIOMED005",
        "branch": "BIOMED",
        "year": "Third Year",
        "skills": ["Biomedical Signals", "Medical Imaging", "Python", "Data Analysis"],
    },
]


COMPANIES_DATA = [
    {
        "name": "Infosys Limited",
        "email": "infosys@infosys.com",
        "industry": "IT Services",
        "location": "Pune, Maharashtra",
    },
    {
        "name": "Tata Consultancy Services",
        "email": "tcs@tcs.com",
        "industry": "IT Services",
        "location": "Mumbai, Maharashtra",
    },
    {
        "name": "Google India",
        "email": "careers@google.com",
        "industry": "Technology",
        "location": "Bengaluru, Karnataka",
    },
    {
        "name": "Larsen and Toubro",
        "email": "careers@lnt.com",
        "industry": "Engineering",
        "location": "Mumbai, Maharashtra",
    },
    {
        "name": "Siemens Healthineers",
        "email": "careers@siemens-healthineers.com",
        "industry": "Healthcare Technology",
        "location": "Mumbai, Maharashtra",
    },
]


def seed_database():
    """Populate database with initial data."""
    app = create_app()

    with app.app_context():
        try:
            print("Clearing existing data...")
            mongo.db.users.delete_many({})
            mongo.db.students.delete_many({})
            mongo.db.companies.delete_many({})
            mongo.db.internships.delete_many({})
            mongo.db.announcements.delete_many({})
            mongo.db.coordinators.delete_many({})

            print("Creating admin user...")
            admin_user_id = User.create(
                email="admin@vit.edu.in",
                password="admin123",
                first_name="Institute",
                last_name="Admin",
                role="admin",
            )
            print(f"[OK] Admin created: {admin_user_id}")

            print("Creating department coordinators...")
            coordinator_user_ids = {}
            for coordinator in COORDINATORS_DATA:
                coordinator_user_id = User.create(
                    email=coordinator["email"],
                    password=coordinator["password"],
                    first_name=coordinator["first_name"],
                    last_name=coordinator["last_name"],
                    role="coordinator",
                )
                Coordinator.create(
                    user_id=coordinator_user_id,
                    department=coordinator["department"],
                )
                coordinator_user_ids[coordinator["department"]] = coordinator_user_id
                print(
                    f"[OK] Coordinator created for {coordinator['department']}: "
                    f"{coordinator['email']}"
                )

            print("Creating students...")
            student_ids = []
            for student in STUDENTS_DATA:
                student_user_id = User.create(
                    email=student["email"],
                    password="student123",
                    first_name=student["first_name"],
                    last_name=student["last_name"],
                    role="student",
                )
                student_id = Student.create(
                    user_id=student_user_id,
                    roll_number=student["roll_number"],
                    branch=student["branch"],
                    year=student["year"],
                    skills=student["skills"],
                )
                student_ids.append(student_id)
                print(f"[OK] Student created: {student['first_name']} ({student['branch']})")

            print("Creating companies...")
            company_ids = []
            for company in COMPANIES_DATA:
                company_id = Company.create(
                    name=company["name"],
                    email=company["email"],
                    industry=company["industry"],
                    location=company["location"],
                )
                company_ids.append(company_id)
                print(f"[OK] Company created: {company['name']}")

            print("Creating internships...")
            internships_data = [
                {
                    "company_id": company_ids[0],
                    "role": "Software Development Intern",
                    "description": "Work on enterprise web applications and backend APIs.",
                    "eligibility": [
                        "Third or Final year students",
                        "CGPA 7.0+",
                        "Strong DSA basics",
                    ],
                    "duration": "2 Months",
                    "stipend": "INR 21000/month",
                    "mode": "In-office",
                    "location": "Pune, Maharashtra",
                    "skills_required": ["Java", "Python", "SQL"],
                },
                {
                    "company_id": company_ids[1],
                    "role": "Data Analytics Intern",
                    "description": "Build dashboards and run business analytics workflows.",
                    "eligibility": [
                        "Computer/IT branches",
                        "Python and SQL knowledge",
                        "Statistics fundamentals",
                    ],
                    "duration": "3 Months",
                    "stipend": "INR 25000/month",
                    "mode": "Hybrid",
                    "location": "Mumbai, Maharashtra",
                    "skills_required": ["Python", "SQL", "Power BI"],
                },
                {
                    "company_id": company_ids[2],
                    "role": "Full Stack Developer Intern",
                    "description": "Develop scalable web features across frontend and backend.",
                    "eligibility": [
                        "Third or Final year students",
                        "React and Node.js experience",
                        "Problem solving skills",
                    ],
                    "duration": "10 Weeks",
                    "stipend": "INR 30000/month",
                    "mode": "Remote",
                    "location": "Bengaluru, Karnataka",
                    "skills_required": ["React", "Node.js", "MongoDB"],
                },
                {
                    "company_id": company_ids[3],
                    "role": "Embedded Systems Intern",
                    "description": "Contribute to controller firmware and hardware validation.",
                    "eligibility": [
                        "EXTC/EXCS students preferred",
                        "Microcontroller basics",
                        "Digital electronics knowledge",
                    ],
                    "duration": "2 Months",
                    "stipend": "INR 22000/month",
                    "mode": "In-office",
                    "location": "Mumbai, Maharashtra",
                    "skills_required": ["Embedded C", "Electronics", "Testing"],
                },
                {
                    "company_id": company_ids[4],
                    "role": "Biomedical Engineering Intern",
                    "description": "Support medical device testing and biomedical signal analysis.",
                    "eligibility": [
                        "BIOMED students preferred",
                        "Biomedical instrumentation basics",
                        "Documentation and reporting skills",
                    ],
                    "duration": "8 Weeks",
                    "stipend": "INR 20000/month",
                    "mode": "Hybrid",
                    "location": "Mumbai, Maharashtra",
                    "skills_required": ["Biomedical Signals", "Python", "Documentation"],
                },
            ]

            internship_ids = []
            for internship in internships_data:
                internship_id = Internship.create(**internship)
                internship_ids.append(internship_id)
                print(f"[OK] Internship created: {internship['role']}")

            print("Creating announcements...")
            announcements_data = [
                {
                    "title": "Summer Internship Drive 2026",
                    "content": (
                        "Registration is now open for Summer 2026 internships. "
                        "All students should apply before the deadline."
                    ),
                    "sender_id": admin_user_id,
                    "sender_name": "Institute Admin",
                    "priority": "high",
                    "target_role": ["student"],
                    "target_type": "institute",
                    "target_departments": [],
                },
                {
                    "title": "CMPN Internship Opportunity",
                    "content": "CMPN students can apply for software roles from partner companies.",
                    "sender_id": coordinator_user_ids["CMPN"],
                    "sender_name": "CMPN Coordinator",
                    "priority": "medium",
                    "target_role": ["student"],
                    "target_type": "department",
                    "target_departments": ["CMPN"],
                },
                {
                    "title": "INFT Internship Opportunity",
                    "content": "INFT students can apply for data and full-stack opportunities.",
                    "sender_id": coordinator_user_ids["INFT"],
                    "sender_name": "INFT Coordinator",
                    "priority": "medium",
                    "target_role": ["student"],
                    "target_type": "department",
                    "target_departments": ["INFT"],
                },
            ]

            for announcement in announcements_data:
                Announcement.create(**announcement)
                print(f"[OK] Announcement created: {announcement['title']}")

            print("\nDatabase seeding completed successfully.")
            print(f"Created {len(COORDINATORS_DATA)} coordinators")
            print(f"Created {len(student_ids)} students")
            print(f"Created {len(company_ids)} companies")
            print(f"Created {len(internship_ids)} internships")
            print(f"Created {len(announcements_data)} announcements")

            print("\nCoordinator login credentials:")
            for coordinator in COORDINATORS_DATA:
                print(
                    f"- {coordinator['department']}: "
                    f"{coordinator['email']} / {coordinator['password']}"
                )

        except Exception as error:
            print(f"Error seeding database: {error}")
            sys.exit(1)


if __name__ == "__main__":
    seed_database()

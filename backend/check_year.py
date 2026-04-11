from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['internship_management']

# List students with year field
students = list(db.students.find({}, {'roll_number': 1, 'year': 1, '_id': 0}))
print('Current Students:')
for s in students:
    print(f"  Roll {s.get('roll_number')}: Year = {s.get('year')}")

print(f"\nTotal students: {len(students)}")

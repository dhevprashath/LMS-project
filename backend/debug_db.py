
from sqlalchemy import create_engine, text
import os

# Adjust path to your database
db_path = "sqlite:///c:/Users/Dhev prashath/OneDrive/Desktop/projects/lsm-project/backend/lms.db"

try:
    engine = create_engine(db_path)
    with engine.connect() as connection:
        # Check users
        print("--- USERS ---")
        result = connection.execute(text("SELECT id, email, fullname FROM users"))
        for row in result:
            print(row)

        # Check certificates
        print("\n--- CERTIFICATES ---")
        result = connection.execute(text("SELECT * FROM certificates"))
        certs = list(result)
        if not certs:
            print("No certificates found in the database.")
        else:
            for row in certs:
                print(row)

        # Check user 3 specifically
        print("\n--- CERTIFICATES FOR USER 3 ---")
        result = connection.execute(text("SELECT * FROM certificates WHERE user_id = 3"))
        user_certs = list(result)
        if not user_certs:
            print("No certificates found for user 3.")
        else:
            for row in user_certs:
                print(row)

except Exception as e:
    print(f"Error: {e}")

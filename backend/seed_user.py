import asyncio
from database import user_collection
from auth_utils import get_password_hash
import os

async def seed_user():
    print("Attempting to connect to MongoDB...")
    try:
        # Check if user exists
        existing_user = await user_collection.find_one({"email": "demo@example.com"})
        if existing_user:
            print("User 'demo@example.com' already exists.")
            return

        user = {
            "fullname": "Demo Student",
            "email": "demo@example.com",
            "password": get_password_hash("password123"),
            "role": "student"
        }
        
        await user_collection.insert_one(user)
        print("Successfully created dummy user:")
        print("Email: demo@example.com")
        print("Password: password123")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        import traceback
        traceback.print_exc()
        print("Please ensure MongoDB is running locally on port 27017.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_user())

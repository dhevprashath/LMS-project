import asyncio
import motor.motor_asyncio
import os

async def ping_server():
    uri = "mongodb://127.0.0.1:27017"
    client = motor.motor_asyncio.AsyncIOMotorClient(uri)
    try:
        await client.admin.command('ping')
        print("SUCCESS: Connected to MongoDB!")
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(ping_server())

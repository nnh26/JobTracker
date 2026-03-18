import asyncio
from database import engine

async def test_connection():
    try:
        async with engine.connect() as conn:
            print("Database connected successfully!")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
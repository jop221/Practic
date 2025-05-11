import logging
from passlib.context import CryptContext
from jose import jwt
from fastapi import HTTPException
from ..models import UserCreate, UserLogin
from ..database import database
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET", "your_jwt_secret")
ALGORITHM = "HS256"

logger = logging.getLogger("auth")
logging.basicConfig(level=logging.INFO)

async def get_user_by_username(username: str):
    try:
        query = "SELECT * FROM users WHERE username = :username"
        user = await database.fetch_one(query=query, values={"username": username})
        return user
    except Exception as e:
        logger.error(f"Error fetching user by username {username}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def create_user(user: UserCreate):
    try:
        hashed_password = pwd_context.hash(user.password)
        query = """
        INSERT INTO users (username, email, password, phone)
        VALUES (:username, :email, :password, :phone)
        RETURNING id, username, email, phone
        """
        values = {
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
            "phone": user.phone
        }
        user_row = await database.fetch_one(query=query, values=values)
        return user_row["id"] if user_row else None
    except Exception as e:
        logger.error(f"Error creating user {user.username}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def register_user(user: UserCreate):
    existing_user = await get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")
    user_id = await create_user(user)
    token_data = {"user_id": user_id, "username": user.username}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

async def login_user(user: UserLogin):
    db_user = await get_user_by_username(user.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token_data = {"user_id": db_user["id"], "username": db_user["username"]}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

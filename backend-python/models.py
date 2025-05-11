from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserInDB(UserCreate):
    id: int

class UserLogin(BaseModel):
    username: str
    password: str

class TaskBase(BaseModel):
    name: str
    completed: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    user_id: int

class BoardBase(BaseModel):
    title: str

class BoardCreate(BoardBase):
    pass

class Board(BoardBase):
    id: int
    user_id: int

class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    due_date: Optional[str] = None

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int
    board_id: int

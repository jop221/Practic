import uvicorn
from fastapi import FastAPI
from .database import database
from .auth import router as auth_router


app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(auth_router, prefix="/auth", tags=["auth"])




if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

import sys
import os
import pytest
from httpx import AsyncClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app

@pytest.mark.asyncio
async def test_register_and_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Test registration
        response = await ac.post("/auth/register", json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
            "phone": "1234567890"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

        # Test login with correct credentials
        response = await ac.post("/auth/login", json={
            "username": "testuser",
            "password": "testpassword"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

        # Test login with wrong password
        response = await ac.post("/auth/login", json={
            "username": "testuser",
            "password": "wrongpassword"
        })
        assert response.status_code == 401

        # Test registration with existing username
        response = await ac.post("/auth/register", json={
            "username": "testuser",
            "email": "testuser2@example.com",
            "password": "testpassword",
            "phone": "1234567890"
        })
        assert response.status_code == 409
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Username already exists"
# app/api/auth.py
from werkzeug.security import generate_password_hash, check_password_hash
from app.core.db import db
from app.core.models import User

# Register a user
def register_user(username, password):
    """Save new user in the database if not already registered."""
    existing = User.query.filter_by(username=username).first()
    if existing:
        return {"message": "Username already exists."}

    hashed = generate_password_hash(password)
    new_user = User(username=username, password=hashed)
    db.session.add(new_user)
    db.session.commit()
    return {"message": "User registered successfully."}

# Login a user
def login_user(username, password):
    """Check if user exists and password matches."""
    user = User.query.filter_by(username=username).first()
    if not user:
        return {"message": "User not found."}

    if check_password_hash(user.password, password):
        return {"message": f"Welcome back, {username}!"}
    else:
        return {"message": "Incorrect password."}
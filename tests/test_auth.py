# tests/test_auth.py
from flask import Flask
from app.core.db import db
from app.core.models import User
from app.api.auth import register_user, login_user

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()  # create User table

    print(register_user("shamila", "1234"))
    print(login_user("shamila", "1234"))
    print(login_user("shamila", "wrongpass"))
    print(register_user("shamila", "1234"))

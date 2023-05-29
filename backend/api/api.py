from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

import os

from .functions.users import users


def api():
    # Use a service account.
    cred = credentials.Certificate("backend/api/serviceAccount.json")
    firebase_app = firebase_admin.initialize_app(cred)

    app = Flask(__name__)
    app.register_blueprint(users, url_prefix="/users")

    return app

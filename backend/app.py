from api import api
from flask import Flask
from flask_cors import CORS

from api.functions import users, token, messages

from flask import Flask, Blueprint, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

# app = api()
app = Flask(__name__)
CORS(app)
# app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(token, url_prefix="/token")
app.register_blueprint(messages, url_prefix="/messages")

cred = credentials.Certificate("serviceAccount.json")
firebase_app = firebase_admin.initialize_app(cred)


if __name__ == "__main__":
    app.run(port=8000, debug=True)



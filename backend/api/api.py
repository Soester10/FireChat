from flask import Flask, Blueprint, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

import os
from dotenv import load_dotenv
import subprocess
import ast
import base64

from .functions import users, token

load_dotenv()

api = Blueprint("api", __name__)

api.register_blueprint(users, url_prefix="/users")
api.register_blueprint(token, url_prefix="/token")


@api.route("/", methods=["GET"])
def get_api():
    cred = credentials.Certificate("serviceAccount.json")
    firebase_app = firebase_admin.initialize_app(cred)

    return jsonify({"Result": "Api Initialized!"})

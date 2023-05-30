from flask import Blueprint, jsonify, request
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth


token = Blueprint("token", __name__)

@token.route("/", methods=["GET"])
def get_token():
    db = firestore.client()
    uid = request.args.get('uid')   #127.0.0.1:5000/token?uid=abc

    custom_token = auth.create_custom_token(uid)

    return jsonify({'token': custom_token.decode('UTF-8')})
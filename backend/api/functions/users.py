from flask import Blueprint, jsonify
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

users = Blueprint("users", __name__)


@users.route("/get-all", methods=["GET"])
def get_users_list():
    db = firestore.client()

    page = auth.list_users()

    # users_ref = db.collection('messages').stream()
    # for user in users_ref:
    #     print(f'{user.id} => {user.to_dict()}')

    users_json = {}

    while page:
        for user in page.users:
            users_json[user.uid] = user.display_name
        # Get next batch of users.
        page = page.get_next_page()

    return jsonify(users_json)

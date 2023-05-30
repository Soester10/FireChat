from flask import Blueprint, jsonify, request
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

    id_token = request.args.get('token')    #127.0.0.1:5000/users/get-all?token=abc

    try:
        decoded_token = auth.verify_id_token(id_token)
    except:
        return jsonify({'Result': 'Error!'})
    
    uid = decoded_token['uid']

    users_json = {}

    while page:
        for user in page.users:
            users_json[user.uid] = user.display_name
        # Get next batch of users.
        page = page.get_next_page()

    return jsonify(users_json)


##FOR TESTING, TODO:remove later
@users.route("/test", methods=["GET"])
def test():
    db = firestore.client()
    mes_ref = db.collection('messages').stream()
    mess = [mes.to_dict() for mes in mes_ref]

    return jsonify(mess)

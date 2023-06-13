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

    id_token = request.args.get("token")  # 127.0.0.1:5000/users/get-all?token=abc

    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
    except:
        # return jsonify({"Result": "Error!"})
        ## for testing
        uid = "test"
        pass

    # uid = decoded_token["uid"]

    users_json = []

    while page:
        for user in page.users:
            user_json = {}
            user_json["name"] = user.display_name
            user_json["uid"] = user.uid
            users_json.append(user_json)
        # Get next batch of users.
        page = page.get_next_page()
    
    users_json.append({'name': uid})

    return jsonify(users_json)


##FOR TESTING, TODO:remove later
@users.route("/test", methods=["GET"])
def test():
    db = firestore.client()
    mes_ref = db.collection("messages").stream()
    mess = [mes.to_dict() for mes in mes_ref]

    return jsonify(mess)

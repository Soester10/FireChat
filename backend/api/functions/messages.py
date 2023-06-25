from flask import Blueprint, jsonify, request
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

messages = Blueprint("messages", __name__)

@messages.route("/", methods=["GET"])
def get_messages():
    db = firestore.client()

    num_msgs_to_load = 5

    ##page_no starts from 0
    page_no = int(request.args.get("page"))  # 127.0.0.1:5000/messages?page=0
    ##TODO: Fix for recipient
    recipient = request.args.get("recipient")  # 127.0.0.1:5000/messages?page=0&recipient=abc

    ##TODO: need to get uid from token
    uid = ""

    if recipient:
        mes_ref = db.collection("messages").where("uid", "==", str(uid)).where("recipient", "==", str(recipient))
        # mes_query = mes_ref.order_by("timestamp").limit(num_msgs_to_load)
        # msgs = mes_query.stream()
        # msgs = [msg.to_dict() for msg in msgs]
        # return jsonify(msgs) 
    else:
        mes_ref = db.collection("messages")

    ##TODO: need to have message id instead of timestamp for querying
    ## cuz desending is not possible. Check this out:
    ## https://stackoverflow.com/questions/45357920/sorting-in-descending-order-in-firebase-database

    if not page_no:
        mes_query = mes_ref.order_by("timestamp").limit(num_msgs_to_load)
        msgs = mes_query.stream()
        msgs = [msg.to_dict() for msg in msgs]

        return jsonify(msgs)

    mes_query = mes_ref.order_by("timestamp").limit(num_msgs_to_load * page_no)
    msgs = mes_query.stream()
    last_msg = list(msgs)[-1]
    last_msg = last_msg.to_dict()["timestamp"]

    mes_query = mes_ref.order_by("timestamp").start_after({"timestamp": last_msg}).limit(num_msgs_to_load)
    msgs = mes_query.stream()
    msgs = [msg.to_dict() for msg in msgs]

    return jsonify(msgs)
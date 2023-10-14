from flask import Blueprint, jsonify, request
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

from google.cloud.firestore_v1.base_query import FieldFilter, Or, And

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
    uid = "GJsonSMA3ORkmXJprWVRmuclmbs2"

    if recipient:
        # from uid to recipient
        filter_1 = FieldFilter("uid", "==", str(uid))
        filter_2 = FieldFilter("recipient", "==", str(recipient))

        uid_to_recipient = And(filters=[filter_1, filter_2])

        # what uid has recieved from recipient
        filter_1 = FieldFilter("uid", "==", str(recipient))
        filter_2 = FieldFilter("recipient", "==", str(uid))

        recipient_to_uid = And(filters=[filter_1, filter_2])

        ## Final filter
        final_filter = Or(filters=[uid_to_recipient, recipient_to_uid])

        mes_ref = db.collection("messages")#.where("uid", "==", str(uid)).where("recipient", "==", str(recipient))

        mes_ref = mes_ref.where(filter=final_filter)

        ##TODO:Delete
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
        mes_query = mes_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(num_msgs_to_load)
        # mes_query = mes_query.order_by("timestamp", direction=firestore.Query.ASCENDING)
        msgs = mes_query.stream()
        msgs = [msg.to_dict() for msg in msgs]

        return jsonify(msgs)

    mes_query = mes_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(num_msgs_to_load * page_no)
    msgs = mes_query.stream()
    last_msg = list(msgs)[-1]
    last_msg = last_msg.to_dict()["timestamp"]

    mes_query = mes_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).start_after({"timestamp": last_msg}).limit(num_msgs_to_load)
    msgs = mes_query.stream()
    msgs = [msg.to_dict() for msg in msgs]

    return jsonify(msgs)
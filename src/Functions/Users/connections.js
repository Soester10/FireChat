import { getFirestore, orderBy } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, limit, or, and } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import { Link, useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';


function Connections(props){
    const auth = getAuth();
    const [user] = useAuthState(auth)
    // console.log("peach:", props);
    if (user){
        return (
            <div className="App">
            <header className="App-header">
            <section>
                <Chat target={props.target} user={user} db={props.db}/>
            </section>
            </header>
            </div>
        )
    }
    else {
        return(<ListLoading user={user}/>)
    }
}



function Chat(props){
    // Private Chat Room with 2 users

    // const auth = getAuth();
    // const { uid, displayName } = auth.currentUser;

    const location = useLocation();
    const userData = location.state;

    const messagesRef = collection(props.db, 'messages');
    console.log("user", props.user.uid);
    console.log("target", userData.target);
    // const messages_ = query(messagesRef, or(and(where("recipient", "==", props.user.uid), where("uid", "==", userData.target)), and(where("recipient", "==", userData.target), where("uid", "==", props.user.uid))), orderBy('timestamp'), limit(25));
    const messages_ = query(messagesRef, or(and(where("recipient", "==", props.user.uid), where("uid", "==", userData.target)), and(where("recipient", "==", userData.target), where("uid", "==", props.user.uid))));
    // messages_ = messages

    const [messages] = useCollectionData(messages_, { idField: 'id' });

    console.log(messages);

    const [formValue, setFormValue] = useState('');

    const dummy = useRef();


    const sendMessage = async (e) => {
        e.preventDefault();

        // implement photoURL later
        // const { uid, photoURL } = auth.currentUser;

        // const uid = props.user.uid;
        // const displayName = props.user.displayName;

        const { uid, displayName } = props.user;


        await addDoc(messagesRef, {
        text: formValue,
        timestamp: serverTimestamp(),
        uid,
        username: displayName,
        recipient: userData.target,
        // photoURL
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    // console.log("here");

    return (<>
        <div className="App">
        <header className="App-header">
        <section>
        <main>

        {messages && messages.map(msg => <PrivateChatMessage key={msg.id} message={msg} db={props.db} user={props.user} />)}

        <span ref={dummy}></span>

        </main>

        <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="input" />

        <button type="submit" disabled={!formValue}>🕊️</button>

        </form>
        </section>
        </header>
        </div>
    </>)
}



function ListLoading(props){
    return (
        <div className="App">
        <header className="App-header">
        <section>
            <p>Loading ...</p>
        </section>
        </header>
        </div>
    )
}



function PrivateChatMessage(props){
    const {uid, text, username} = props.message;

    const messageClass = uid === props.user.uid ? 'sent' : 'received';

    // const usernameRef = collection(props.db, 'users');
    // const username = query(usernameRef, where('uid', '==', {uid})).data();
    // const usernameRef = doc(props.db, "users", uid);
    // const username = getDoc(usernameRef);

    // if (username.exists())

    return (<>
        <div className={`message ${messageClass}`} key={props.key}>
            
            <p>{username} : {text}</p>
        </div>
    </>)

}

export {Connections, Chat};

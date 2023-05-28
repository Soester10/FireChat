import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

import React, { useRef, useState } from 'react';


function MyChatRooms(){
    // Yet to be implemented
    // Get user's connections (Friends for 1-1, groups for 1-many)
}

function PublicChatRoom(props){
    // Public Chat Romm that anyone who's logged in can join 
    // and participate

    const messagesRef = collection(props.db, 'messages');
    const messages_ = query(messagesRef, orderBy('timestamp'), limit(25));

    const [messages] = useCollectionData(messages_, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const dummy = useRef();


    const sendMessage = async (e) => {
        e.preventDefault();

        // implement photoURL later
        // const { uid, photoURL } = auth.currentUser;

        const { uid, displayName } = props.auth.currentUser;

        await addDoc(messagesRef, {
        text: formValue,
        timestamp: serverTimestamp(),
        uid,
        username: displayName,
        // photoURL
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
        <main>

        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} db={props.db} auth={props.auth} />)}

        <span ref={dummy}></span>

        </main>

        <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="input" />

        <button type="submit" disabled={!formValue}>🕊️</button>

        </form>
    </>)

}


function ChatMessage(props){
    const {uid, text, username} = props.message;

    const messageClass = uid === props.auth.currentUser.uid ? 'sent' : 'received';

    // const usernameRef = collection(props.db, 'users');
    // const username = query(usernameRef, where('uid', '==', {uid})).data();
    // const usernameRef = doc(props.db, "users", uid);
    // const username = getDoc(usernameRef);

    // if (username.exists())

    return (<>
        <div className={`message ${messageClass}`}>
            
            <p>{username} : {text}</p>
        </div>
    </>)

}

export {MyChatRooms, PublicChatRoom};

import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

import React, { useRef, useState, useCallback, useEffect } from 'react';

import useFetchMessages from "./messages"


function MyChatRooms(){
    // Yet to be implemented
    // Get user's connections (Friends for 1-1, groups for 1-many)
}

function PublicChatRoom(props){
    return (
        <Link to="/public-chat">Public Chat Room</Link>
    )
}

function ChatRoom(props){
    // Public Chat Romm that anyone who's logged in can join 
    // and participate

    const [pageNumber, setPageNumber] = useState(0);
    const [newMessage, setNewMessage] = useState(false);
    const recipient = '';
    
    const {
        messages,
        hasMore,
        loading,
    } = useFetchMessages(pageNumber, newMessage, recipient);

    const observer = useRef()
    const lastMsgElementRef = useCallback(node => {
        if (loading) return(<ListLoading />)
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const messagesRef = collection(props.db, 'messages');
    // const messages_ = query(messagesRef, orderBy('timestamp'), limit(25));

    // const [messages] = useCollectionData(messages_, { idField: 'id' });

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
        setPageNumber(0);
        setNewMessage(oldMessage => !oldMessage);

        // messages, hasMore, loading = useFetchMessages(pageNumber);

        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    // if(loading){
    //     return(<ListLoading />)
    // }

    return (<>
        <div className="App">
        <header className="App-header">
        <section>
        <main>

        {/* {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} db={props.db} auth={props.auth} />)} */}
        {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} auth={props.auth} index={index} length={messages.length} lastMsgElementRef={lastMsgElementRef} />)}


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


function ChatMessage(props){
    // const {uid, text, username, timestamp} = props.message;
    const split_placeholder = process.env.REACT_APP_MSG_SPLIT_THINGY;
    
    const message = props.message.split(split_placeholder);
    const text = message[0];
    const timestamp = message[1];
    const uid = message[2];
    const username = message[3];

    const messageClass = uid === props.auth.currentUser.uid ? 'sent' : 'received';

    // const usernameRef = collection(props.db, 'users');
    // const username = query(usernameRef, where('uid', '==', {uid})).data();
    // const usernameRef = doc(props.db, "users", uid);
    // const username = getDoc(usernameRef);

    // if (username.exists())

    if (props.length-1 === props.index){
        return (<>
            <div ref={props.lastMsgElementRef} className={`message ${messageClass}`}>
                <p>{username} : {text}</p>
            </div>
        </>)
    }

    else{
        return (<>
            <div className={`message ${messageClass}`}>
                <p>{username} : {text}</p>
            </div>
        </>)
    }

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

export {MyChatRooms, PublicChatRoom, ChatRoom};

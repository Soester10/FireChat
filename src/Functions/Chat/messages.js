import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

import React, { useRef, useState, useEffect } from 'react';


function useFetchMessages(pageNumber, newMessage){
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    const split_placeholder = process.env.REACT_APP_MSG_SPLIT_THINGY;

    useEffect(() => {
        setLoading(true);
        console.log("inside");
        // TODO:refer this for async call with token from jwt: https://devtrium.com/posts/async-functions-useeffect
        // const token = await props.user.getIdToken();

        // fetch("http://firechat-api.us-east-1.elasticbeanstalk.com/users/get-all?token=" + token)
        fetch("http://127.0.0.1:5000/messages/?page=" + pageNumber)
            .then((response) => response.json())
            .then((result) => {
                // setUsers(result);
                
                // TODO: Fix later, Strict model in index.js
                // OG
                // setMessages(prevMsgs => {
                //     return [...new Set([...prevMsgs, ...result])]
                // })

                // List Atempt
                // setMessages(prevMsgs => {
                //     return [...new Set([...prevMsgs, ...result.map(msg => {
                //         return [
                //             msg.text,
                //             msg.timestamp,
                //             msg.uid,
                //             msg.username
                //             ]
                //     })])]
                // })

                setMessages(prevMsgs => {
                    return [...new Set([...prevMsgs, ...result.map(msg => {
                        return (msg.text + split_placeholder + msg.timestamp + split_placeholder + msg.uid + split_placeholder + msg.username)
                    })])]
                })

                setHasMore(result.length === 5);
                setLoading(false);
            });
    }, [pageNumber, newMessage]);

    // console.log(messages);

    return { loading, messages, hasMore }
}


export default useFetchMessages;
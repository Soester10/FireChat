import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

import React, { useRef, useState, useEffect } from 'react';


function GetUsers(props){
    return (
        <Link to="/users">Users</Link>
    )
}

// function Users(props){
//     // const [token, setToken] = useState('');
//     const [users, setUsers] = useState([]);

//     const auth = getAuth();
//     const [user_] = useAuthState(auth)

//     // var user_ = props.user_;

//     // console.log(user_);
    
//     onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log("invoked!");
//         const user_ = user;
//     } else {
//         const user_ = props.user;
//     }
//     });


//     // const fetchToken = () => {
//     //     fetch("http://firechat-api.us-east-1.elasticbeanstalk.com/token?uid=" + props.auth.currentUser.uid)
//     //         .then((response) => response.json())
//     //         .then((result) => {
//     //             setToken(result.token);
//     //         });

//     // }

//     // const fetchToken = () => {
//         // if (user){
//             // props.auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
//             //     setToken(idToken);
//             //     console.log(token);
//             // })
//             // setToken(user_.getIdToken());
//             // console.log(token);

//         //     fetch("http://127.0.0.1:5000/token?uid=" + props.auth.currentUser.uid)
//         //         .then((response) => response.json())
//         //         .then((result) => {
//         //             setToken(result.token);
//         //             console.log(result);
//         //         });
//         // }
//         // console.log(user.displayName);
//     // }
        
        
//         // const x = props.auth.currentUser.getIdToken();
//     //     console.log(token);
//     // }

//     const fetchData = async () => {
//         // fetch("http://firechat-api.us-east-1.elasticbeanstalk.com/users/get-all?token=")
//         try{
//         const token = await user_.getIdToken();
//         fetch("http://127.0.0.1:5000/users/get-all?token=" + token)
//             .then((response) => response.json())
//             .then((result) => {
//                 setUsers(result);
//                 console.log("http://127.0.0.1:5000/users/get-all?token=" + user_.getIdToken());
//             });
//         }
//         catch{}

//     }

//     // const [user] = useAuthState(props.auth);
//     // useEffect(() => {
//     //     fetchToken()
//     // }, [])

//     // console.log("http://127.0.0.1:5000/users/get-all?token=" + token);

//     // fetchData();


//     useEffect(() => {
//         fetchData()
//       }, [])

//     // useEffect(() => {
//     //     fetchData()
//     //     }, [])
    
//     return (
//         <div className="App">
//         <header className="App-header">
//         <section>
//             {
//                 users.map((user, id) => DisplayUser(id, user))
//             }
//         </section>
//         </header>
//         </div>
//     )
// }






function Users(props){
    const auth = getAuth();
    const [user] = useAuthState(auth)
    if (user){
        return (
            <div className="App">
            <header className="App-header">
            <section>
                <ListUsers user={user}/>
            </section>
            </header>
            </div>
        )
    }
    else {
        return(<ListLoading user={user}/>)
    }

    // onAuthStateChanged(auth, (user) => {
    // if (user) {
    //     console.log("yes");
    //     return (
    //         <div className="App">
    //         <header className="App-header">
    //         <section>
    //             <ListUsers user={user}/>
    //         </section>
    //         </header>
    //         </div>
    //     )
    // } else {
    //     return(<ListLoading user={user}/>)
    // }
    // });
}


function ListUsers(props){
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try{
        const token = await props.user.getIdToken();
        // fetch("http://127.0.0.1:5000/users/get-all?token=" + token)
        fetch("http://firechat-api.us-east-1.elasticbeanstalk.com/users/get-all?token=" + token)
            .then((response) => response.json())
            .then((result) => {
                setUsers(result);
                // console.log("http://127.0.0.1:5000/users/get-all?token=" + props.user.getIdToken());
            });
        }
        catch{}

    }


    useEffect(() => {
        fetchData()
      }, [])
    
    return (
        <>
        <div>
            {
                users.map((user, id) => DisplayUser(id, user))
            }
        </div>
        </>
    )
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








function DisplayUser(id, user){
    const userData = {
        target: user.uid,
    };

    return (
       <div key={id}>
            {/* <Link to={{ pathname:"/chat", query:{'target':user.uid} }}>{user.name}</Link> */}
            <Link to="/chat" state={userData}>{user.name}</Link>
       </div>
    )
}

export {Users, GetUsers, DisplayUser, ListUsers, ListLoading};
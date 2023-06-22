import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState, useEffect } from 'react';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// import { Routes, Route, Router, Link } from 'react-router-dom';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";

// Function imports
import { MyChatRooms, PublicChatRoom, ChatRoom } from "./Functions/Chat/chat";
import { Users, GetUsers } from "./Functions/Users/users";
import { Connections } from "./Functions/Users/connections"

// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// initialize app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// auth
const auth = getAuth();

// firestore db
const db = getFirestore(app);

// const [user_, setUser_] = useState('');

function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <section>
          <h1> {user ? <Test1 /> : <SignIn />} </h1>
        </section>
      </header>
    </div>
  );
}

function AppRouter() {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/public-chat", element: <ChatRoom db={db} auth={auth} /> },
    {
      path: "/users",
      element: <Users db={db} auth={auth} user_={auth.currentUser} />,
    },
    { path: "/chat", element: <Connections db={db}/> },
  ]);
  return routes;
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
  // return (
  //   <>
  //   <Router>
  //     <Routes>
  //         <Route path="/" element={<Home />} />
  //     </Routes>
  //   </Router>
  //   </>
  // );
}

function SignIn() {
  // sigin function
  const GoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    //     .then((result) => {
    //       // checkout more at https://firebase.google.com/docs/auth/web/google-signin
    //     }).catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;

    //       console.log(errorMessage);
    //     });
  };

  return (
    <>
      <button className="sign-in" onClick={GoogleSignIn}>
        Sign In
      </button>
    </>
  );
}

function Test1() {
  const user = auth.currentUser;
  const displayName = user.displayName;

  // const updateUser = () => {
  //   setUser_(user);
  // }

  // useEffect(() => {
  //   updateUser()
  // }, [])

  return (
    <>
      <p> Hello, {displayName} </p>
      <p>
        {" "}
        <MyChatRooms />{" "}
      </p>
      <p>
        {" "}
        <PublicChatRoom db={db} auth={auth} />{" "}
      </p>
      <p>
        {" "}
        <GetUsers db={db} auth={auth} />{" "}
      </p>
      <p>
        {" "}
        <SignOut />{" "}
      </p>
    </>
  );
}

function SignOut() {
  const user = auth.currentUser;
  return (
    user && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

export default App;

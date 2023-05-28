import logo from './logo.svg';
import './App.css';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Function imports
import { MyChatRooms, PublicChatRoom } from "./Functions/Chat/chat"

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

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <section>
          <h1> {user? <Test1 /> : <SignIn />} </h1>
        </section>
      </header>
    </div>
  );
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
  }

  return (
    <>
      <button className='sign-in' onClick={GoogleSignIn}>Sign In</button>
    </>
  )
}

function Test1(){
  const user = auth.currentUser;
  const displayName = user.displayName;

  return (
    <>
      <p> Hello, {displayName} </p>
      <p> <MyChatRooms /> </p>
      <p> <PublicChatRoom db={db} auth={auth}/> </p>
      <p> <SignOut /> </p>
    </>
  )

}

function SignOut(){
  const user = auth.currentUser;
  return user && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;

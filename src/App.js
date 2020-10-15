import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    Name: '',
    Email: '',
    Photo: '',
  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn =()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
    const {displayName, photoURL, email} = res.user
      console.log(displayName, photoURL, email ,)
      const isSignedIn = {
        isSignIn:true,
        Name: displayName,
        Email: email,
        photo:photoURL
      }
      setUser(isSignedIn)
    })
    .catch(err =>(
      console.log(err.message)
      
    ))
  }

  const handleSignOut =()=>{
    console.log('Sign out Clicked')
    firebase.auth().signOut()
    .then(function() {
      const signOutUser = {
        isSignIn:false,
        Name: '',
        Email: '',
        photo: '',
      }
      setUser(signOutUser)
    })
    .catch(function(error) {
      
    });
  }
  return(
    <div>
      {
        user.isSignIn ? <button onClick = {handleSignOut}>Sign out</button> :
        <button onClick = {handleSignIn}>Sign in</button>
        
      }
      {
        user.isSignIn && <div>
          <p>Welcome {user.Name}</p>
          <p>Email {user.Email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}
export default App;

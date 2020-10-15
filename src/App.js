import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      console.log(res.user)
      setUser(signedInUser);

    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log('after using Facebook id' , user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false
      }
      setUser(signedOutUser);
    }).catch(err => {
      // An error happened.
    });
  }
  const handleSubmit =(e)=>{
    console.log(user.email , user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user}
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
        updateUserName(user.name)

      })
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {...user}
        newUserInfo.error = error.message
        newUserInfo.success = false;
       setUser(newUserInfo)
        // ...
      });
    }
    if(!newUser && user.name && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        // Handle Errors here.
        .then(res => {
          const newUserInfo = {...user}
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
          console.log('Sign in with Info' , res.user)
        })
        
       .catch(error => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message
        newUserInfo.success = false;
       setUser(newUserInfo)
       })
     
    }
    e.preventDefault()
  }
  const updateUserName = name => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: name
        }).then(function() {
          console.log('User name updated successfully.')
          // Update successful.
        }).catch(function(error) {
          console.log(error)
          // An error happened.
        });
  }
  const handleBlur =(e)=>{
    let isFormValid = true;
    if(e.target.name === 'email'){
      isFormValid =  /\S+@\S+\.\S+/.test(e.target.value)
    }
    if(e.target.name === 'password'){
      const isFormValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(e.target.value)
      console.log(isFormValid)
    }
    if (isFormValid) {
      let newUserInfo = {...user}
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo);
    }
  }
  return (
    <div className="App">
      { user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in Using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}!</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="newUser" onChange={() =>setNewUser(!newUser)} id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
         {newUser && <input name="name" onBlur={handleBlur} placeholder="Your Name" type="text" required/>}
          <br/>
          <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email" required/> <br/>
          <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required/>
          <br/>
          <br/>
          <input type="submit" onClick={handleSubmit} value={newUser ? 'Sign Up': 'Sign In'}/>
    </form>
        <p style={{color: 'red'}}>{user.error}</p>
       {user.success && <p style={{color: 'green'}}>User {newUser ?'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;

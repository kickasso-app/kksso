import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "api/firebase.js";
import auth from "firebase/auth";

const signUpEmail = ({ email, password, displayName }) => {
  const firebase = useContext(FirebaseContext);
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password, displayName)
    .then((user) => {
      console.log("registered", user);
      //   registerForm.reset();
    })
    .catch((error) => {
      // registerForm.querySelector('.error').textContent = error.message;
    });
};

export { signUpEmail };

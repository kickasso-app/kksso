// // import { createContext } from "react";
// // import app from "firebase/app";

// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/analytics";

// const FirebaseContext = createContext(null);

// const fireConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };
// const initFirebase = () => {
//   if (!firebase.apps.length) {
//     firebase.initializeApp(fireConfig);
//   }
//   return (
//     <FirebaseContext.Provider value={firebase}>
//       {children}
//     </FirebaseContext.Provider>
//   );
// };

// export default initFirebase;

import { createContext } from "react";
import app from "firebase/app";

const FirebaseContext = createContext(null);

// const fireConfig = {
//   apiKey: "AIzaSyDQnYmgeILAlFR9ahctSc8MqCGj34t5mjU",
//   authDomain: "kksso-101.firebaseapp.com",
//   projectId: "kksso-101",
//   storageBucket: "kksso-101.appspot.com",
//   messagingSenderId: "836753077914",
//   appId: "1:836753077914:web:1c79239c71fa1b56171123",
//   measurementId: "G-NZXHLJYR75",
// };

// export async function getStaticProps() {
//     const fireConfig = {
//       apiKey: process.env.FIREBASE_API_KEY,
//       authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//       databaseURL: process.env.FIREBASE_DATABASE_URL,
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//       messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//       appId: process.env.FIREBASE_APP_ID,
//     };
//   }

const fireConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const initFirebase = () => {
  if (!app.apps.length) {
    app.initializeApp(fireConfig);
  }
};
const FirebaseProvider = ({ children }) => {
  if (!app.apps.length) {
    app.initializeApp(fireConfig);
  }
  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider, initFirebase };

const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `
        $color-primary: #4b4b4b;
        $color-primary-black: #222; 
        $color-secondary: #C0FFF4; 
        $color-quad: #FFC0CB;
        $color--bg-white: #fff;

        $color-gray: rgba(0, 0, 0, 0.1);
    `,
  },
  env: {
    FIREBASE_API_KEY: "AIzaSyDQnYmgeILAlFR9ahctSc8MqCGj34t5mjU",
    FIREBASE_AUTH_DOMAIN: "kksso-101.firebaseapp.com",
    FIREBASE_PROJECT_ID: "kksso-101",
    FIREBASE_STORAGE_BUCKET: "kksso-101.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "836753077914",
    FIREBASE_APP_ID: "1:836753077914:web:1c79239c71fa1b56171123",
    FIREBASE_MEASUREMENT_ID: "G-NZXHLJYR75",
  },
};

// FIREBASE_API_KEY="AIzaSyDQnYmgeILAlFR9ahctSc8MqCGj34t5mjU"
// FIREBASE_AUTH_DOMAIN="kksso-101.firebaseapp.com"
// FIREBASE_PROJECT_ID="kksso-101"
// FIREBASE_STORAGE_BUCKET="kksso-101.appspot.com"
// FIREBASE_MESSAGING_SENDER_ID="836753077914"
// FIREBASE_APP_ID="1:836753077914:web:1c79239c71fa1b56171123"
// FIREBASE_MEASUREMENT_ID="G-NZXHLJYR75"

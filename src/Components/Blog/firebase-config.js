// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc-LHa2Enn7ZRxh-zP1nYlZkaEQf0tOlU",
  authDomain: "compiler-15a57.firebaseapp.com",
  projectId: "compiler-15a57",
  storageBucket: "compiler-15a57.appspot.com",
  messagingSenderId: "554353499594",
  appId: "1:554353499594:web:809b257ab4cf8296d64333",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

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
  apiKey: "AIzaSyAavDGCG-QDgnRafjdqtRu-KM2R2HYLupM",
  authDomain: "compiler-a05f9.firebaseapp.com",
  projectId: "compiler-a05f9",
  storageBucket: "compiler-a05f9.appspot.com",
  messagingSenderId: "244012793190",
  appId: "1:244012793190:web:5453c2ede4c98a81d5dca7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

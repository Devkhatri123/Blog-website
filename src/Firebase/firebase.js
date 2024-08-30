// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB10Oonqt704gc-aRWaJ8D_thN6vAxwsqs",
  authDomain: "blog-app-c0eff.firebaseapp.com",
  projectId: "blog-app-c0eff",
  storageBucket: "blog-app-c0eff.appspot.com",
  messagingSenderId: "401106079442",
  appId: "1:401106079442:web:e9f0b8cf41978ad07ae70b",
  databaseURL:"https://blog-app-c0eff-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestoredb = firebase.firestore();
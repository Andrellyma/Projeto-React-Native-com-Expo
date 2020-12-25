import * as firebase from 'firebase';
import 'firebase/storage'; 
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyAj6a3VaaFFcybaYQzd4XjDy4w_RW_vDyg",
    authDomain: "expo-farebase.firebaseapp.com",
    projectId: "expo-farebase",
    storageBucket: "expo-farebase.appspot.com",
    messagingSenderId: "767302154740",
    appId: "1:767302154740:web:89f0f3c7565caec3fc21a1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const database = firebase.firestore();
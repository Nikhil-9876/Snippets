// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get, getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzKEV_Bx7DAQf2eROALZxeuKyzE1YOrDE",
  authDomain: "fir-ddc7d.firebaseapp.com",
  projectId: "fir-ddc7d",
  storageBucket: "fir-ddc7d.firebasestorage.app",
  messagingSenderId: "304233275225",
  appId: "1:304233275225:web:20844fdcc4d6f752a97648",
  measurementId: "G-GM9HN0YQ5T",
  databaseURL: "https://fir-ddc7d-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db=getDatabase(app);
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import { createContext, useContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDzKEV_Bx7DAQf2eROALZxeuKyzE1YOrDE",
  authDomain: "fir-ddc7d.firebaseapp.com",
  databaseURL: "https://fir-ddc7d-default-rtdb.firebaseio.com",
  projectId: "fir-ddc7d",
  storageBucket: "fir-ddc7d.firebasestorage.app",
  messagingSenderId: "304233275225",
  appId: "1:304233275225:web:20844fdcc4d6f752a97648",
  measurementId: "G-GM9HN0YQ5T",
  databaseURL: "https://fir-ddc7d-default-rtdb.firebaseio.com"
};



const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const signInUserWithEmailAndPassword = async (email, password) => {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  };
  const signUpUserWithEmailAndPassword = async (email, password) => {
    return await createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const writeUserData = (key, data) => {
    set(ref(database, key), data);
  };

  return (
    <FirebaseContext.Provider
      value={{
        signInUserWithEmailAndPassword,
        signUpUserWithEmailAndPassword,
        writeUserData,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

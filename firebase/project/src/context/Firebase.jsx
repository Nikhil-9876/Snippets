import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZX08Mlt4oZ5SM-PGat4m_OVH3e4m1jGo",
  authDomain: "bookify-84f19.firebaseapp.com",
  projectId: "bookify-84f19",
  storageBucket: "bookify-84f19.firebasestorage.app",
  messagingSenderId: "254730481265",
  appId: "1:254730481265:web:f6192f30a5e16d924775d0",
  measurementId: "G-MNGLR1YRXP",
  databaseURL: "https://bookify-84f19-default-rtdb.firebaseio.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = user ? true : false;

  const signInUserWithEmailAndPassword = async (email, password) => {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signUpUserWithEmailAndPassword = async (email, password) => {
    return await createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signinWithGoogle = () => {
    return signInWithPopup(firebaseAuth, provider);
  };

  console.log(user);
  const handleCreateNewListing = async (name,isbn,price,cover) => {
    const imgref = ref(storage, `uploads/images/${Date.now()}_${cover.name}`);
    const uploadResult = await uploadBytes(imgref, cover);
    await addDoc(collection(firestore, "books"), {
      name: name,
      isbn: isbn,
      price: price,
      coverURL: uploadResult.ref.fullPath,
      userId: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
    });
  };


  const listAllBooks = async () => {
    const querySnapshot = await getDocs(collection(firestore, "books"));
    const books = []; 
    querySnapshot.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() });
    });
    return books;
  }

  const getImageURL = async (path) => {
    return await getDownloadURL(ref(storage, path));
  };

  return (
    <FirebaseContext.Provider
      value={{
        isLoggedIn,
        signinWithGoogle,
        signInUserWithEmailAndPassword,
        signUpUserWithEmailAndPassword,
        handleCreateNewListing,
        listAllBooks,
        getImageURL,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

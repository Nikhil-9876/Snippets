import { useEffect, useState } from "react";
import SignupPage from "./pages/signup.jsx";
import LoginPage from "./pages/login.jsx";
import { useFirebase } from "./context/firebase.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "./firebase.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { get, set, ref, onValue } from "firebase/database";

const firestore = getFirestore(app);
const auth = getAuth(app);

const App = () => {
  const { signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword } =
    useFirebase();
  const [showSignup, setShowSignup] = useState(true);
  const toggleForm = () => setShowSignup(!showSignup);
  const [user, setUser] = useState(null);

  // Input states
  const [name, setName] = useState("Nikhil Solanki");
  const [deviceName, setDeviceName] = useState("");
  const [price, setPrice] = useState("");

  // Realtime database state for username streaming
  const [realtimeName, setRealtimeName] = useState("");

  // Firestore writing
  const writeUserDataToFirestore = async (user) => {
    try {
      const docRef = await addDoc(collection(firestore, "users"), {
        uid: user.uid,
        email: user.email,
        name,
        deviceName,
        price: Number(price),
      });
      console.log("User data written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Firestore subcollection writing
  const makeSubCollection = async (user) => {
    try {
      const docRef = await addDoc(
        collection(firestore, `users/${user.uid}/devices`),
        {
          deviceName,
          price: Number(price),
        }
      );
      console.log("Subcollection document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document to subcollection: ", e);
    }
  };

  // Firestore fetch docs by uid
  const fetchUserDocsByUid = async (uid) => {
    const q = query(collection(firestore, "users"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const userDocs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return userDocs;
  };

  // Firestore update price by uid and name
  const updateUserPriceByIdAndName = async (uid, name, newPrice) => {
    const q = query(
      collection(firestore, "users"),
      where("uid", "==", uid),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    for (const d of querySnapshot.docs) {
      const docRef = doc(firestore, "users", d.id);
      await updateDoc(docRef, { price: Number(newPrice) });
      console.log(`Updated price for user doc: ${d.id}`);
    }
  };

  // Realtime database write user data
  const writeUserData = (userId, name, email) => {
    set(ref(db, "users/" + userId), {
      username: name,
      email: email,
    });
  };

  // Realtime database read + listen for username changes
  useEffect(() => {
    if (user) {
      const nameRef = ref(db, "users/" + user.uid + "/username");
      const unsubscribe = onValue(nameRef, (snapshot) => {
        setRealtimeName(snapshot.val() || "");
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Firebase auth listener
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
        setUser(null);
      }
    });
  }, []);

  if (user === null) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Firebase React App
            </h1>
            <button
              onClick={toggleForm}
              className="w-full mb-6 py-2 font-semibold rounded-md transition-colors duration-300
                bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-4
                focus:ring-purple-300"
            >
              {showSignup ? "Switch to Login" : "Switch to Signup"}
            </button>

            <div className="transition-all duration-500 ease-in-out">
              {showSignup ? (
                <SignupPage
                  signUpUserWithEmailAndPassword={signUpUserWithEmailAndPassword}
                />
              ) : (
                <LoginPage
                  signInUserWithEmailAndPassword={signInUserWithEmailAndPassword}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome to the App!
          </h1>
          <p className="text-lg text-gray-600 mb-4">You are logged in.</p>

          <button
            onClick={() => auth.signOut()}
            className="w-full py-2 font-semibold rounded-md transition-colors duration-300
              bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4
              focus:ring-red-300"
          >
            Logout
          </button>

          {/* Show realtime username from Realtime Database */}
          <p className="mt-2 text-gray-700 font-semibold">
            Realtime username from DB: {realtimeName}
          </p>

          {/* Input fields */}
          <div className="mt-4 space-y-4 text-left">
            <div>
              <label className="block font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="deviceName">
                Device Name
              </label>
              <input
                id="deviceName"
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter device name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={() => writeUserDataToFirestore(user)}
            className="w-full py-2 my-4 font-semibold rounded-md transition-colors duration-300
              bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-4
              focus:ring-green-300"
          >
            Write data to Firestore
          </button>

          <button
            onClick={() => makeSubCollection(user)}
            className="w-full py-2 font-semibold rounded-md transition-colors duration-300
              bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4
              focus:ring-blue-300"
          >
            Add to Firestore Subcollection
          </button>

          <button
            onClick={() =>
              fetchUserDocsByUid(user.uid).then((data) => console.log(data))
            }
            className="w-full py-2 mt-4 font-semibold rounded-md transition-colors duration-300
              bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4
              focus:ring-indigo-300"
          >
            Get Firestore Documents
          </button>

          <button
            onClick={() =>
              updateUserPriceByIdAndName(user.uid, "Nikhil", 200000)
            }
            className="w-full py-2 mt-4 font-semibold rounded-md transition-colors duration-300
              bg-yellow-600 text-white hover:bg-yellow-700 focus:outline-none focus:ring-4
              focus:ring-yellow-300"
          >
            Update Price in Firestore
          </button>

          <button
            onClick={() => writeUserData(user.uid, name, user.email)}
            className="w-full py-2 mt-4 font-semibold rounded-md transition-colors duration-300
              bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus:ring-4
              focus:ring-pink-300"
          >
            Write User Data to Realtime Database
          </button>
        </div>
      </div>
    </>
  );
};

export default App;

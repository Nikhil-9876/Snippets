import { useState } from 'react';
import SignupPage from './pages/signup.jsx';
import LoginPage from './pages/login.jsx';
import { useFirebase } from './context/firebase.jsx';

function App() {
  const { signUpUserWithEmailAndPassword, signInUserWithEmailAndPassword } = useFirebase();

  const [showSignup, setShowSignup] = useState(true);

  const toggleForm = () => setShowSignup(!showSignup);

  return (
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
          {showSignup ? 'Switch to Login' : 'Switch to Signup'}
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
  );
}

export default App;

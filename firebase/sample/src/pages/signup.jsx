import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const SignupPage = ({ signUpUserWithEmailAndPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignupAndSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await signUpUserWithEmailAndPassword(email, password);
      setSuccess(true);
      setEmail(""); 
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Account Created Successfully!</h2>
        <p>Welcome! Your account has been created.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sign Up</h2>
      <form onSubmit={handleSignupAndSignin}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: "1rem",
            }}
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: "1rem",
            }}
            placeholder="Enter your password (min 6 characters)"
          />
        </div>
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "1rem",
              padding: "0.5rem",
              backgroundColor: "#ffebee",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !email || !password}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 20,
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          borderRadius: 4,
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Please wait..." : "Sign Up with Google"}
      </button>
    </div>
  );
};

export default SignupPage;

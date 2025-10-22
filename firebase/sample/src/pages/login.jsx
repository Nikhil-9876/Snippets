import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";

const auth = getAuth(app);

const LoginPage = ({ onLogin, signInUserWithEmailAndPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = (email, password) => {
    setLoading(true);
    signInUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful:", user);
        setError("");
        setSuccessMessage("Login successful! Welcome back.");
        if (onLogin) onLogin(user);
      })
      .catch((error) => {
        setError(error.message);
        setSuccessMessage("");
      })
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google login successful:", user);
      setSuccessMessage("Google login successful! Welcome back.");
      if (onLogin) onLogin(user);
    } catch (error) {
      setError(error.message);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    loginUser(email, password);
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "10px 0" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 5 }}
            placeholder="Enter your email"
            required
          />
        </div>
        <div style={{ margin: "10px 0" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 5 }}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {successMessage && <div style={{ color: "green", marginBottom: 10 }}>{successMessage}</div>}
        <button type="submit" style={{ padding: 10, width: "100%" }} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <hr style={{ margin: "20px 0" }} />
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Please wait..." : "Login with Google"}
      </button>
    </div>
  );
};

export default LoginPage;

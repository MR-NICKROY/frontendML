import React, { useState } from "react";
import { authAPI } from "./APIs/index.js";
import "./Css/Auth.css";

// Receive the onLoginSuccess prop from App.jsx
const Auth = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // State for success message

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (mode === "signup") {
        response = await authAPI.signup(form);
      } else {
        response = await authAPI.login({
          email: form.email,
          password: form.password
        });
      }

      // 1. Save response to localstorage named 'user'
      // Note: If your backend sends a token in the body, this saves it.
      // If it sends a standard cookie, the browser handles the cookie automatically.
    
      localStorage.setItem("user", JSON.stringify(response.data)); // Save to local storage
       setTimeout(() => {
           onLoginSuccess(response.data); // Notify App.jsx to switch screens
          }, 1500);
      // 2. Show success message
      setSuccessMsg(mode === "login" ? "Login Successful!" : "Signup Successful!");

      // 3. Delay for 1.5 seconds before switching components
      setTimeout(() => {
        onLoginSuccess(response.data);
      }, 1500);

    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
      setLoading(false); // Only stop loading on error, keep it 'loading' during success delay if you prefer
    } finally {
      // We don't set loading(false) immediately on success to prevent the form from becoming interactive again during the delay
      if (error) setLoading(false);
    }
  };

  // If success message is active, show only that (or overlay it)
  if (successMsg) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#10b981" }}>{successMsg}</h2>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>

        {mode === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </button>

        <p className="auth-switch">
          {mode === "login" ? (
            <>
              Don’t have an account?
              <span onClick={() => setMode("signup")}> Sign up</span>
            </>
          ) : (
            <>
              Already have an account?
              <span onClick={() => setMode("login")}> Login</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Auth;
import { useState, useEffect } from "react";
import "./styles/login.css";
import LoginForm from "./components/Login";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import { login } from "./services/authService";

function App() {
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedLoginStatus = localStorage.getItem("loggedIn");
    if (storedLoginStatus === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const data = await login(username, password);
      setMessage(data.message);
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true"); // Store login status
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn"); // Clear login status
  };

  return (
    <div className="App">
      {loggedIn ? (
        <HomePage onLogout={handleLogout} /> // Pass logout function
      ) : (
        <>
          <LoginForm onSubmit={handleLogin} />
          {message && <p className="error-message">{message}</p>}
          <RegisterForm />
        </>
      )}
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("Uitgelogd");
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="auth/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="auth/register"
          element={<Register onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/appointments"
          element={
            isLoggedIn ? (
              <App onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/appointments" />
            ) : (
              <Navigate to="auth/register" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default MainApp;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/style.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sla token op
        localStorage.setItem("token", data.token);
        console.log("Ingelogd!");
        // Notify parent and redirect
        onLoginSuccess();
        navigate("/appointments");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="form">
      <form className="form__container" onSubmit={handleLogin}>
        <label className="form__container__title">Inloggen</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form__container__button">Inloggen</button>
        {error && <p>{error}</p>}
        <button
          className="form__container__special-button"
          type="button"
          onClick={() => navigate("/auth/register")}
        >
          Nog geen account? Registreer nu!
        </button>
      </form>
    </section>
  );
}
export default Login;

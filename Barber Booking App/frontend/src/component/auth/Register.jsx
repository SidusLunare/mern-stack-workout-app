import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/style.css";

function Register({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sla token op
        localStorage.setItem("token", data.token);
        console.log("Geregistreerd!");
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
      <form className="form__container" onSubmit={handleRegister}>
        <h1 className="form__container__title">Registratie</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Wachtwoord bevestigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="form__container__button">Registreren</button>
        {error && <p>{error}</p>}
        <button
          className="form__container__special-button"
          type="button"
          onClick={() => navigate("/auth/login")}
        >
          Al een account? Log hier in!
        </button>
      </form>
    </section>
  );
}
export default Register;

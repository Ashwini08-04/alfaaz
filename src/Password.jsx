import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Password.css";

function Password() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://alfaaz-backend-hhts.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect password");
        return;
      }

      localStorage.setItem("alfaaz_token", data.token);
      navigate("/home");
    } catch {
      setError("Unable to connect. Please try again.");
    }
  };

  return (
    <main className="password-page">
      <div className="password-card">
        <div className="password-icon">
          <LockKeyhole size={20} />
        </div>

        <span className="password-label">A PRIVATE SPACE</span>

        <h1>Alfaaz</h1>

        <p>Some words are meant to stay here.</p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />

          {error && <span className="password-error">{error}</span>}

          <button type="submit">
            Enter
            <ArrowRight size={17} />
          </button>
        </form>

        <small>For Ganesh ✦</small>
      </div>
    </main>
  );
}

export default Password;
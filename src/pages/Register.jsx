import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="auth-page">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Créer mon compte</button>
      </form>
      <p>
        Déjà inscrit ? <Link to="/login">Connecte-toi</Link>
      </p>
    </div>
  );
}

export default Register;


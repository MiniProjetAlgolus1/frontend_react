import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de page par défaut du <form>
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard"); // redirection après connexion réussie
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="auth-page">
      <h1>Connexion</h1>
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
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Pas encore de compte ? <Link to="/register">Inscris-toi</Link>
      </p>
    </div>
  );
}

export default Login;

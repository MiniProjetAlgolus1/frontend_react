//IA content
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation côté client : donne un retour immédiat à l'utilisateur,
  // MAIS ne remplace jamais la validation côté serveur (Symfony la refait de toute façon).
  const validate = () => {
    if (form.firstName.trim().length < 2) {
      return "Le prénom doit contenir au moins 2 caractères";
    }
    if (form.lastName.trim().length < 2) {
      return "Le nom doit contenir au moins 2 caractères";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Email invalide";
    }
    if (form.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (form.password !== form.confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };
//FIN IA content
  return (
    <div className="auth-page">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prénom
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
        <label>
          Nom
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirmer le mot de passe
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
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

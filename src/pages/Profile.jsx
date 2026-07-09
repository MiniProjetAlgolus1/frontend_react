import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {
  const [form, setForm] = useState({ firstName: "", lastName: "", password: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/me")
      .then((response) => {
        setEmail(response.data.email);
        setForm({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          password: "",
        });
      })
      .catch(() => setError("Impossible de charger le profil"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
    };
    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      await api.put("/api/me", payload);
      setSuccess("Profil mis à jour avec succès");
      setForm({ ...form, password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="page">
      <h1>Mon profil</h1>

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <label>
            Email (non modifiable)
            <input type="email" value={email} disabled />
          </label>
          <label>
            Prénom
            <input name="firstName" value={form.firstName} onChange={handleChange} />
          </label>
          <label>
            Nom
            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </label>
          <label>
            Nouveau mot de passe (laisser vide pour ne pas changer)
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
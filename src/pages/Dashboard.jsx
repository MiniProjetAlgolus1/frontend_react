//IA content 
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  // useEffect avec [] = exécuté une seule fois, juste après le premier affichage
  // du composant. C'est ici qu'on va chercher les données depuis l'API.
  useEffect(() => {
    api
      .get("/api/stats")
      .then((response) => setStats(response.data))
      .catch(() => setError("Impossible de charger les statistiques"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>Chargement...</p>;
  if (error) return <p className="error" style={{ textAlign: "center", marginTop: 60 }}>{error}</p>;

  const chartData = [
    { name: "Utilisateurs", total: stats.totalUsers },
    { name: "Tâches", total: stats.totalTasks },
  ];
// FIN IA Content
  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <button onClick={logout}>Déconnexion</button>
      </header>

      <div className="cards">
        <div className="card">
          <h2>{stats.totalUsers}</h2>
          <p>Utilisateurs</p>
        </div>
        <div className="card">
          <h2>{stats.totalTasks}</h2>
          <p>Tâches</p>
        </div>
      </div>

      <h3>Vue d'ensemble</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;

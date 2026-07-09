import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/stats")
      .then((response) => setStats(response.data))
      .catch(() => setError("Impossible de charger les statistiques"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  const chartData = [
    { name: "Utilisateurs", total: stats.totalUsers },
    { name: "Tâches", total: stats.totalTasks },
  ];

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>{stats.totalUsers}</h2>
          <p>Utilisateurs</p>
        </div>
        <div className="card">
          <h2>{stats.totalTasks}</h2>
          <p>Tâches (toutes)</p>
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

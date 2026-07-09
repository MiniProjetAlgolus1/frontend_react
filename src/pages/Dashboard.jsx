import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../api/axios";

const STATUS_LABELS = {
  pending: "En attente",
  in_progress: "En cours",
  done: "Terminée",
};

// Couleurs pour chaque part du camembert
const COLORS = {
  pending: "#9ca3af",
  in_progress: "#f59e0b",
  done: "#10b981",
};

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

  const barData = [
    { name: "Utilisateurs", total: stats.totalUsers },
    { name: "Tâches", total: stats.totalTasks },
  ];

  // Transforme tasksByStatus ({pending: 4, ...}) en tableau pour le camembert
  const pieData = Object.entries(stats.tasksByStatus || {}).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    status,
  }));

  const hasTasks = pieData.some((d) => d.value > 0);

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

      <div className="charts-row">
        <div className="chart-box">
          <h3>Vue d'ensemble</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Répartition des tâches par statut</h3>
          {hasTasks ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.status} fill={COLORS[entry.status] || "#4f46e5"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-state">Aucune tâche à afficher.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

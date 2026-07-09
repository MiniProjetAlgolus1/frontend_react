import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminée" },
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = () => {
    setLoading(true);
    api
      .get("/api/tasks")
      .then((response) => setTasks(response.data))
      .catch(() => setError("Impossible de charger les tâches"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/tasks", form);
      setForm({ title: "", description: "", status: "pending" });
      loadTasks();
    } catch (err) {
      setError("Impossible de créer la tâche");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (err) {
      setError("Impossible de supprimer la tâche");
      setTasks(previous);
    }
  };

  return (
    <div className="page">
      <h1>Mes tâches</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Titre de la tâche"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">Aucune tâche pour l'instant.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className="task-card-main">
                <span className={`badge badge-${task.status}`}>
                  {STATUSES.find((s) => s.value === task.status)?.label || task.status}
                </span>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <button className="task-delete" onClick={() => handleDelete(task.id)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;

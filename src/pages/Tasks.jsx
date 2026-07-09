import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminée" },
];

const statusLabel = (value) =>
  STATUSES.find((s) => s.value === value)?.label || value;

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", status: "pending" });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, description: task.description || "", status: task.status });
  };

  const cancelEdit = () => setEditingId(null);

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await api.patch(`/api/tasks/${id}`, editForm, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });
      setEditingId(null);
      loadTasks();
    } catch (err) {
      setError("Impossible de modifier la tâche");
    }
  };

  const quickStatus = async (task, newStatus) => {
    try {
      await api.patch(`/api/tasks/${task.id}`, { status: newStatus }, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });
      loadTasks();
    } catch (err) {
      setError("Impossible de changer le statut");
    }
  };

  const visibleTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page">
      <h1>Mes tâches</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Titre de la tâche" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description (optionnel)" value={form.description} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      <div className="task-filters">
        <input
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty-state">Aucune tâche à afficher.</p>
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <div className="task-card" key={task.id}>
              {editingId === task.id ? (
                <div className="task-edit">
                  <input name="title" value={editForm.title} onChange={handleEditChange} />
                  <input name="description" value={editForm.description} onChange={handleEditChange} />
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <div className="task-edit-actions">
                    <button className="btn-save" onClick={() => saveEdit(task.id)}>Enregistrer</button>
                    <button className="btn-cancel" onClick={cancelEdit}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-card-main">
                    <span className={`badge badge-${task.status}`}>{statusLabel(task.status)}</span>
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>
                  <div className="task-actions">
                    <select
                      className="quick-status"
                      value={task.status}
                      onChange={(e) => quickStatus(task, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <button className="task-edit-btn" onClick={() => startEdit(task)}>Modifier</button>
                    <button className="task-delete" onClick={() => handleDelete(task.id)}>Supprimer</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;

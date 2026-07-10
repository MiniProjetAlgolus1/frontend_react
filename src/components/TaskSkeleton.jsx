// Affiche des "fantômes" de cartes pendant le chargement, au lieu de "Chargement..."
function TaskSkeleton({ count = 3 }) {
  return (
    <div className="task-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="task-card skeleton-card" key={i}>
          <div className="skeleton-main">
            <div className="skeleton-line skeleton-badge" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-desc" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskSkeleton;

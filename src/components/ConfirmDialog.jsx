import { AlertTriangle } from "lucide-react";

// Modal de confirmation générique. Affichée seulement si "open" est vrai.
function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      {/* stopPropagation : empêche la fermeture quand on clique DANS la boîte */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">
          <AlertTriangle size={24} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="dialog-cancel" onClick={onCancel}>Annuler</button>
          <button className="dialog-confirm" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Ce composant "enveloppe" une page : si l'utilisateur n'est pas connecté,
// on le redirige vers /login au lieu d'afficher le contenu protégé.
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

import { createContext, useContext, useState } from "react";
import api from "../api/axios";

// Le Context permet de partager l'état "utilisateur connecté ?" à TOUTE
// l'application sans avoir à passer des props partout (login, dashboard, navbar...).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On initialise en vérifiant si un token existe déjà en mémoire du navigateur
  // (utilisateur déjà connecté avant un refresh de page)
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (email, password) => {
    // /api/login_check est la route fournie par le firewall JWT (lexik)
    const response = await api.post("/api/login_check", {
      email,
      password,
    });
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const register = async (email, password) => {
    await api.post("/api/register", { email, password });
    // Après inscription, on connecte directement l'utilisateur
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook custom : useAuth() au lieu de useContext(AuthContext) partout
export function useAuth() {
  return useContext(AuthContext);
}

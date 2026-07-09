import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ListChecks, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">MonProjet</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
            <ListChecks size={18} />
            Tâches
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            <User size={18} />
            Profil
          </NavLink>
        </nav>
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

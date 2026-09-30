import { Link, NavLink, Outlet } from "react-router-dom";
import Header from "./Header";

function AdminLayout({ onLogout, userName, children, isObserver = false }) {
  return (
    <div className="app-shell">
      <div className="app-toolbar">
        <Link className="brand-link" to={isObserver ? "/inventory" : "/dashboard"}>
          <Header />
        </Link>
        <div className="account-actions">
          <button className="secondary-action" onClick={onLogout}>Cerrar sesión</button>
          {userName && <span className="account-name">{userName}</span>}
        </div>
      </div>
      <nav className="section-nav" aria-label="Navegación principal">
        {!isObserver && <NavLink to="/dashboard">Panel</NavLink>}
        <NavLink to="/inventory">Inventario</NavLink>
        {!isObserver && <NavLink to="/users">Usuarios</NavLink>}
      </nav>
      {children || <Outlet />}
    </div>
  );
}

export default AdminLayout;
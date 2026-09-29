import { Link, NavLink, Outlet } from "react-router-dom";
import Header from "./Header";

function AdminLayout({ itemCount, onLogout, children }) {
  return (
    <div className="app-shell">
      <div className="app-toolbar">
        <Link className="brand-link" to="/dashboard">
          <Header itemCount={itemCount} />
        </Link>
        <button className="secondary-action" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <nav className="section-nav" aria-label="Navegación principal">
        <NavLink to="/dashboard">Panel</NavLink>
        <NavLink to="/inventory">Inventario</NavLink>
        <NavLink to="/users">Usuarios</NavLink>
      </nav>
      {children || <Outlet />}
    </div>
  );
}

export default AdminLayout;
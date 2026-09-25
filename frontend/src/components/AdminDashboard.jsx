import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <main className="dashboard-page">
      <div className="page-heading">
        <p className="eyebrow">Administración</p>
        <h2>Panel de control</h2>
      </div>
      <nav className="dashboard-options" aria-label="Opciones de administración">
        <Link className="dashboard-option" to="/inventory">
          <span className="dashboard-option-icon" aria-hidden="true">▤</span>
          <span>
            <strong>Administrar inventario</strong>
            <small>Consultar y actualizar los artículos registrados</small>
          </span>
          <span className="dashboard-option-arrow" aria-hidden="true">→</span>
        </Link>
        <Link className="dashboard-option" to="/users">
          <span className="dashboard-option-icon" aria-hidden="true">♙</span>
          <span>
            <strong>Administrar usuarios</strong>
            <small>Crear usuarios y asignar roles y estado</small>
          </span>
          <span className="dashboard-option-arrow" aria-hidden="true">→</span>
        </Link>
      </nav>
    </main>
  );
}

export default AdminDashboard;
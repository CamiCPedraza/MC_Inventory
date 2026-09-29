import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../api";
import ErrorAlert from "./ErrorAlert";
import UserFormModal from "./UserFormModal";

function UserAdministrationPage({ onUserCreated, error, onError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setUsers(await fetchUsers());
    } catch (fetchError) {
      setLoadError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserCreated = async (userData) => {
    const createdUser = await onUserCreated(userData);
    await loadUsers();
    return createdUser;
  };

  const handleUserCreatedSuccessfully = (user) => {
    setSuccessMessage(`Usuario ${user.username} creado correctamente.`);
    setIsCreateOpen(false);
  };

  return (
    <main className="management-page">
      <Link className="back-link" to="/dashboard">← Volver al panel</Link>
      <div className="page-heading">
        <p className="eyebrow">Administración</p>
        <h2>Usuarios</h2>
      </div>
      <ErrorAlert message={error} />

      <section className="users-table-section" aria-labelledby="users-list-title">
        <div className="users-table-heading">
          <h3 id="users-list-title">Usuarios creados</h3>
          <button type="button" className="secondary-action" onClick={loadUsers} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar lista"}
          </button>
        </div>
        {loadError && (
          <div className="users-load-error" role="alert">
            <p>{loadError}</p>
            <button type="button" onClick={loadUsers}>Reintentar</button>
          </div>
        )}
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Usuario</th>
                <th scope="col">Rol</th>
                <th scope="col">Activo</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 && (
                <tr><td colSpan="4">Cargando usuarios...</td></tr>
              )}
              {!loading && !loadError && users.length === 0 && (
                <tr><td colSpan="4">No hay usuarios registrados.</td></tr>
              )}
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role === "admin" ? "Administrador" : user.role === "observer" ? "Observador" : user.role}</td>
                  <td>
                    <span className={`user-status ${user.active ? "is-active" : "is-inactive"}`}>
                      {user.active ? "Sí" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {successMessage && <p className="success-message" role="status">{successMessage}</p>}
      <div className="users-add-action">
        <button type="button" onClick={() => setIsCreateOpen(true)}>
          Agregar usuario
        </button>
      </div>
      {isCreateOpen && (
        <UserFormModal
          onUserCreated={handleUserCreated}
          onUserCreatedSuccessfully={handleUserCreatedSuccessfully}
          onError={onError}
          onCancel={() => setIsCreateOpen(false)}
        />
      )}
    </main>
  );
}

export default UserAdministrationPage;
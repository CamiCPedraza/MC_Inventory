import { Link } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import UserForm from "./UserForm";

function UserAdministrationPage({ onUserCreated, error, onError }) {
  return (
    <main className="management-page">
      <Link className="back-link" to="/dashboard">← Volver al panel</Link>
      <div className="page-heading">
        <p className="eyebrow">Administración</p>
        <h2>Usuarios</h2>
      </div>
      <ErrorAlert message={error} />
      <UserForm onUserCreated={onUserCreated} onError={onError} />
    </main>
  );
}

export default UserAdministrationPage;
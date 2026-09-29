import { useState } from "react";

const initialForm = {
  username: "",
  password: "",
  role: "observer",
  name: ""
};

function UserForm({ onUserCreated, onUserCreatedSuccessfully, onError, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    onError("");

    try {
      const user = await onUserCreated({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        name: form.name.trim(),
        active: true
      });
      setForm(initialForm);
      onUserCreatedSuccessfully(user);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form-content">
      <h2 id="user-form-title">Agregar usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario
          <input
            type="text"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
            autoComplete="off"
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          Contraseña
          <span className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <span
              className="password-visibility"
              role="img"
              title="ver contraseña"
              aria-label="ver contraseña"
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
            >
              <svg
                className="eye-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </span>
          </span>
        </label>

        <label>
          Rol
          <select
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            disabled={isSubmitting}
          >
            <option value="admin">Administrador</option>
            <option value="observer">Observador</option>
          </select>
        </label>

        <label>
          Nombre
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando usuario..." : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
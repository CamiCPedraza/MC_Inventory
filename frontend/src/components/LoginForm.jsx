import { useState } from "react";

function LoginForm({ onLogin, error }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onLogin(credentials);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="login-card">
        <h1>Inventario PVCM</h1>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              type="text"
              value={credentials.username}
              onChange={(event) => updateField("username", event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Contraseña
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="current-password"
                required
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginForm;
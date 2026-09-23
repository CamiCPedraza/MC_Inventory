function EmptyInventoryScreen({ onLogout }) {
  return (
    <main className="auth-shell">
      <section className="login-card">
        <h1>Inventario PVCM</h1>
        <p>No hay inventario registrado en este momento.</p>
        <button className="secondary-action" onClick={onLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}

export default EmptyInventoryScreen;

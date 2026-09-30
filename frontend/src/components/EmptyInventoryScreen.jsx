function EmptyInventoryScreen({ onLogout, userName }) {
  return (
    <main className="auth-shell">
      <section className="login-card">
        <h1>Comercializadora Quantto | Sistema de inventario</h1>
        <p>No hay inventario registrado en este momento.</p>
        <button className="secondary-action" onClick={onLogout}>
          Cerrar sesión
        </button>
        {userName && <p className="account-name">{userName}</p>}
      </section>
    </main>
  );
}

export default EmptyInventoryScreen;

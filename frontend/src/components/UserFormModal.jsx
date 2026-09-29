import UserForm from "./UserForm";

function UserFormModal({ onUserCreated, onUserCreatedSuccessfully, onError, onCancel }) {
  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onCancel();
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <section
        className="modal-content user-create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <button
          type="button"
          className="user-modal-close"
          aria-label="Cerrar formulario"
          onClick={onCancel}
        >
          ×
        </button>
        <UserForm
          onUserCreated={onUserCreated}
          onUserCreatedSuccessfully={onUserCreatedSuccessfully}
          onError={onError}
          onCancel={onCancel}
        />
      </section>
    </div>
  );
}

export default UserFormModal;
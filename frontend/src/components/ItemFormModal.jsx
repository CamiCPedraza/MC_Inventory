import ItemForm from "./ItemForm";

function ItemFormModal({ onItemCreated, onItemCreatedSuccessfully, onError, onCancel }) {
  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onCancel();
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <section
        className="modal-content item-create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-form-title"
      >
        <button
          type="button"
          className="user-modal-close"
          aria-label="Cerrar formulario"
          onClick={onCancel}
        >
          ×
        </button>
        <ItemForm
          onItemCreated={onItemCreated}
          onItemCreatedSuccessfully={onItemCreatedSuccessfully}
          onError={onError}
          onCancel={onCancel}
        />
      </section>
    </div>
  );
}

export default ItemFormModal;
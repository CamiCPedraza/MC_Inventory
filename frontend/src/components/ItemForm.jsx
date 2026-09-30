import { useState } from "react";
import { useItemForm } from "../hooks/useItemForm";

function ItemForm({ onItemCreated, onItemCreatedSuccessfully, onError, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, updateField, handleSubmit: formHandleSubmit } = useItemForm(
    async (data) => {
      setIsSubmitting(true);
      try {
        const item = await onItemCreated(data);
        onItemCreatedSuccessfully?.(item);
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  const handleChange = (field) => (event) => {
    updateField(field, event.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      await formHandleSubmit(e);
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <section className="form-card item-form-card">
      <h2 id="item-form-title">Registrar item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Producto
          <input
            type="text"
            value={form.sku}
            onChange={handleChange("sku")}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Descripción
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Cantidad (metros)
          <input
            type="number"
            value={form.stock}
            onChange={handleChange("stock")}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Bodega
          <input
            type="text"
            value={form.bodega}
            onChange={handleChange("bodega")}
            disabled={isSubmitting}
          />
        </label>

        {onCancel ? (
          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear item"}
            </button>
          </div>
        ) : (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear item"}
          </button>
        )}
      </form>
    </section>
  );
}

export default ItemForm;

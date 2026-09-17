import { useState } from "react";
import { useItemForm } from "../hooks/useItemForm";

function ItemForm({ onItemCreated, onError }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, updateField, handleSubmit: formHandleSubmit } = useItemForm(
    async (data) => {
      setIsSubmitting(true);
      try {
        await onItemCreated(data);
      } catch (err) {
        onError(err.message);
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
    <section className="form-card">
      <h2>Registrar item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            disabled={isSubmitting}
          />
        </label>

        <label>
          SKU
          <input
            type="text"
            value={form.sku}
            onChange={handleChange("sku")}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            value={form.stock}
            onChange={handleChange("stock")}
            disabled={isSubmitting}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear item"}
        </button>
      </form>
    </section>
  );
}

export default ItemForm;

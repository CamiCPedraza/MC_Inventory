import { useState, useCallback } from "react";

const initialForm = { name: "", sku: "", stock: "" };

export function useItemForm(onSubmit) {
  const [form, setForm] = useState(initialForm);

  const updateField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const validate = useCallback(() => {
    if (!form.name || !form.sku || !form.stock) {
      return "Todos los campos son obligatorios.";
    }
    return null;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) throw new Error(validationError);

      await onSubmit({
        name: form.name,
        sku: form.sku,
        stock: Number(form.stock)
      });

      setForm(initialForm);
    },
    [form, onSubmit, validate]
  );

  return {
    form,
    updateField,
    handleSubmit,
    reset: () => setForm(initialForm)
  };
}

import { useState } from "react";

function UpdateStockModal({ isOpen, itemName, currentStock, onConfirm, onCancel }) {
  const [inputValue, setInputValue] = useState(currentStock.toString());
  const [error, setError] = useState("");

  const handleConfirm = () => {
    setError("");
    const newStock = Number(inputValue);
    if (Number.isNaN(newStock) || newStock < 0) {
      setError("Stock debe ser un número válido y mayor o igual a 0");
      return;
    }
    onConfirm(newStock);
    setInputValue(currentStock.toString());
  };

  const handleCancel = () => {
    setError("");
    setInputValue(currentStock.toString());
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Actualizar stock</h2>
        <p>Item: <strong>{itemName}</strong></p>
        <p>Stock actual: <strong>{currentStock}</strong></p>

        <label>
          Nuevo stock:
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            min="0"
          />
        </label>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-actions">
          <button onClick={handleConfirm} className="primary">
            Confirmar
          </button>
          <button onClick={handleCancel} className="secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateStockModal;

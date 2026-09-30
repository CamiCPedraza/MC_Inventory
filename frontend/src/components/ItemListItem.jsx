import { useState } from "react";
import BarcodeDisplay from "./BarcodeDisplay";

function ItemListItem({ item, onGenerateBarcode, onUpdateStock, readOnly }) {
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [isGeneratingBarcode, setIsGeneratingBarcode] = useState(false);

  const handleGenerateBarcode = async () => {
    setIsGeneratingBarcode(true);
    setBarcodeInfo(null);
    try {
      setBarcodeInfo(await onGenerateBarcode(item.id));
    } catch (error) {
      // The inventory page displays errors from the shared items hook.
    } finally {
      setIsGeneratingBarcode(false);
    }
  };

  return (
    <li>
      <div className="item-list-content">
        <div className="item-list-details">
          <strong>{item.sku}</strong>
          <span>Descripción: {item.name}</span>
          <span>Cantidad (metros): {item.stock}</span>
          <span>Bodega: {item.bodega}</span>
        </div>
        <BarcodeDisplay barcodeInfo={barcodeInfo} inline />
      </div>
      {!readOnly && (
        <div className="item-list-actions">
          <button onClick={handleGenerateBarcode} disabled={isGeneratingBarcode}>
            {isGeneratingBarcode ? "Generando..." : "Generar código de barras"}
          </button>
          <button
            onClick={() => onUpdateStock(item.id)}
            className="secondary-action"
          >
            Actualizar stock
          </button>
        </div>
      )}
    </li>
  );
}

export default ItemListItem;

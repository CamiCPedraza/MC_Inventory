import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import ItemFormModal from "./ItemFormModal";
import ItemList from "./ItemList";
import UpdateStockModal from "./UpdateStockModal";

function InventoryPage({
  items,
  loading,
  error,
  isObserver,
  onItemCreated,
  onError,
  onGenerateBarcode,
  onUpdateStock,
  modalState,
  onConfirmUpdate,
  onCancelUpdate
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="management-page">
      {!isObserver && <Link className="back-link" to="/dashboard">← Volver al panel</Link>}
      <div className="page-heading">
        <p className="eyebrow">Administración</p>
        <h2>Inventario</h2>
      </div>
      <ErrorAlert message={error} />
      {!isObserver && (
        <div className="inventory-add-action">
          <button type="button" onClick={() => setIsCreateOpen(true)}>Agregar producto</button>
        </div>
      )}
      <ItemList
        items={items}
        loading={loading}
        onGenerateBarcode={onGenerateBarcode}
        onUpdateStock={onUpdateStock}
        readOnly={isObserver}
      />
      {!isObserver && isCreateOpen && (
        <ItemFormModal
          onItemCreated={onItemCreated}
          onItemCreatedSuccessfully={() => setIsCreateOpen(false)}
          onError={onError}
          onCancel={() => setIsCreateOpen(false)}
        />
      )}
      {!isObserver && (
        <UpdateStockModal
          isOpen={modalState.isOpen}
          itemName={modalState.itemName}
          currentStock={modalState.currentStock}
          onConfirm={onConfirmUpdate}
          onCancel={onCancelUpdate}
        />
      )}
    </main>
  );
}

export default InventoryPage;
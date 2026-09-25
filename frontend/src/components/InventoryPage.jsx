import { Link } from "react-router-dom";
import BarcodeDisplay from "./BarcodeDisplay";
import ErrorAlert from "./ErrorAlert";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import QRDisplay from "./QRDisplay";
import UpdateStockModal from "./UpdateStockModal";

function InventoryPage({
  items,
  loading,
  error,
  isObserver,
  onItemCreated,
  onError,
  onGenerateQr,
  onGenerateBarcode,
  onUpdateStock,
  qrInfo,
  barcodeInfo,
  modalState,
  onConfirmUpdate,
  onCancelUpdate
}) {
  return (
    <main className="management-page">
      {!isObserver && <Link className="back-link" to="/dashboard">← Volver al panel</Link>}
      <div className="page-heading">
        <p className="eyebrow">Administración</p>
        <h2>Inventario</h2>
      </div>
      {!isObserver && <ItemForm onItemCreated={onItemCreated} onError={onError} />}
      <ErrorAlert message={error} />
      <ItemList
        items={items}
        loading={loading}
        onGenerateQr={onGenerateQr}
        onGenerateBarcode={onGenerateBarcode}
        onUpdateStock={onUpdateStock}
        readOnly={isObserver}
      />
      <QRDisplay qrInfo={qrInfo} />
      <BarcodeDisplay barcodeInfo={barcodeInfo} />
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
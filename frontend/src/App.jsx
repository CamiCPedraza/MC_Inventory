import { useEffect, useState } from "react";
import { useItems } from "./hooks/useItems";
import Header from "./components/Header";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";
import ErrorAlert from "./components/ErrorAlert";
import QRDisplay from "./components/QRDisplay";
import BarcodeDisplay from "./components/BarcodeDisplay";
import UpdateStockModal from "./components/UpdateStockModal";

function App() {
  const { items, loading, error, loadItems, addItem, updateItemStock, generateQr, generateBarcode, setError } = useItems();
  const [qrInfo, setQrInfo] = useState(null);
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
    currentStock: 0
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleGenerateQr = async (itemId) => {
    setQrInfo(null);
    try {
      const result = await generateQr(itemId);
      setQrInfo(result);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleGenerateBarcode = async (itemId) => {
    setBarcodeInfo(null);
    try {
      const result = await generateBarcode(itemId);
      setBarcodeInfo(result);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleUpdateStock = (itemId) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;
    setModalState({
      isOpen: true,
      itemId,
      itemName: item.name,
      currentStock: item.stock
    });
  };

  const handleConfirmUpdate = async (newStock) => {
    try {
      await updateItemStock(modalState.itemId, { stock: newStock });
      setModalState({ isOpen: false, itemId: null, itemName: "", currentStock: 0 });
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleCancelUpdate = () => {
    setModalState({ isOpen: false, itemId: null, itemName: "", currentStock: 0 });
  };

  return (
    <div className="app-shell">
      <Header itemCount={items.length} />

      <ItemForm
        onItemCreated={addItem}
        onError={setError}
      />

      <ErrorAlert message={error} />

      <ItemList
        items={items}
        loading={loading}
        onGenerateQr={handleGenerateQr}
        onGenerateBarcode={handleGenerateBarcode}
        onUpdateStock={handleUpdateStock}
      />

      <QRDisplay qrInfo={qrInfo} />

      <BarcodeDisplay barcodeInfo={barcodeInfo} />

      <UpdateStockModal
        isOpen={modalState.isOpen}
        itemName={modalState.itemName}
        currentStock={modalState.currentStock}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      />
    </div>
  );
}

export default App;

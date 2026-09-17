function ItemListItem({ item, onGenerateQr, onGenerateBarcode, onUpdateStock }) {
  return (
    <li key={item.id}>
      <div>
        <strong>{item.name}</strong>
        <span>SKU: {item.sku}</span>
        <span>Stock: {item.stock}</span>
      </div>
      <button onClick={() => onGenerateQr(item.id)}>
        Generar QR
      </button>
      <button onClick={() => onGenerateBarcode(item.id)}>
        Generar código de barras
      </button>
      <button
        onClick={() => onUpdateStock(item.id)}
        className="secondary-action"
      >
        Actualizar stock
      </button>
    </li>
  );
}

export default ItemListItem;

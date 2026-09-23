import ItemListItem from "./ItemListItem";

function ItemList({ items, loading, onGenerateQr, onGenerateBarcode, onUpdateStock, readOnly }) {
  if (loading) {
    return (
      <section className="items-card">
        <h2>Items</h2>
        <p>Cargando items...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="items-card">
        <h2>Items</h2>
        <p>No hay items registrados.</p>
      </section>
    );
  }

  return (
    <section className="items-card">
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <ItemListItem
            key={item.id}
            item={item}
            onGenerateQr={onGenerateQr}
            onGenerateBarcode={onGenerateBarcode}
            onUpdateStock={onUpdateStock}
            readOnly={readOnly}
          />
        ))}
      </ul>
    </section>
  );
}

export default ItemList;

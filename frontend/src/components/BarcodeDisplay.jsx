function BarcodeDisplay({ barcodeInfo, inline = false }) {
  if (!barcodeInfo) return null;

  return (
    <section className={inline ? "item-barcode-display" : "barcode-card"}>
      {!inline && <h2>Código de barras generado</h2>}
      <img src={barcodeInfo.barcode} alt="Código de barras" />
      <p>Producto codificado: {barcodeInfo.barcodeValue}</p>
    </section>
  );
}

export default BarcodeDisplay;

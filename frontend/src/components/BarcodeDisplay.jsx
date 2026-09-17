function BarcodeDisplay({ barcodeInfo }) {
  if (!barcodeInfo) return null;

  return (
    <section className="barcode-card">
      <h2>Código de barras generado</h2>
      <img src={barcodeInfo.barcode} alt="Código de barras" />
      <p>Valor codificado (SKU): {barcodeInfo.barcodeValue}</p>
    </section>
  );
}

export default BarcodeDisplay;

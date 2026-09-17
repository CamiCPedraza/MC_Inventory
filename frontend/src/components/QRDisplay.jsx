function QRDisplay({ qrInfo }) {
  if (!qrInfo) return null;

  return (
    <section className="qr-card">
      <h2>Código QR generado</h2>
      <img src={qrInfo.qrCode} alt="Código QR" />
      <p>
        Enlace de detalle:{" "}
        <a href={qrInfo.qrUrl} target="_blank" rel="noreferrer">
          Abrir información
        </a>
      </p>
    </section>
  );
}

export default QRDisplay;

import quantoLogo from "../assets/Quantto_logo.jpeg";

function Header() {
  return (
    <header className="brand-header">
      <img src={quantoLogo} alt="Logo de Comercializadora Quantto" />
      <h1>Comercializadora Quantto | Sistema de inventario</h1>
    </header>
  );
}

export default Header;

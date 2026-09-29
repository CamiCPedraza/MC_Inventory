import { useMemo } from "react";

function Header({ itemCount }) {
  const displayCount = useMemo(() => itemCount, [itemCount]);

  return (
    <header>
      <h1>Comercializadora Quantto | Sistema de inventario</h1>
      <p>{displayCount} items registrados</p>
    </header>
  );
}

export default Header;

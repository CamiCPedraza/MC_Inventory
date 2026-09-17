import { useMemo } from "react";

function Header({ itemCount }) {
  const displayCount = useMemo(() => itemCount, [itemCount]);

  return (
    <header>
      <h1>Inventario PVCM</h1>
      <p>{displayCount} items registrados</p>
    </header>
  );
}

export default Header;

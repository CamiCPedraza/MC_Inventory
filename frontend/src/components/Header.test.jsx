import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the title", () => {
    render(<Header />);
    expect(screen.getByText("Comercializadora Quantto | Sistema de inventario")).toBeInTheDocument();
    expect(screen.getByAltText("Logo de Comercializadora Quantto")).toBeInTheDocument();
    expect(screen.queryByText(/items registrados/i)).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the title", () => {
    render(<Header itemCount={5} />);
    expect(screen.getByText("Inventario PVCM")).toBeInTheDocument();
  });

  it("displays the item count", () => {
    render(<Header itemCount={10} />);
    expect(screen.getByText("10 items registrados")).toBeInTheDocument();
  });

  it("updates count when prop changes", () => {
    const { rerender } = render(<Header itemCount={5} />);
    expect(screen.getByText("5 items registrados")).toBeInTheDocument();

    rerender(<Header itemCount={8} />);
    expect(screen.getByText("8 items registrados")).toBeInTheDocument();
  });
});

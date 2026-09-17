import { render, screen } from "@testing-library/react";
import BarcodeDisplay from "./BarcodeDisplay";

describe("BarcodeDisplay", () => {
  it("does not render when barcodeInfo is null", () => {
    render(<BarcodeDisplay barcodeInfo={null} />);
    expect(screen.queryByText("Código de barras generado")).not.toBeInTheDocument();
  });

  it("renders barcode image and encoded value", () => {
    const barcodeInfo = {
      barcode: "data:image/png;base64,test",
      barcodeValue: "TOR-001"
    };

    render(<BarcodeDisplay barcodeInfo={barcodeInfo} />);

    expect(screen.getByText("Código de barras generado")).toBeInTheDocument();
    expect(screen.getByAltText("Código de barras")).toBeInTheDocument();
    expect(screen.getByText(/TOR-001/)).toBeInTheDocument();
  });
});

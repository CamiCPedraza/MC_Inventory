import { render, screen } from "@testing-library/react";
import QRDisplay from "./QRDisplay";

describe("QRDisplay", () => {
  it("does not render when qrInfo is null", () => {
    render(<QRDisplay qrInfo={null} />);
    expect(screen.queryByText("Código QR generado")).not.toBeInTheDocument();
  });

  it("renders QR code and link when qrInfo is provided", () => {
    const qrInfo = {
      qrCode: "data:image/png;base64,test",
      qrUrl: "http://localhost:3000/inventory/items/1/qr/view"
    };

    render(<QRDisplay qrInfo={qrInfo} />);

    expect(screen.getByText("Código QR generado")).toBeInTheDocument();
    expect(screen.getByAltText("Código QR")).toBeInTheDocument();
    expect(screen.getByText("Abrir información")).toHaveAttribute(
      "href",
      "http://localhost:3000/inventory/items/1/qr/view"
    );
  });

  it("link opens in new tab", () => {
    const qrInfo = {
      qrCode: "data:image/png;base64,test",
      qrUrl: "http://localhost:3000/inventory/items/1/qr/view"
    };

    render(<QRDisplay qrInfo={qrInfo} />);

    const link = screen.getByText("Abrir información");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});

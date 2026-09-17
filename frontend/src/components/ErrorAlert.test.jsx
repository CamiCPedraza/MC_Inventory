import { render, screen } from "@testing-library/react";
import ErrorAlert from "./ErrorAlert";

describe("ErrorAlert", () => {
  it("does not render when message is empty", () => {
    render(<ErrorAlert message="" />);
    expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();
  });

  it("does not render when message is null", () => {
    render(<ErrorAlert message={null} />);
    expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    render(<ErrorAlert message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("displays message with error styling", () => {
    render(<ErrorAlert message="Test error" />);
    const alert = screen.getByText("Test error");
    expect(alert.className).toBe("error-message");
  });
});

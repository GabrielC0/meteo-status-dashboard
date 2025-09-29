import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

describe("StatusBadge", () => {
  it("affiche le texte pour SUCCESS par défaut", () => {
    render(<StatusBadge status="SUCCESS" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("n'affiche pas le texte quand showText=false", () => {
    render(<StatusBadge status="SUCCESS" showText={false} />);
    expect(screen.queryByText("Success")).toBeNull();
  });
});

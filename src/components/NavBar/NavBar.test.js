import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NavBar from "./NavBar";

describe("NavBar component", () => {
  test("renders the NavBar with the correct text", () => {
    render(<NavBar />);
    const headingElement = screen.getByText(/PaperTrader/i);
    expect(headingElement).toBeInTheDocument();
  });
});

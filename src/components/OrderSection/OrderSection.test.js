import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OrderSection from "./OrderSection";
import { OrderProvider } from "./OrderContext";

describe("OrderSection component", () => {
  const selectedAsset = { symbol: "BTC-USD", price: 65000 };

  test("renders correctly with initial values", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    expect(screen.getByText("BUY")).toBeInTheDocument();
    expect(screen.getByText("SELL")).toBeInTheDocument();
    expect(screen.getByText("Limit")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Transaction Summary")).toBeInTheDocument();
  });

  test("updates state when inputs change", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const priceInput = screen.getByLabelText("Price");
    const quantityInput = screen.getByLabelText("Quantity");

    fireEvent.change(priceInput, { target: { value: "70000" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });

    expect(priceInput).toHaveValue(70000);
    expect(quantityInput).toHaveValue(2);
    expect(screen.getByText("$140000.00")).toBeInTheDocument();
  });

  test("displays validation error for invalid order", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const priceInput = screen.getByLabelText("Price");
    const quantityInput = screen.getByLabelText("Quantity");

    fireEvent.change(priceInput, { target: { value: "" } });
    fireEvent.change(quantityInput, { target: { value: "" } });

    const errorText = screen.getByText("Please enter quantity");
    expect(errorText).toBeInTheDocument();
  });

  test("handles side changes correctly", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const buyButton = screen.getByText("BUY");
    const sellButton = screen.getByText("SELL");

    fireEvent.click(sellButton);
    expect(sellButton).toHaveClass("bg-red-600");
    expect(buyButton).toHaveClass("bg-gray-800");

    fireEvent.click(buyButton);
    expect(buyButton).toHaveClass("bg-green-600");
    expect(sellButton).toHaveClass("bg-gray-800");
  });

  test("formats total correctly when total is large", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const priceInput = screen.getByLabelText("Price");
    const quantityInput = screen.getByLabelText("Quantity");

    fireEvent.change(priceInput, { target: { value: "100000000" } });
    fireEvent.change(quantityInput, { target: { value: "1000000" } });

    expect(screen.getByText("1000000000...")).toBeInTheDocument();
  });

  test("Price input is not present when Market tab is enabled", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const marketTab = screen.getByText("Market");
    fireEvent.click(marketTab);

    expect(screen.queryByLabelText("Price")).not.toBeInTheDocument();
  });

  test("Switching between Market and Limit tabs works correctly", () => {
    render(
      <OrderProvider>
        <OrderSection selectedAsset={selectedAsset} onNewOrder={jest.fn()} />
      </OrderProvider>
    );

    const limitTab = screen.getByText("Limit");
    const marketTab = screen.getByText("Market");

    fireEvent.click(marketTab);
    expect(marketTab).toHaveClass("text-blue-400");
    expect(limitTab).toHaveClass("text-gray-500");
    expect(screen.queryByLabelText("Price")).not.toBeInTheDocument();

    fireEvent.click(limitTab);
    expect(limitTab).toHaveClass("text-blue-400");
    expect(marketTab).toHaveClass("text-gray-500");
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });
});

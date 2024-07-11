import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OrderBook from "./OrderBook";
import { useOrderContext } from "../OrderSection/OrderContext";
import axios from "axios";

jest.mock("axios");
jest.mock("../OrderSection/OrderContext", () => ({
  useOrderContext: jest.fn(),
}));

const mockOrderBookData = {
  bids: [
    ["30000", "0.5"],
    ["29900", "1.2"],
  ],
  asks: [
    ["31000", "0.3"],
    ["32000", "0.8"],
  ],
};

describe("OrderBook component", () => {
  let handlePriceClick;

  beforeEach(() => {
    handlePriceClick = jest.fn();
    useOrderContext.mockReturnValue({ handlePriceClick });
  });

  test("renders loading state initially", () => {
    render(<OrderBook selectedAsset={{ symbol: "BTC-USD" }} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      render(<OrderBook selectedAsset={{ symbol: "BTC-USD" }} />);
    });

    await waitFor(() =>
      expect(screen.getByText("Error: Network Error")).toBeInTheDocument()
    );
  });

  test("renders order book data", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrderBookData });

    await act(async () => {
      render(<OrderBook selectedAsset={{ symbol: "BTC-USD" }} />);
    });

    await waitFor(() => {
      expect(screen.getByText("30000.00")).toBeInTheDocument();
      expect(screen.getByText("0.50000")).toBeInTheDocument();
      expect(screen.getByText("31000.00")).toBeInTheDocument();
      expect(screen.getByText("0.30000")).toBeInTheDocument();
    });
  });

  test("handles price click", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrderBookData });

    await act(async () => {
      render(<OrderBook selectedAsset={{ symbol: "BTC-USD" }} />);
    });

    await waitFor(() => {
      const priceElement = screen.getByText("30000.00");
      fireEvent.click(priceElement);
    });

    await waitFor(() => {
      expect(handlePriceClick).toHaveBeenCalledWith("buy", 30000);
    });
  });
});

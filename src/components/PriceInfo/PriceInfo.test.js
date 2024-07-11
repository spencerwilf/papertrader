import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PriceInfo from "./PriceInfo";
import "@testing-library/jest-dom";


const mockAssets = [
  { symbol: "BTC-USD", logo: "btc-logo.png" },
  { symbol: "ETH-USD", logo: "eth-logo.png" },
];

describe("PriceInfo component", () => {
  let selectedAsset;
  let setSelectedAsset;

  beforeEach(() => {
    selectedAsset = mockAssets[0];
    setSelectedAsset = jest.fn();
  });

  test("renders the asset names correctly", () => {
    render(
      <PriceInfo
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        assets={mockAssets}
      />
    );

    expect(screen.getByText("BTC-USD")).toBeInTheDocument();
  });

  test("switches between assets correctly", () => {
    render(
      <PriceInfo
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        assets={mockAssets}
      />
    );

    fireEvent.click(screen.getByText("BTC-USD"));

    expect(screen.getByText("ETH-USD")).toBeInTheDocument();

    fireEvent.click(screen.getByText("ETH-USD"));

    expect(setSelectedAsset).toHaveBeenCalledWith("ETH-USD");
  });
});

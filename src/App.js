import React, { useState, useCallback, useMemo } from "react";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import PriceInfo from "./components/PriceInfo/PriceInfo";
import OrderSection from "./components/OrderSection/OrderSection";
import OrderBook from "./components/OrderBook/OrderBook";
import ChartWrapper from "./components/Chart/ChartWrapper";
import UserOrders from "./components/UserOrders/UserOrders";

const assetsData = [
  {
    symbol: "BTC-USD",
    price: 66000,
    logo: "btc-logo.png",
  },
  {
    symbol: "ETH-USD",
    price: 3100,
    logo: "eth-logo.png",
  },
];

function App() {
  const [selectedAsset, setSelectedAsset] = useState("BTC-USD");
  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });
  const [clickedPrice, setClickedPrice] = useState(null);
  const [clickedSide, setClickedSide] = useState(null);

  const handleNewOrder = useCallback((newOrder) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);

  const handleDeleteOrder = useCallback((orderId) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.filter((order) => order.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  }, []);

  const handlePriceClick = useCallback((side, price) => {
    setClickedSide(side);
    setClickedPrice(price);
  }, []);

  const selectedAssetDetails = useMemo(() => {
    return assetsData.find((asset) => asset.symbol === selectedAsset);
  }, [selectedAsset]);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center px-4 font-Lato">
      <NavBar />
      <div className="flex flex-col items-center w-full max-w-screen-xl">
        <PriceInfo
          assets={assetsData}
          selectedAsset={selectedAssetDetails}
          setSelectedAsset={setSelectedAsset}
        />
        <div className="flex mt-4 space-x-4 w-full justify-center">
          <OrderSection
            selectedAsset={selectedAssetDetails}
            onNewOrder={handleNewOrder}
            initialPrice={clickedPrice}
            initialSide={clickedSide}
          />
          <ChartWrapper selectedAsset={selectedAssetDetails} />
          <OrderBook
            selectedAsset={selectedAssetDetails}
            onPriceClick={handlePriceClick}
          />
        </div>
        <UserOrders orders={orders} onDeleteOrder={handleDeleteOrder} />
      </div>
    </div>
  );
}

export default App;

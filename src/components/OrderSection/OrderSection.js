import React, { useEffect, useState, useCallback } from "react";
import ExecuteOrder from "./ExecuteOrder";
import { useOrderContext } from "./OrderContext";

const MAX_PRICE = 999999999;
const MAX_AMOUNT = 9999999999;

const OrderSection = ({ selectedAsset, onNewOrder }) => {
  const { clickedPrice, clickedSide, isModalOpen, closeModal } =
    useOrderContext();
  const [price, setPrice] = useState(selectedAsset.price);
  const [orderType, setOrderType] = useState("limit");
  const [amount, setAmount] = useState(1);
  const [total, setTotal] = useState(price * amount);
  const [activeTab, setActiveTab] = useState("buy");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setPrice(clickedPrice || selectedAsset.price);
    setActiveTab(clickedSide || "buy");
  }, [clickedPrice, clickedSide, selectedAsset]);

  useEffect(() => {
    setTotal(price * amount);
  }, [price, amount]);

  const validateOrder = useCallback(() => {
    if (!selectedAsset.symbol) return "Asset is missing";
    if (!activeTab) return "Order type is missing";
    if (!amount) return "Please enter quantity";
    if (amount <= 0) return "Quantity is invalid";
    if (!price || price <= 0) return "Please enter a valid order price";
    if (String(price).length >= 10) return "Insufficient liquidity";
    if (!total || total <= 0.01) return "Please enter an order above $0.01";
    return null;
  }, [selectedAsset, activeTab, amount, price, total]);

  useEffect(() => {
    setValidationError(validateOrder());
  }, [validateOrder]);

  const handleAmountChange = useCallback(
    (event) => {
      const value = event.target.value;
      if (value === "" || parseFloat(value) <= MAX_AMOUNT) {
        setAmount(value ? parseFloat(value) : "");
        setTotal(value ? price * parseFloat(value) : 0);
      }
    },
    [price]
  );

  const handlePriceChange = useCallback((event) => {
    const value = event.target.value;
    if (value === "" || parseFloat(value) <= MAX_PRICE) {
      setPrice(value ? parseFloat(value) : "");
    }
  }, []);

  const formatTotal = useCallback((total) => {
    const totalStr = total.toFixed(2);
    return totalStr.length > 10 ? `${totalStr.slice(0, 10)}...` : totalStr;
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 order-section-container">
      <div className="flex mb-4">
        <button
          className={`w-1/2 py-2 ${
            activeTab === "buy" ? "bg-green-600" : "bg-gray-800"
          } rounded-l-lg`}
          onClick={() => setActiveTab("buy")}
        >
          BUY
        </button>
        <button
          className={`w-1/2 py-2 ${
            activeTab === "sell" ? "bg-red-600" : "bg-gray-800"
          } rounded-r-lg`}
          onClick={() => setActiveTab("sell")}
        >
          SELL
        </button>
      </div>

      <div className="flex justify-around mb-4">
        {["Limit", "Market"].map((type) => (
          <button
            key={type}
            className={`py-2 px-4 ${
              orderType === type.toLowerCase()
                ? "text-blue-400"
                : "text-gray-500"
            }`}
            onClick={() => setOrderType(type.toLowerCase())}
          >
            {type}
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div className="flex flex-col">
              <label htmlFor="price" className="block text-gray-400 mb-1">
                Price
              </label>
              <span
                onClick={() => setPrice(selectedAsset.price)}
                className="text-xs flex items-center text-gray-400"
              >
                <span className="text-blue-400 cursor-pointer">Latest</span>
              </span>
            </div>
            <input
              id="price"
              type="number"
              value={price}
              onChange={handlePriceChange}
              max={MAX_PRICE}
              className="bg-transparent text-2xl text-white focus:outline-none w-full text-right"
            />
            <span className="ml-2 text-gray-500">USD</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
          <label htmlFor="quantity" className="block text-gray-400">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            max={MAX_AMOUNT}
            className="bg-transparent text-2xl text-white focus:outline-none w-full text-right"
          />
          <span className="ml-2 text-gray-500">
            {selectedAsset.symbol.split("-")[0]}
          </span>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="range"
          min="0"
          max="10"
          step="0.01"
          value={amount}
          onChange={handleAmountChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
          <label htmlFor="total" className="block text-gray-400">
            Total
          </label>
          <span className="text-2xl text-white">
            {!isNaN(total) ? formatTotal(total) : " "}
          </span>
          <span className="ml-2 text-gray-500">USD</span>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-gray-400 mb-2">Transaction Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Entry Price</span>
          <span>{`${
            !isNaN(price) ? "$" + parseFloat(price).toFixed(2) : " "
          }`}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Cost</span>
          <span>{`${!isNaN(total) ? "$" + total.toFixed(2) : " "}`}</span>
        </div>
      </div>

      {validationError ? (
        <p className="text-red-500 text-center mt-4">{validationError}</p>
      ) : (
        <ExecuteOrder
          asset={selectedAsset.symbol}
          side={activeTab}
          type={orderType}
          quantity={amount}
          price={price}
          notional={total}
          validationError={validationError}
          onNewOrder={onNewOrder}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default OrderSection;

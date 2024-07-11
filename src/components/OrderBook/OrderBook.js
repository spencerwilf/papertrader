import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOrderContext } from "../OrderSection/OrderContext";

const OrderBook = ({ selectedAsset }) => {
  const { handlePriceClick } = useOrderContext();
  const [orderBookData, setOrderBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderBookData = async () => {
      try {
        const response = await axios.get(
          `https://papertrader.vercel.app/orderbook/${
            selectedAsset.symbol.split("-")[0]
          }`
        );
        setOrderBookData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrderBookData();
  }, [selectedAsset]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center">Error: {error.message}</p>;

  const { bids, asks } = orderBookData;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-96 h-[610px] overflow-y-scroll scrollbar-hide">
      <div className="text-center mb-4">
        <span className="text-white text-lg">Order Book</span>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <div className="flex justify-between text-gray-400 text-xs">
            <div className="text-left">Price (USD)</div>
            <div className="text-right">
              Qty ({selectedAsset.symbol.split("-")[0]})
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {asks.map((ask, index) => (
              <div
                key={index}
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handlePriceClick("sell", parseFloat(ask[0]))}
              >
                <span className="text-sm text-red-500 hover:underline hover:text-red-700">
                  {parseFloat(ask[0]).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">
                  {parseFloat(ask[1]).toFixed(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-px bg-gray-600"></div> {/* Separator line */}
        <div className="w-1/2">
          <div className="flex justify-between text-gray-400 text-xs">
            <div className="text-left">Price (USD)</div>
            <div className="text-right">
              Qty ({selectedAsset.symbol.split("-")[0]})
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {bids.map((bid, index) => (
              <div
                key={index}
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handlePriceClick("buy", parseFloat(bid[0]))}
              >
                <span className="text-sm text-green-500 hover:underline hover:text-green-700">
                  {parseFloat(bid[0]).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">
                  {parseFloat(bid[1]).toFixed(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

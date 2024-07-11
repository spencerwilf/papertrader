import React, { useEffect, useState, useRef, memo } from "react";

const TradingViewWidget = ({ selectedAsset }) => {
  const container = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const containerElement = container.current;
    const { symbol } = selectedAsset;

    const appendScript = () => {
      while (containerElement.firstChild) {
        containerElement.removeChild(containerElement.firstChild);
      }

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      const chartConfig = {
        autosize: true,
        symbol: symbol === "BTC-USD" ? "COINBASE:BTCUSD" : "COINBASE:ETHUSD",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: false,
        calendar: false,
        support_host: "https://www.tradingview.com",
      };

      script.innerHTML = JSON.stringify(chartConfig);
      containerElement.appendChild(script);
      setLoading(false); // Moved here for accurate loading state
    };

    const timeoutId = setTimeout(appendScript, 300);

    return () => {
      clearTimeout(timeoutId);
      while (containerElement.firstChild) {
        containerElement.removeChild(containerElement.firstChild);
      }
    };
  }, [selectedAsset, setLoading]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default memo(TradingViewWidget);

import React, { useState, useEffect, memo } from "react";
import Chart from "./Chart";
import { quantum } from "ldrs";

quantum.register();

const ChartWrapper = ({ selectedAsset }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Display loading text for 2 seconds

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <div className="chart-wrapper h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <l-quantum size="100" speed="5.5" color="#44E3F8"></l-quantum>
        </div>
      ) : (
        <Chart selectedAsset={selectedAsset} />
      )}
    </div>
  );
};

export default memo(ChartWrapper);

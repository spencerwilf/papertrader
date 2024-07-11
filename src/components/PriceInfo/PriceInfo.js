import React, { useState, useEffect, useRef, useCallback } from "react";

const PriceInfo = ({ selectedAsset, setSelectedAsset, assets }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="relative bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full mt-4"
      ref={dropdownRef}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center">
          <img
            src={selectedAsset.logo}
            alt={`${selectedAsset.symbol} logo`}
            className="w-8 h-8 mr-2"
          />
          <span className="text-2xl font-semibold">{selectedAsset.symbol}</span>
          <svg
            className={`w-5 h-5 ml-2 transition-transform ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-full bg-gray-700 text-white rounded-lg shadow-lg z-10">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex justify-between p-4 hover:bg-gray-600 cursor-pointer rounded-lg"
              onClick={() => {
                setSelectedAsset(asset.symbol);
                setIsDropdownOpen(false);
              }}
            >
              <div className="flex items-center">
                <img
                  src={asset.logo}
                  alt={`${asset.symbol} logo`}
                  className="w-6 h-6 mr-2"
                />
                <span>{asset.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceInfo;

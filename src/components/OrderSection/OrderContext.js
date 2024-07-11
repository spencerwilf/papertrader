import React, { createContext, useState, useContext, useMemo } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [state, setState] = useState({
    clickedPrice: null,
    clickedSide: null,
    isModalOpen: false,
  });

  const handlePriceClick = (side, price) => {
    setState({ clickedSide: side, clickedPrice: price, isModalOpen: true });
  };

  const closeModal = () => {
    setState((prevState) => ({ ...prevState, isModalOpen: false }));
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      handlePriceClick,
      closeModal,
    }),
    [state]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);

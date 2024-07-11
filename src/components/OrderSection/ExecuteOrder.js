import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import ConfirmationModal from "./OrderModal";

const ExecuteOrder = ({
  asset,
  side,
  type,
  quantity,
  price,
  notional,
  validationError,
  onNewOrder,
  isModalOpen,
  closeModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: isModalOpen,
    onClose: closeModal,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (isModalOpen) {
      onOpen();
    }
  }, [isModalOpen, onOpen]);

  const execute = async () => {
    setIsLoading(true);
    let response;

    try {
      type === "limit"
        ? (response = await axios.post("http://localhost:3001/trade", {
            asset,
            side,
            type,
            quantity,
            price,
            notional,
          }))
        : (response = await axios.post("http://localhost:3001/trade", {
            asset,
            side,
            type,
            quantity,
            notional,
          }));

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { id, timestamp } = response.data;

      const newOrder = {
        asset,
        side,
        type,
        quantity,
        price,
        notional,
        id,
        timestamp,
      };

      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, newOrder])
      );

      onNewOrder(newOrder);

      setIsLoading(false);
      onClose();

      toast({
        title: "Order(s) submitted successfully!",
        description: `${quantity} ${asset.split("-")[0]} will be ${
          side === "buy" ? "bought" : "sold"
        } at $${price}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      setIsLoading(false);

      toast({
        title: "Error placing order",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={side === "buy" ? "green" : "red"}
        isLoading={isLoading}
        isDisabled={isLoading || validationError}
        className="w-full py-3 rounded-lg shadow-lg transition duration-300 text-white"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-3 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : side === "buy" ? (
          `Place ${capitalize(type)} Buy`
        ) : (
          `Place ${capitalize(type)} Sell`
        )}
      </Button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={execute}
        isLoading={isLoading}
        orderDetails={{ asset, side, type, quantity, price, notional }}
      />
    </>
  );
};

export default ExecuteOrder;

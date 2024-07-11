import React, { useCallback } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
} from "@chakra-ui/react";

const OrderDetailRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" mb={4}>
    <Text color="gray.400" w="50%">
      {label}
    </Text>
    <Text>{value}</Text>
  </Box>
);

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  orderDetails,
}) => {
  const capitalize = useCallback(
    (string) => string.charAt(0).toUpperCase() + string.slice(1),
    []
  );

  const { side, type, asset, price, quantity, notional } = orderDetails;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="gray.800"
        color="white"
        borderRadius="md"
        p={4}
        maxW="400px"
      >
        <ModalHeader fontSize="lg" fontWeight="bold">
          <Text color={side === "buy" ? "green.400" : "red.400"}>
            {capitalize(type)} {capitalize(side)}
          </Text>{" "}
          {asset}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <OrderDetailRow label="Order Price" value={`$${price}`} />
          <OrderDetailRow
            label="Qty"
            value={`${quantity} ${asset.split("-")[0]}`}
          />
          <OrderDetailRow
            label="Order Value"
            value={`${notional.toFixed(2)} USD`}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={side === "buy" ? "green" : "red"}
            onClick={onConfirm}
            isLoading={isLoading}
            w="100%"
            mr={3}
          >
            {capitalize(side)} {asset.split("-")[0]}
          </Button>
          <Button colorScheme="gray" onClick={onClose} w="100%">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

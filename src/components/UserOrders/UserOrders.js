import React, { useCallback, memo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Center,
  Button,
} from "@chakra-ui/react";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const formatOrderSide = (side) => side.charAt(0).toUpperCase() + side.slice(1);

const UserOrders = ({ orders, onDeleteOrder }) => {
  const handleDeleteOrder = useCallback(
    (orderId) => {
      onDeleteOrder(orderId);
    },
    [onDeleteOrder]
  );

  return (
    <Box
      bg="gray.900"
      color="white"
      p={4}
      rounded="md"
      shadow="lg"
      mt={4}
      mb={4}
      w="100%"
    >
      <Box bg="gray.900" p={4} rounded="md">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Current Orders ({orders.length})
        </Text>
        <Table variant="unstyled" size="md">
          <Thead>
            <Tr>
              <Th color="gray.400">Pair</Th>
              <Th color="gray.400">Type</Th>
              <Th color="gray.400">Direction</Th>
              <Th color="gray.400">Value</Th>
              <Th color="gray.400">Price</Th>
              <Th color="gray.400">Quantity</Th>
              <Th color="gray.400">Time</Th>
              <Th color="gray.400">ID</Th>
              <Th color="gray.400">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.length === 0 ? (
              <Tr>
                <Td colSpan="9">
                  <Center>
                    <Box textAlign="center" py={10}>
                      <Text>No Records Found</Text>
                    </Box>
                  </Center>
                </Td>
              </Tr>
            ) : (
              orders.map((order) => (
                <Tr
                  key={order.id}
                  sx={{ _hover: { backgroundColor: "gray.700" } }}
                >
                  <Td>{order.asset.split("-").join("/")}</Td>
                  <Td>{capitalize(order.type)}</Td>
                  <Td>
                    <Text
                      color={order.side === "buy" ? "green.400" : "red.400"}
                    >
                      {formatOrderSide(order.side)}
                    </Text>
                  </Td>
                  <Td>${order.notional.toFixed(2)}</Td>
                  <Td>${order.price}</Td>
                  <Td>{order.quantity}</Td>
                  <Td>{new Date(order.timestamp).toLocaleString()}</Td>
                  <Td>{order.id}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Cancel
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default memo(UserOrders);

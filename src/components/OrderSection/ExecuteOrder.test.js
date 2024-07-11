import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ExecuteOrder from "./ExecuteOrder";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";

jest.mock("axios");

describe("ExecuteOrder component", () => {
  const props = {
    asset: "BTC-USD",
    side: "buy",
    type: "limit",
    quantity: 1,
    price: 65000,
    notional: 65000,
    validationError: null,
    onNewOrder: jest.fn(),
    isModalOpen: false,
    closeModal: jest.fn(),
  };

  test("renders the button correctly", () => {
    render(
      <ChakraProvider>
        <ExecuteOrder {...props} />
      </ChakraProvider>
    );

    expect(screen.getByText("Place Limit Buy")).toBeInTheDocument();
  });

  test("opens the modal when the button is clicked", async () => {
    render(
      <ChakraProvider>
        <ExecuteOrder {...props} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText("Place Limit Buy"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check modal content
    expect(screen.getByText(/Order Price/i)).toBeInTheDocument();
  });


  test("shows loading state correctly", async () => {
    axios.post.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { id: "123", timestamp: new Date().toISOString() } });
        }, 2000);
      });
    });

    render(
      <ChakraProvider>
        <ExecuteOrder {...props} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText("Place Limit Buy"));

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Buy BTC"));

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  
  test("displays error toast notification", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <ChakraProvider>
        <ExecuteOrder {...props} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText("Place Limit Buy"));

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Buy BTC"));

    await waitFor(() =>
      expect(screen.getByText("Error placing order")).toBeInTheDocument()
    );
  });
});

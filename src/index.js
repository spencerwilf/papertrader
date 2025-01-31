import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { OrderProvider } from './components/OrderSection/OrderContext';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <OrderProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </OrderProvider>
  </React.StrictMode>
);
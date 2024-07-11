const express = require('express')
const { v4: uuidv4 } = require('uuid');

const app = express()
const port = 3001
const cors = require("cors");

const btcOrderbook = require('./data/btc_orderbook.json');
const ethOrderbook = require('./data/eth_orderbook.json');

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


app.get('/orderbook/:asset?', (req, res) => {
    const asset = req.params.asset?.toUpperCase() || "BTC";
    switch(asset) {
        case "BTC":
            res.json(btcOrderbook);
        case "ETH":
            res.json(ethOrderbook);
    }
})


app.post('/trade/', (req, res) => {
    const order = req.body;
    console.log(req.body)

    // Validations
    if (!order.asset) {
        res.status('422').send({error: 'Asset is missing'});
    }

    if (!order.side) {
        res.status('422').send({error: 'Side is missing'});
    }

    if (order.quantity <= 0) {
        res.status('422').send({error: 'Quantity is invalid'});
    }

    order.type = order.type || "LIMIT"; // default to LIMIT
    if (order.type?.toUpperCase() === "LIMIT" && (!order.price || order.price <= 0)) {
        res.status('422').send({error: 'Price is invalid for LIMIT order'});
    }
    if (order.type?.toUpperCase() === "MARKET" && (order.price)) {
        res.status('422').send({error: 'Price shouldn\'t be provided for MARKET order'});
    }

    if (order.notional <= 0) {
        res.status('422').send({error: 'Notional is invalid'});
    }

    res.send({
        ...order,
        id: uuidv4(),
        timestamp: Date.now()
    })
})

app.listen(port, () => {
  console.log(`Mock server listening on port ${port}`)
})
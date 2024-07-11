const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const port = 3001;

const btcOrderbook = require("./data/btc_orderbook.json");
const ethOrderbook = require("./data/eth_orderbook.json");

app.use(express.json());

// Update CORS to allow requests from your Vercel domain
app.use(
  cors({
    origin: ["http://localhost:3000", "https://papertrader.vercel.app"],
  })
);

app.get("/orderbook/:asset?", (req, res) => {
  const asset = req.params.asset?.toUpperCase() || "BTC";
  switch (asset) {
    case "BTC":
      return res.json(btcOrderbook);
    case "ETH":
      return res.json(ethOrderbook);
    default:
      return res.status(404).send({ error: "Asset not found" });
  }
});

app.post("/trade", (req, res) => {
  const order = req.body;
  console.log(req.body);

  // Validations
  if (!order.asset) {
    return res.status(422).send({ error: "Asset is missing" });
  }
  if (!order.side) {
    return res.status(422).send({ error: "Side is missing" });
  }
  if (order.quantity <= 0) {
    return res.status(422).send({ error: "Quantity is invalid" });
  }

  order.type = order.type || "LIMIT"; // default to LIMIT
  if (
    order.type.toUpperCase() === "LIMIT" &&
    (!order.price || order.price <= 0)
  ) {
    return res.status(422).send({ error: "Price is invalid for LIMIT order" });
  }
  if (order.type.toUpperCase() === "MARKET" && order.price) {
    return res
      .status(422)
      .send({ error: "Price shouldn't be provided for MARKET order" });
  }

  if (order.notional <= 0) {
    return res.status(422).send({ error: "Notional is invalid" });
  }

  res.send({
    ...order,
    id: uuidv4(),
    timestamp: Date.now(),
  });
});

app.listen(port, () => {
  console.log(`Mock server listening on port ${port}`);
});

const express = require("express");
const app = express();

app.use(express.json());

const inventory = [
  { productId: "sku-001", inStock: true, quantity: 42 },
  { productId: "sku-002", inStock: true, quantity: 15 },
  { productId: "sku-003", inStock: false, quantity: 0 },
  { productId: "sku-004", inStock: true, quantity: 8 },
  { productId: "sku-005", inStock: true, quantity: 27 },
];

app.get("/inventory", (req, res) => {
  res.json(inventory);
});

app.post("/inventory", (req, res) => {
  const idExists = inventory.find((p) => p.id === req.body.id);
  if (idExists) return res.status(409).send("Inventory exists");

  inventory.push(req.body);
  res.status(201).end();
});

app.listen(3001, () => console.log("Inventory service is running on 3001"));

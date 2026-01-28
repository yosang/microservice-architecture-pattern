const express = require("express");
const app = express();

app.use(express.json());

const products = [
  { id: "sku-001", name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99 },
  { id: "sku-002", name: "Mechanical Keyboard", description: "RGB backlit keyboard", price: 79.99 },
  { id: "sku-003", name: "USB-C Hub", description: "Multiport adapter for laptops", price: 49.99 },
  { id: "sku-004", name: "Gaming Headset", description: "Surround sound, noise-cancelling mic", price: 59.99 },
  { id: "sku-005", name: "Webcam HD", description: "1080p video streaming webcam", price: 39.99 },
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const idExists = products.find((p) => p.id === req.body.id);
  if (idExists) return res.status(409).send("Product exists");

  products.push(req.body);
  res.status(201).end();
});

app.listen(3000, () => console.log("Products service is running on 3000"));

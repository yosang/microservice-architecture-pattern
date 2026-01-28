const express = require("express");
const dataSet = require("./data.json");
const app = express();

app.use(express.json());

const products = dataSet;

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

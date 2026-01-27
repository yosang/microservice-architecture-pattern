const express = require("express");
const app = express();

app.use(express.json());

const reviews = [
  { productId: "sku-001", averageRating: 4.6 },
  { productId: "sku-002", averageRating: 4.8 },
  { productId: "sku-003", averageRating: 4.2 },
  { productId: "sku-004", averageRating: 4.7 },
  { productId: "sku-005", averageRating: 4.3 },
];

app.get("/reviews", (req, res) => {
  res.json(reviews);
});

app.post("/reviews", (req, res) => {
  const idExists = reviews.find((p) => p.id === req.body.id);
  if (idExists) return res.status(409).send("Review exists");

  reviews.push(req.body);
  res.status(201).end();
});

app.listen(3002, () => console.log("Reviews service is running on 3002"));

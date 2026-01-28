const express = require("express");
const dataSet = require("./data.json");
const app = express();

app.use(express.json());

const reviews = dataSet;

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

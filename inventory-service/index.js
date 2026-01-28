const express = require("express");
const dataSet = require("./data.json");
const app = express();

app.use(express.json());

const inventory = dataSet;

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

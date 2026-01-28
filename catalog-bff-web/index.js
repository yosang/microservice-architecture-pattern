const express = require("express");
const app = express();
const fetchAll = require("./fetchAll");
app.use(express.json());

app.get("/products", async (_, res) => {
  try {
    const data = await fetchAll();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const data = await fetchAll();

    const match = data.find((item) => item.id === req.params.id);

    if (!match) return res.status(404).json({ status: 404, result: "Product not found" });

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, error: "Internal Server Error" });
  }
});

// Add the ability to add data to the microservices
// app.post("/catalog", () => {});

app.use((req, res, next) => res.status(404).json({status:404, result:"Service not found"}))

app.listen(3003, () => console.log("Products Catalog Web BFF service is running on 3003"));

const express = require("express");
const app = express();
const compression = require("compression");
const fetchAll = require("./fetchAll");
app.use(express.json());
app.use(compression());
const cache = {};
const cache_ttl = 300000;

app.get("/catalog", async (req, res) => {
  const cacheKey = "dataFetch";
  let data = cache[cacheKey];

  if (!data || isCacheExpired(cacheKey)) {
    try {
      data = await fetchAll(req);
      setCache(cacheKey, data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
  }

  res.status(200).json({ status: 200, result: data });
});

app.get("/catalog/:id", async (req, res) => {
  const cacheKey = "dataFetch";
  let data = cache[cacheKey];

  if (!data || isCacheExpired(cacheKey)) {
    data = await fetchAll(req);
    setCache(data);

    try {
      data = await fetchAll(req);
      setCache(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
  }

  const match = data.items.find((item) => item.id === req.params.id);
  if (!match) return res.status(404).json({ status: 404, result: "Product not found" });

  res.status(200).json(match);
});

// Add the ability to add data to the microservices
// app.post("/catalog", () => {});

// Cache helper functions
function getCache(key) {
  if (!cache[key]) return null;
  return cache[key];
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

function isCacheExpired(key) {
  const cacheEntry = cache[key];
  if (!cacheEntry) return true; // return true if the key does not exist in the cache
  return Date.now() - cacheEntry.timestamp > cache_ttl;
}

app.listen(3004, () => console.log("BFF service is running on 3004"));

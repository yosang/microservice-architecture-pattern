const express = require("express");
const app = express();
const cors = require("cors");
const prefix = "api";
const version = "v1";
const morgan = require("morgan");

const { rateLimit } = require("express-rate-limit");
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min window between each request
  limit: 100, // limited to 100 requests
  message: { status: 429, error: "Too many requests" },
  statusCode: 429,
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimiter); // we can either use it globally or add it as a middleware to specific endpoints

const services = {
  web: { port: 3003 }, // /web/products > 3003/products
  mobile: { port: 3004 }, // /mobile/products > 3004/products
};

const route = async (req, res, serviceName) => {
  const service = services[serviceName];
  if (!service) return res.status(404).json({ status: 404, result: "Service not found" });

  const path = req.originalUrl.replace(`/${prefix}/${version}/${serviceName}`, "");

  const headers = { ...req.headers };
  const url = `http://localhost:${service.port}${path}`;
  delete headers["content-length"];

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...headers,
        host: `http://localhost:${service.port}`,
      },
      body: req.method === "GET" && req.method === "HEAD" ? null : JSON.stringify(req.body), // If we are only using GET and HEAD, dont send a body, send a body otherwise
    });

    const isJSON = response.headers.get("Content-Type").includes("application/json");

    if (isJSON) return res.json(await response.json());

    res.send(await response.text());
  } catch (err) {
    console.log("Error routing request", err);

    res.status(500).json({ status: 500, error: err.message });
  }
};

Object.keys(services).forEach((service) => {
  app.use(`/${prefix}/${version}/${service}`, (req, res) => {
    route(req, res, service);
  });
});

app.use((req, res, next) => {
  res.status(404).json({ status: 404, result: "Service not found" });
});

app.listen(5000, () => console.log("Gateway is running on port 5000"));

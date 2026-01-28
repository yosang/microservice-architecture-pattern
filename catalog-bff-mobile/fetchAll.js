const fetchData = require("./fetchData");

module.exports = async (req) => {
  try {
    // Query features
    const { limit = 10, offset = 0 } = req.query || {};

    const [products, inventory, reviews] = await Promise.all([fetchData("http://localhost:3000/products"), fetchData("http://localhost:3001/inventory"), fetchData("http://localhost:3002/reviews")]);

    // Lookup table
    const productMap = Object.fromEntries(products.map((p) => [p.id, p])); // Object from entries - ["sku-001", { id: "sku-001"...}]
    const reviewsMap = Object.fromEntries(reviews.map((r) => [r.productId, r]));
    const data = inventory.slice(Number(offset), Number(offset) + Number(limit)).map((item) => {
      // offset = how many items to skip from, limit = how many items to return after skipping
      // offset=0&limit=20 - items 0 - 19 - page 1
      // offset=20&limit=20 - items 20 - 39 - page 2
      // offset=0&limit=10 - items 0 - 9 - first 10 items

      const product = productMap[item.productId];
      const review = reviewsMap[item.productId];

      delete review.productId;

      return {
        ...product,
        availability: {
          inStock: item.inStock,
          quantity: item.quantity,
        },
        ...review,
      };
    });
    return {
      items: data,
      pagination: {
        offset: Number(offset),
        limit: Number(limit),
        total: inventory.length,
      },
    };
  } catch (err) {
    throw err;
  }
};

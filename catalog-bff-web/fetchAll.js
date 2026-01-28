const fetchData = require("./fetchData");

module.exports = async () => {
  try {
    const [products, inventory, reviews] = await Promise.all([fetchData("http://localhost:3000/products"), fetchData("http://localhost:3001/inventory"), fetchData("http://localhost:3002/reviews")]);
    // console.log(products);
    // console.log(inventory);
    // console.log(reviews);
    // Lookup table
    const productMap = {};
    for (const prod of products) {
      productMap[prod.id] = prod;
    }

    const reviewMap = {};

    for (const rev of reviews) {
      reviewMap[rev.productId] = rev;
    }

    // Merge inventory + products + reviews
    const data = inventory.map((item) => {
      const product = productMap[item.productId];
      const review = reviewMap[item.productId];

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

    return data;
  } catch (err) {
    throw err;
  }
};

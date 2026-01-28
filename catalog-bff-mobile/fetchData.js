// Returns a promise
module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    if (!response.ok) reject(new Error("Unable to fetch: ", response.status));

    const data = await response.json();
    resolve(data);
  });
};

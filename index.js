const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

app.get("/products", async (req, res) => {
  try {
    const products = await client.query("SELECT * FROM products;");
    res.header("Content-Type", "application/json");
    res.status(200);
    return res.json({ data: products.rows });
  } catch (e) {
    console.error(e);
    res.status(500);
    return res.json({ error: "Internal server error" });
  }
});

app.all("*", (req, res) => {
  return res.json({ data: "Hello world!" });
});

process.env.PORT = process.env.PORT || 3000;
const port = process.env.PORT;
module.exports = app.listen(port, () => {
  console.log(`Backend server started`);
});

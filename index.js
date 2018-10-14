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

app.get("/pginfo", async (req, res) => {
  const pginfo = await client.query(
    "SELECT table_schema,table_name FROM information_schema.tables;"
  );
  res.header("Content-Type", "application/json");
  res.send({ data: pginfo.rows });
});

app.get("/products", async (req, res) => {
  try {
    const products = await client.query("SELECT * FROM products;");
    res.header("Content-Type", "application/json");
    res.send({ data: products.rows });
  } catch (e) {
    console.error(e);
    res.end();
    return;
  }
});

process.env.PORT = process.env.PORT || 3000;
const port = process.env.PORT;
module.exports = app.listen(port, () => {
  console.log(`Backend server started`);
});

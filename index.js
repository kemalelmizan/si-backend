const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authorization
app.use(function(req, res, next) {
  if (req.headers.authorization !== process.env.API_TOKEN) {
    res.status(400);
    return res.json({ error: "No credentials sent!" });
  }
  next();
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL || false
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

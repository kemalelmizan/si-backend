const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Authorization
app.use((req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization !== process.env.API_TOKEN
  ) {
    res.status(400);
    return res.json({ error: "Unauthorized (0)" });
  }
  next();
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL || false
});

client.connect();

// User Authorization
// Populating empty tokens
(async () => {
  const usersWithEmptyAccessTokens = await client.query(
    "SELECT id FROM users WHERE access_token IS NULL;"
  );
  usersWithEmptyAccessTokens.rows.map(async row => {
    const token64 = Array(64)
      .fill(0)
      .map(() =>
        Math.random()
          .toString(36)
          .charAt(2)
      )
      .join("");
    try {
      const createdToken = await client.query(
        "UPDATE users SET access_token=($1) WHERE id=($2) AND access_token IS NULL RETURNING access_token;",
        [token64, row.id]
      );
      console.log(`Populated token for userId:${row.id}`);
    } catch (e) {
      console.error(e);
    }
  });
})();

// Token Authorization - Using DB. Warning: not scalable.
app.use(async (req, res, next) => {
  if (
    req.headers.user_email === undefined ||
    req.headers.access_token === undefined
  ) {
    res.status(400);
    return res.json({ error: "Unauthorized (1)" });
  } else {
    // queries DB token
    try {
      const dbresp = await client.query(
        "SELECT access_token FROM users WHERE email=($1);",
        [req.headers.user_email]
      );
      // wrong email
      if (dbresp.rows.length === 0) {
        res.status(400);
        return res.json({ error: "Unauthorized (2)" });
      }
      // wrong access_token
      if (req.headers.access_token !== dbresp.rows[0].access_token) {
        res.status(400);
        return res.json({ error: "Unauthorized (3)" });
      }
    } catch (e) {
      console.error(e);
      res.status(400);
      return res.json({ error: "Unauthorized (4)" });
    }
  }
  next();
});

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

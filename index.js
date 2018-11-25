const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const path = require("path");

const AuthAPI = require("./controller/auth/api");
const AuthUser = require("./controller/auth/user");
const AuthAccess = require("./controller/auth/access");

const User = require("./controller/user/user");
const Product = require("./controller/product/product");

const HelperResponse = require("./controller/helper/response");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/favicon.ico", (req, res) => {
  res.status(204);
  return res.end();
});

app.use("/robots.txt", (req, res) => {
  res.status(200);
  return res.sendFile(path.join(__dirname, "public", "robots.txt"));
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(AuthAPI);

const main_db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL || false
});

main_db.connect();

const authUser = AuthUser(main_db);
authUser.populate();
app.use(authUser.tokenAuth);

const authAccess = AuthAccess(main_db);
app.use(authAccess.checkAccess);

const product = Product(main_db);
app.get("/products/:page/:items_per_page", product.getProducts);
app.get("/product/:id", product.getProduct);
app.post("/product", product.postProduct);
app.patch("/product/:id", product.patchProduct);
app.delete("/product/:id", product.deleteProduct);

const user = User(main_db);
app.get("/users/:page/:items_per_page", user.getUsers);
app.get("/user/:id", user.getUser);
app.post("/user", user.postUser);
app.patch("/user/:id", user.patchUser);
app.delete("/user/:id", user.deleteUser);

const reply = HelperResponse();
app.all("*", (req, res) => {
  return reply.notFound(req, res, "invalid route");
});

process.env.PORT = process.env.PORT || 3000;
const port = process.env.PORT;
module.exports = app.listen(port, () => {
  console.log(`Backend server started`);
});

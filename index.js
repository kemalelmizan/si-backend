const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const AuthAPI = require("./controller/auth/api");
const AuthUser = require("./controller/auth/user");
const AuthAccess = require("./controller/auth/access");

const User = require("./controller/user/user");
const Product = require("./controller/product/product");

const HelperResponse = require("./controller/helper/response");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const user = User(main_db);
app.get("/users/:page/:items_per_page", user.getUsers);
app.get("/user/:id", user.getUser);

const reply = HelperResponse();
app.all("*", (req, res) => {
  return reply.notFound(req, res, "invalid route");
});

process.env.PORT = process.env.PORT || 3000;
const port = process.env.PORT;
module.exports = app.listen(port, () => {
  console.log(`Backend server started`);
});

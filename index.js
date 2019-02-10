require("dotenv").config();

const http = require('http')
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const socketio = require('socket.io')

const AuthAPI = require("./controller/auth/api");
const AuthUser = require("./controller/auth/user");
const AuthAccess = require("./controller/auth/access");

const User = require("./controller/user/user");
const Product = require("./controller/product/product");

const HelperResponse = require("./controller/helper/response");
const passportInit = require("./controller/auth/passport");

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
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
  })
);

// app.use(AuthAPI);

const main_db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SSL || false
});

main_db.connect();

// const authUser = AuthUser(main_db);
// authUser.populate();
// app.use(authUser.tokenAuth);

// Setup for passport and to accept JSON objects
app.use(express.json());
app.use(passport.initialize());
passportInit();

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// so that we can access them later in the controller
server = http.createServer(app)
const io = socketio(server)
app.set('io', io)
app.get('/wake-up', (req, res) => res.send('👍'))

const googleAuth = passport.authenticate("google", { scope: ["profile"] });
app.get("/google/callback", googleAuth, (req, res) => {
  const io = req.app.get("io");
  const user = {
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, "sz=250")
  };
  console.log(user)
  io.in(req.session.socketId).emit("google", user);
  res.end();
});

app.use((req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
});

app.get("/google", googleAuth);

// 1. login with g+ oauth
// https://codeburst.io/react-authentication-with-twitter-google-facebook-and-github-862d59583105
// 2. retrieve email, name, put into redis

// const authAccess = AuthAccess(main_db);
// app.use(authAccess.checkAccess);

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
module.exports = server.listen(port, () => {
  console.log(`Backend server started`);
});

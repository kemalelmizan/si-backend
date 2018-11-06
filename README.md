# Startup Incubation Class - Backend Setup

## Github Project Setup

1. [Create new repo](https://github.com/new) with name `<your_app>-api` or `<your_app>-backend`

## Heroku Project setup

1. [Create new app](https://dashboard.heroku.com/new-app?org=personal-apps) with name `<your_app>-api` or `<your_app>-backend`
1. Connect to previously created github repo
1. Download [heroku CLI tools](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
1. Install heroku postgres plugin

## Local Project setup

1. `git clone https://github.com/kemalelmizan/<your_app>-api.git`
1. `npm init`
1. Fill details
1. `npm i --save express`
1. `npm i --save body-parser`
1. `npm i --save pg`
1. `npm i --save db-migrate`
1. `npm i --save db-migrate-pg`
1. Add `"start": "node index.js"` in `package.json` scripts

## Database migration setup

1. `npm i -g db-migrate`
1. `db-migrate -v`
1. Add `database.json` config file
1. `DATABASE_URL=postgres://xxx db-migrate create <table_name> --sql-file -e production`
1. Repeat previous step for every tables
1. Fill in SQL up and down script in `./migrations/sqls`
1. `DATABASE_URL=postgres://xxx db-migrate up -e production`

## API setup

1. Setup express routers
1. Setup queries
1. Generate random tokens by `Array(64).fill(0).map(x => Math.random().toString(36).charAt(2)).join('')`
1. Setup `API_TOKEN` in heroku
1. `DATABASE_URL=postgres://xxx SSL=true npm start`

## Heroku CLI Commands

1. `heroku auth:login`
1. `heroku auth:whoami`
1. `heroku apps`
1. `heroku addons --all`
1. `heroku logs --tail -a si-backend`
1. to restart app: `heroku restart -a si-backend`

## Local Docker Postgres Dev DB Setup

1. Install and run docker
1. `docker -v`
1. `docker run -p 5432:5432 --name si-backend -e POSTGRES_PASSWORD=sibackend -d postgres`
1. `docker ps -a`
1. to start container: `docker start si-backend`
1. Add `dev` environment in `database.json`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres npm start`
1. Create DB migration using local docker: `db-migrate create <table_name> --sql-file -e dev`

## Generate User Specific Token (Postgres)

1. `db-migrate create users --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate down -e dev`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## ERD

![erd](erd.png)

## Modular Development

1. [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
1. Add folders according to folder structure
1. Restructure `index.js` into corresponding `controller`s and `model`s
1. Add `controller/helper/response.js` to wrap the response
1. Add `controller/access/admin.js`, `buyer.js` and `seller.js` for access control matrix
1. Add `controller/auth/api.js` for `API_TOKEN` validation
1. Separate `controller/auth/user.js` and `model/auth/user.js`
1. Add `controller/auth/access.js` to validate module access rights
1. Set environment variables in postman for easy access, add `host`, `API_TOKEN`, `user_email` and `access_token`

## Add module `users`

1. Separate `controller/user/user.js` and `model/user/user.js`
1. Add `model/user/user.js` modules: `module.selectUsers`, `module.selectUser`, `module.insertUser`, `module.updateUser` and `module.deleteUser`
1. Add `controller/user/user.js` modules: `module.getUsers`, `module.getUser`, `module.postUser`, `module.patchUser` and `module.deleteUser`
1. Add user module route in `index.js`
1. Run the app `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`
1. Test the CRUD with the following CURL (can be imported to postman)
#### Create User (POST): 
```
curl -X POST \
  http://localhost:3000/user \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com' \
  -d '{
    "username": "newbuyer",
    "firstname": "new",
    "lastname": "buyer",
    "email": "newbuyer@gmail.com",
    "role": "buyer"
  }'
```
#### Read User (GET): 
##### Users `/:page/:items_per_page`
```
curl -X GET \
  http://localhost:3000/user/1/10 \
  -H 'Authorization: abc' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```
##### User `/:id`
```
curl -X GET \
  http://localhost:3000/user/1 \
  -H 'Authorization: abc' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```
#### Update User (PATCH)
```
curl -X PATCH \
  http://localhost:3000/user/4 \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com' \
  -d '{
    "username": "newbuyer",
    "firstname": "new",
    "lastname": "buyer",
    "email": "newbuyer@gmail.com",
    "role": "buyer"
  }'
```
#### Delete User (DELETE) 
```
curl -X DELETE \
  http://localhost:3000/user/4 \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```

## Add module `products`

1. Separate `controller/product/product.js` and `model/product/product.js`
1. Add `model/product/product.js` modules: `module.selectProducts`, `module.selectProduct`, `module.insertProduct`, `module.updateProduct` and `module.deleteProduct`
1. Add `controller/product/product.js` modules: `module.getProducts`, `module.getProduct`, `module.postProduct`, `module.patchProduct` and `module.deleteProduct` in controller
1. Add product module route in `index.js`
1. Run the app `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`
1. Test the CRUD with the following CURL (can be imported to postman)
#### Create Product (POST): 
```
curl -X POST \
  http://localhost:3000/product \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com' \
  -d '{
    "name": "product-example",
    "description": "description of product example",
    "image_url": "http://placehold.it/200x200",
    "category": "phone",
    "price": 200000,
    "discounted_price": 200000
  }'
```
#### Read Product (GET): 
##### Products `/:page/:items_per_page`
```
curl -X GET \
  http://localhost:3000/products/1/10 \
  -H 'Authorization: abc' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```
##### Product `/:id`
```
curl -X GET \
  http://localhost:3000/product/1 \
  -H 'Authorization: abc' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```
#### Update Product (PATCH)
```
curl -X PATCH \
  http://localhost:3000/product/4 \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com' \
  -d '{
    "name": "product-example-updated",
    "description": "description of product example",
    "image_url": "http://placehold.it/200x200",
    "category": "phone",
    "price": 400000,
    "discounted_price": 200000
  }'
```
#### Delete Product (DELETE) 
```
curl -X DELETE \
  http://localhost:3000/product/4 \
  -H 'Authorization: abc' \
  -H 'Content-Type: application/json' \
  -H 'access_token: xxx' \
  -H 'cache-control: no-cache' \
  -H 'user_email: kemalelmizan@gmail.com'
```

## Add module `stores`

1. `db-migrate create stores --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. Create model in `model/store/store.js`
1. Add `model/store/store.js` modules: `module.selectStores`, `module.selectStore`, `module.insertStore`, `module.updateStore` and `module.deleteStore`
1. Create controller in `controller/store/store.js`
1. Add `controller/store/store.js` modules: `module.getStores`, `module.getStore`, `module.postStore`, `module.patchStore` and `module.deleteStore`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `stores_products`

1. `db-migrate create stores_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `carts`

1. `db-migrate create carts --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `orders`

1. `db-migrate create orders --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `carts_products`

1. `db-migrate create carts_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `orders_products`

1. `db-migrate create orders_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## To be covered in next sessions

1. [ ] unit tests and test coverage
1. [ ] caching using redis
1. [ ] third party libraries and APIs: file upload, nodemailer
1. [ ] security: penetration testing, injection, OWASP
1. [ ] documentation: swagger

## Links and docs

1. [Heroku postgres docs](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)
1. [db-migrate docs](https://db-migrate.readthedocs.io/en/latest/)
1. [Express API](https://expressjs.com/en/4x/api.html)
1. [Express middleware](https://expressjs.com/en/guide/using-middleware.html)
1. [Docker Cheat Sheet](https://github.com/wsargent/docker-cheat-sheet)

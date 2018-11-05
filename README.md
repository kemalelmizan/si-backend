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
1. `docker start si-backend`
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

## Add table `stores`
1. `db-migrate create stores --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add table `stores_products`
1. `db-migrate create stores_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add table `carts`
1. `db-migrate create carts --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add table `orders`
1. `db-migrate create orders --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add table `carts_products`
1. `db-migrate create carts_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add table `orders_products`
1. `db-migrate create orders_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## To be covered in next sessions
1. [ ] unit tests and test coverage
1. [ ] caching using redis
1. [ ] security: penetration testing, injection, OWASP

## Links and docs

1. [Heroku postgres docs](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)
1. [db-migrate docs](https://db-migrate.readthedocs.io/en/latest/)
1. [Express API](https://expressjs.com/en/4x/api.html)
1. [Express middleware](https://expressjs.com/en/guide/using-middleware.html)
1. [Docker Cheat Sheet](https://github.com/wsargent/docker-cheat-sheet)
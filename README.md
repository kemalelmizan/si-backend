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

## Database migration setup

1. `npm i -g db-migrate`
1. Add `database.json` config file
1. `DATABASE_URL=postgres://xxx db-migrate create <table_name> --sql-file -e production`
1. Repeat previous step for every tables
1. Fill in SQL up and down script in `./migrations/sqls`
1. `DATABASE_URL=postgres://xxx db-migrate up -e production`

## API setup

1. Setup express routers
1. Setup queries
1. Setup `API_TOKEN` in heroku

## Links and docs

1. [Heroku postgres docs](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)
1. [db-migrate docs](https://db-migrate.readthedocs.io/en/latest/)
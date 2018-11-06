
## Add module `carts`

1. `db-migrate create carts --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`


## Add module `carts_products`

1. `db-migrate create carts_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `orders`

1. `db-migrate create orders --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

## Add module `orders_products`

1. `db-migrate create orders_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`
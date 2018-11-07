
## Add module `stores`

1. `db-migrate create stores --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. Create model in `model/store/store.js`
1. Add `model/store/store.js` modules: `module.selectStores`, `module.selectStore`, `module.insertStore`, `module.updateStore` and `module.deleteStore`
1. Create controller in `controller/store/store.js`
1. Add `controller/store/store.js` modules: `module.getStores`, `module.getStore`, `module.postStore`, `module.patchStore` and `module.deleteStore`
1. Add store module route in `index.js`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`
1. Test adding store from seller account
1. Test updating and deleting store from admin account
1. Test selecting store from buyer account

## Add module `stores_products`

1. `db-migrate create stores_products --sql-file -e dev`
1. Fill in SQL up and down script in `./migrations/sqls`
1. `db-migrate up -e dev`
1. `DATABASE_URL=postgres://postgres:sibackend@localhost:5432/postgres API_TOKEN=abc npm start`

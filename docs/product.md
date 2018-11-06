
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

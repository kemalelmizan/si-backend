
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

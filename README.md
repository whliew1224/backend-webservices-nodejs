# backend-webservices-nodejs

To Run: 
node server.js

#POST
http://localhost:3000/items
{
 "name": "iPhone 7",
 "Price": "2999.90",
 "Brand": "Apple"
}

#GET
http://localhost:3000/items
http://localhost:3000/items?page=1

#DELETE
http://localhost:3000/items/2

#PATCH
http://localhost:3000/items/9
{
 "name": "new name",
 "Price": "new Price",
 "Brand": "new Brand"
}

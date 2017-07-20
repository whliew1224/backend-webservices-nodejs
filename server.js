var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;
var fs = require("fs");
var autoId = 0;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/items', function(req, res) {

	fs.access('myjsonfile.json', (err) => {
		if (err) {
			res.send("No items ...");
			return;
		}
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
		    if (err){
		        console.log(err);
		    } else {
			    obj = JSON.parse(data);

				var itemArray = [];
				var pageSize = 2;
				var currentPage = 1;
				var totalResults = obj.table.length+1;

			    while (obj.table.length > 0) {
			        itemArray.push(obj.table.splice(0, pageSize));
			    }

			    if (typeof req.query.page !== 'undefined') {
			        currentPage = +req.query.page;
			    }

			    obj.table = itemArray[+currentPage - 1];

			    var paginationInfo = {
					"totalResults" : totalResults,
					"resultPerPage" : pageSize,
					"currentPage": currentPage,
					"pages" : Math.ceil(totalResults/pageSize)
				}

				var resJson = JSON.stringify({ 
					items: obj.table, 
					paginationInfo: paginationInfo
				});

			    res.setHeader('Content-Type', 'application/json');
    			//res.send(JSON.stringify(obj) + " " + JSON.stringify(paginationInfo));
    			res.send(resJson);

			}
		});
	});
});


app.post('/items', function(req, res) {

	var name = req.body.name;
	var Price = req.body.Price;
	var Brand = req.body.Brand;

  	var obj = {
	   table: []
	};

	var newItem = {
		"items" : {
			"id" : autoId += 1,
			"name" : name,
			"Price": Price,
			"Brand": Brand
		}
	}
	obj.table.push(newItem);
	var json = JSON.stringify(obj);

	fs.access('myjsonfile.json', (err) => {
		if (err) {
			fs.writeFile('myjsonfile.json', json, 'utf8');
			console.log("New entry, file created");
			return;
		}
		console.log("File exist, perform append... ... ");
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
		    if (err){
		        console.log(err);
		    } else {
		    obj = JSON.parse(data);
		    obj.table.push(newItem); 
		    json = JSON.stringify(obj); 
		    fs.writeFile('myjsonfile.json', json, 'utf8');
		}});
	});
	
	


    res.send(obj);

});

app.delete('/items/:id', function(req, res) {
	var id = req.params.id;
	if (id == undefined) res.send("Invalid id");
	console.log("id is = " + id);
	fs.access('myjsonfile.json', (err) => {
		if (err) {
			res.send("No items ...");
			return;
		}
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
		    if (err){
		        console.log(err);
		    } else {
			    obj = JSON.parse(data);
			    obj = findAndRemove(obj, id);
			    json = JSON.stringify(obj); 
		    	fs.writeFile('myjsonfile.json', json, 'utf8');
		    	res.send("Done");
			}
		});
	});
    
});

app.patch('/items/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var Price = req.body.Price;
	var Brand = req.body.Brand;

	if (id == undefined) res.send("Invalid id");
	console.log("id is = " + id);
	fs.access('myjsonfile.json', (err) => {
		if (err) {
			res.send("No items ...");
			return;
		}
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
		    if (err){
		        console.log(err);
		    } else {
			    obj = JSON.parse(data);
			    obj = findAndUpdate(obj, id, name, Price, Brand);
			    json = JSON.stringify(obj); 
		    	fs.writeFile('myjsonfile.json', json, 'utf8');
		    	res.send("Done");
			}
		});
	});
    
});

function findAndRemove(array, value) {
	console.log(array.table);
	for (i = 0; i < array.table.length; i++) { 
		if(array.table[i].items.id == value) {
			array.table.splice(i, 1);
		}  
	}
	return array;
}

function findAndUpdate(array, value, name, price, brand) {
	console.log(array.table);
	for (i = 0; i < array.table.length; i++) { 
		if(array.table[i].items.id == value) {
			array.table[i].items.name = name;
			array.table[i].items.Price = price;
			array.table[i].items.Brand = brand;
		}  
	}
	return array;
}





app.listen(port);
console.log('Server started! At http://localhost:' + port);
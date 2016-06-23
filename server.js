var express = require('express');
var app = express();

app.use(express.static(__dirname));

//console.log(__dirname + "/public");

app.listen(3001, function() {
	console.log('Server listening on port 3001');
});
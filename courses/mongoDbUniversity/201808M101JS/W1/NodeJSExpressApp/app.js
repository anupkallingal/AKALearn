var express = require('express'),
    app = express();

app.get('/', function(req, res) {
   res.send("Hello World Express"); 
});

app.use(function(req, res) {
   res.sendStatus(404); 
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Express server listenining on port %s", port);
});
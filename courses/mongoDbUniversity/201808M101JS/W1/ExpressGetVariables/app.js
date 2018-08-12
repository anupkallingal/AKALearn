var express = require('express'),
    app = express(), // Web framework to handle routing requests
    engines = require('consolidate'); // Template libray adapter for express

app.engine('html', engines.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.log(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {error : err});
}

app.use(errorHandler);

app.get('/:name', function(req, res) {
    var name = req.params.name;
    var getvar1 = req.query.getvar1;
    var getvar2 = req.query.getvar2;
    res.render('hello', {'name' : name, getvar1: getvar1, getvar2: getvar2});
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Express server listenining on port %s", port);
});
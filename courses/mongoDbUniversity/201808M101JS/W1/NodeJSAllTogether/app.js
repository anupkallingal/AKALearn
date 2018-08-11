var express = require('express'),
    app = express(),
    engines = require('consolidate');

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, client) {
    
    assert.equal(null, err);
    console.log("Successfully connected to the db server");
    
    app.get('/movies', function(req, res) {
        var db = client.db('video');    
        // Find some dcouments in a collection
        db.collection('movies').find({}).toArray(function(err, documents) {
            res.render('movies', {'movies' : documents});
            client.close();
        });
    });

    app.use(function(req, res) {
       res.sendStatus(404); 
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log("Express server listenining on port %s", port);
    });
});
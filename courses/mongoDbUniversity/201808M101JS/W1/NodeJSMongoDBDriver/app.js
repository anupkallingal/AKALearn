var MongoClient = require('mongodb').MongoClient,
    assert = require('assert')

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, client) {
    
    assert.equal(null, err);
    
    console.log("Successfully connected to the db server");
    
    var db = client.db('video');    
    // Find some dcouments in a collection
    db.collection('movies').find({}).toArray(function(err, documents) {
        documents.forEach(function(findErr, document) {
            if (findErr) throw findErr;
            
            // Print the title of each document
            console.log(document.title);            
        });    
        client.close();
    });
    
    console.log("Called find()")
});
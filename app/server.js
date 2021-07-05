let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();
const ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });


// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

app.put('/update-profile', function (req, res) {
  let userObj = req.body;
  
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;
    
    let db = client.db(databaseName);
    let newvalues = { name: userObj.name, email: userObj.email, address: userObj.address };
  
    db.collection("users").findOneAndUpdate({ _id: req.body._id }, {$set: newvalues }, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

   // db.collection("users").replaceOne({ _id: new ObjectID(req.params.id) }, {$set: newvalues }, {upsert: true}, function(err, res) {
     // if (err) throw err;
   //   client.close();
   // });

  });
  // Send response
  res.send(userObj);
});

app.post('/add-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    

    
    let newvalues = { name: userObj.name, email: userObj.email, address: userObj.address };
    
    db.collection("users").insertOne(newvalues, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.post('/delete-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    
    let newvalues = { name: userObj.name, email: userObj.email, address: userObj.address };
    
    db.collection("users").deleteOne(newvalues, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  let response = {};
  let userObj = req.body;
  // Connect to the db
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
      

    db.collection("users").findOne({name: userObj.name}, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});

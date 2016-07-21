var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://subasbhackvm.eastus.cloudapp.azure.com/observeDbApi');
//var db = mongoose.connect('mongodb://localhost/observeDbApi');

var app = express();
var port = process.env.port || 3000;

locationRouter = require('./routes/locationRoutes')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/locations', locationRouter);

app.get('/', function (req, res) {
    res.send("Welcome to an Observe api endpoints. Please use api/locations in your url. ");
});

app.listen(port, function () {
    console.log('Gulp is running on port: ' + port);
});

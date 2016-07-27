var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://subasbhackvm.eastus.cloudapp.azure.com/observeDbApi');
//var db = mongoose.connect('mongodb://localhost/observeDbApi');

var app = express();
var port = process.env.port || 3000;

locationRouter = require('./routes/locationRoutes')();
userRouter = require('./routes/userRoutes')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// This makes the db accessible from the routers
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/api/locations', locationRouter);
app.use('/api/users', userRouter);

app.get('/', function (req, res) {
    res.send("Welcome to an Observe api endpoints. Please use api/locations in your url. ");
});

app.listen(port, function () {
    console.log('Gulp is running on port: ' + port);
});

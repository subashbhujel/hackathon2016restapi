// .  = This user
//.. = Up a directory

var express = require('express'),
    User = require('../models/userModel.js');


var routes = function() {
    var userRouter = express.Router();

    userRouter.route('/')
        .post(function(req, res) {
            var user = new User(req.body);
            
            // This gets the database object assigned in app.js
            var db = req.db;

            // This gets the collection for the userModel data
            var collection = db.connections[0]["collections"]["userCollection"];
            
            // Check if the phone number exists in a current document
            collection.count({phoneNumber: user.phoneNumber}, function(error, count){
                // Create a new user
                if(count == 0){
                    console.log("Adding new user entry.");
                    user.save(); // Saves to the MongoDB
                    res.status(201).send(user); // 201 = Created
                }
                // Append the first location in the list to the existing user
                else{
                    User.findOneAndUpdate({phoneNumber: user.phoneNumber}, 
                    {$push: {locations: user.locations[0]}}, {new: true}, 
                    function(error, model){
                        if(error){
                            res.status(404).send("Failed to append location to existing user.");
                        }
                        res.status(201).send(model); // 201 = Created, send back the updated document
                    });
                }
            });

        })
        .get(function(req, res) {
            var query = {};

            // This will work for all User model query like:
            // genre=fiction OR author=Subash Bhujel OR title=war and peace OR reach=true ....
            if (req.query) {
                query = req.query;
            }

            console.log("Test.");

            User.find(query, function(err, users) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(users);
                }
            });
        });

    return userRouter;
};

module.exports = routes;
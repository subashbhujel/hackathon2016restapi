// .  = This user
//.. = Up a directory

var express = require('express'),
    User = require('../models/userModel.js');



var routes = function() {
    var userRouter = express.Router();

    userRouter.route('/')
        .post(function(req, res) {
            var user = new User(req.body);
        
            var db = req.db; // Get the database object assigned in app.js
            var collection = db.connections[0]["collections"]["userCollection"]; // Get the collection for the userModel data
            
            collection.count({phoneNumber: user.phoneNumber}, function(error, count){  // Check if the phone number exists in a current document
                if(count == 0){ // Create a new user
                    user.save(); // Saves to the MongoDB
                    res.status(201).send(user); // 201 = Created
                }
                else{ // Append the first location in the list to the existing user
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

        userRouter.route('/add')
        // NOT a COMMON PRactice. Not recommended.
        // Basincally you are POSTing using GET verbs!
        .get(function(req, res) {
            var user = new User(req.query);
            var db = req.db; // Get the database object assigned in app.js
            var collection = db.connections[0]["collections"]["userCollection"]; // Get the collection for the userModel data

            collection.count({phoneNumber: user.phoneNumber}, function(error, count){  // Check if the phone number exists in a current document
                if(count == 0){ // Create a new user
                    user.save(); // Saves to the MongoDB
                    res.status(201).send(user); // 201 = Created
                }
                else{ // Append the first location in the list to the existing user
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
        });

    return userRouter;
};

module.exports = routes;
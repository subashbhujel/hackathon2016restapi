// .  = This location
//.. = Up a directory

var express = require('express'),
    Location = require('../models/locationModel.js');

var routes = function() {
    var locationRouter = express.Router();

    locationRouter.route('/')
        .post(function(req, res) {
            var location = new Location(req.body);
            location.save(); // Saves to the MongoDB
            res.status(201).send(location); // 201 = Created
        })
        .get(function(req, res) {
            var query = {};

            // This will work for all Location model query like:
            // genre=fiction OR author=Subash Bhujel OR title=war and peace OR reach=true ....
            if (req.query) {
                query = req.query;
            }

            console.log("Testing from default");

            Location.find(query, function(err, locations) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    //res.header('Access-Control-Allow-Origin', '*');
                    res.json(locations);
                }
            });
        });

    locationRouter.route('/add')
        // NOT a COMMON PRactice. Not recommended.
        // Basincally you are POSTing using GET verbs!
        .get(function(req, res) {
            var location = new Location(req.query);
            location.save(); // Saves to the MongoDB
            res.status(201).send(location); // 201 = Created
        });

    // **Middleware**
    // This is a way to separate repeated function between get/post/put/patch at one place.
    // Here it works for route that uses locationId. 
    // Next = passes on to 'next' thing to be done. In this case it will move on to Get or Put.
    // If we had more middleware, it would have moved on to next middleware.
    locationRouter.use('/:locationId', function(req, res, next) {
        Location.findById(req.params.locationId, function(err, location) {
            if (err) {
                res.status(500).send(err);
            } else if (location) {
                // Adding location to req=request so it's accessible through req keyword.
                req.location = location;
                // Moving on contro to next middleware or get/put in this case since we don't have any more middleware.
                next();
            } else {
                res.status(404).send('No location found.');
            }
        });
    });

    locationRouter.route('/:locationId')
        .get(function(req, res) {
            console.log("Testing location id");
            // If error or location not found, middleware will catch it already. It will reach here *if* it finds the location!
            res.json(req.location);
        })
        .put(function(req, res) {
            req.location.lat = req.body.lat;
            req.location.lon = req.body.lon;
            req.location.name = req.body.name;

            // Saves the updated location
            req.location.save(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    // returns the location object back.
                    res.json(req.location);
                }
            });
        })
        .patch(function(req, res) {
            // we do not want to update the ID
            if (req.body._id) {
                delete req.body._id;
            }

            // Loop through each element in the body and update corresponding records.
            for (var p in req.body) {
                req.location[p] = req.body[p];
            }

            // Save the changes
            req.location.save(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.location);
                }
            });
        })
        .delete(function(req, res) {
            req.location.remove(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send('Removed!');
                }
            })
        });

    return locationRouter;
};

module.exports = routes;

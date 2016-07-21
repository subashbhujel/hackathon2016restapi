var express = require('express'),
    Location = require('../models/locationModel.js');

var routes = function() {
    var locationRouter = express.Router();

    locationRouter.route('/')

    .post(function(req, res) {
            // Location class is defined in LocationModel. This is the name given under exports module.
            var location = new Location(req.body);
            location.save(); // Saves to the MongoDB
            res.status(201).send('Successfully saved to the database.'); // 201 = Created
        })
        .get(function(req, res) {
            var query = {};

            // This will work for all locations model query like:
            // genre=fiction OR author=Subash Bhujel OR title=war and peace OR reach=true ....
            if (req.query) {
                query = req.query;
            }

            Location.find(query, function(err, locations) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(locations);
                }
            });
        });


    // **Middleware**
    // This is a way to separate repeated function between get/post/put/patch at one place.
    // Here it works for route that uses bookId. 
    // Next = passes on to 'next' thing to be done. In this case it will move on to Get or Put.
    // If we had more middleware, it would have moved on to next middleware.

    locationRouter.use('/:id', function(req, res, next) {
        Location.find(req.params.id, function(err, location) {
            if (err) {
                res.status(500).send(err);
            } else if (location) {
                req.location = location;
                next();
            } else {
                res.status(404).send('No location found.');
            }
        });
    });

    locationRouter.route('/:id')
        .get(function(req, res) {
            res.json(req.location);
        })
        .put(function(req, res) {
            req.location.id = req.body.id;
            req.location.lat = req.body.lat;
            req.location.lon = req.body.lat;

            // Saves the updated location
            req.location.save(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.location);
                }
            });
        })
        .patch(function(req, res) {
            // we do not want to update the ID
            if (req.body._id) {
                delete req.body._id;
            }
            if (req.body.id) {
                delete req.body.id;
            }

            for (var p in req.body) {
                req.location[p] = req.body[p];
            }

            // save the changes
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
                    res.status(200).send('Removed!')
                }
            })
        })

    return locationRouter;
};

module.exports = routes;
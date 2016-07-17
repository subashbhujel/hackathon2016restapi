var express = require('express'),
    Location = require('../models/locationModel.js');

var routes = function () {
    var locationRouter = express.Router();

    locationRouter.route('/')
        .post(function (req, res) {
            // Location class is defined in LocationModel. This is the name given under exports module.
            var location = new Location(req.body);
            location.save(); // Saves to the MongoDB
            res.status(201).send('Successfully saved to the database.'); // 201 = Created
        })
        .get(function (req, res) {
            var query = {};

            // This will work for all Books model query like:
            // genre=fiction OR author=Subash Bhujel OR title=war and peace OR reach=true ....
            if (req.query) {
                query = req.query;
            }

            Location.find(query, function (err, locations) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(locations);
                }
            });
        });
    return locationRouter;
};

module.exports = routes;

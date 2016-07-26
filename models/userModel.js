var express = require('express'),
    Location = require('../models/locationModel.js');

    var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');


// TODO: Make [Location] be the type for lcations
// 		 instead of having to replicate the structure of locationModel
var userModel = new Schema({
	phoneNumber:{
        type: Number
    },
    name: {
        type: String
    },
    locations: [{
	    lat: {
	        type: Number
	    },
	    lon: {
	        type: Number
	    },
	    name:{
	        type: String
	    },
	    datetime: {
	        type: Date,
	        default: moment().format()
	    }
    }]
},
{collection: 'userCollection'});

module.exports = mongoose.model('User', userModel);
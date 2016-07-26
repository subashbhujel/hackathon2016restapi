var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var locationModel = new Schema({
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
});


module.exports = mongoose.model('Location', locationModel);

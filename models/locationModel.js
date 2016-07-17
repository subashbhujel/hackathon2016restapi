var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var locationModel = new Schema({
    id: { type: Number },
    lat: { type: Number },
    lon: { type: Number }//,
    //datetime:{type: datetime, default: DateTime.Now()}
});

module.exports = mongoose.model('Location', locationModel);
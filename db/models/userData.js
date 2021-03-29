var mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var Long = Schema.Types.Long;

var userDataSchema = new Schema({
    holderId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: "greving"
    },
    level: {
        type: Number,
        default: 1
    },
    posX: {
        type: Number,
        default: 133
    },
    posY: {
        type: Number,
        default: 732
    },
    exp: {
        type: Long,
        default: 0
    },
    money: {
        type: Long,
        default: 0
    },
    equipment: {
        type: [],
        default: undefined
    },
    backpack: {
        type: [],
        default: undefined
    }
});

module.exports = mongoose.model('userData', userDataSchema);
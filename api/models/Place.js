const mongoose = require('mongoose');
const {Schema} = mongoose;

const placeSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type:String, required: true},
    address: {type: String, required: true},
    photos: {type: [String], requried: true, validate: [arrayMin]},
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: {type: Number, required: true},
    checkOut: {type: Number, required: true},
    maxGuests: {type: Number, required: true},
    price: {type: Number, required: true}
})

function arrayMin(val) {
    return val.length >= 1;
}

const PlaceModel = mongoose.model('Place', placeSchema)

module.exports = PlaceModel;

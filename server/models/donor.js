const {mongoose} = require('../db/mongoose')

var donorSchema = mongoose.Schema({
    hospital_location: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
    },
    age:{
        type: Number,
        minlength: 1,
        required: true,
    },
    gender: {
        type: String,
        maxlength: 1,
        required: true
    },
    address: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
    },
    blood_group:{
        type: String,
        minlength:1,
        trim: true,
        required: true
    },
    organ: [{
        organ_name: {
            type: String,
            required: true,
            minlength: 1
        },
        organ_health: {
            type: String,
            minlength: 1
        },
        organ_life: {
            type: String,
            minlength: 1
        }
    }]
})

var Donor = mongoose.model('donors', donorSchema)

module.exports = {Donor}
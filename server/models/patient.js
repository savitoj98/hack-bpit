const {mongoose} = require('../db/mongoose')

var patientSchema = mongoose.Schema({
    hospital_location: {
        type: String,
        minlength: 1,
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
    severity: {
        type: Number,
        minlength: 1,
        default: null
    },
    organ_needed: {
        type: String,
        minlength: 1,
        trim: true,
        required: true
    },
    blood_group:{
        type: String,
        minlength:1,
        trim: true,
        required: true
    }
})


var Patient = mongoose.model('patients', patientSchema)

module.exports = {Patient}
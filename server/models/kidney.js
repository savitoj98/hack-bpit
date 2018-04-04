const {mongoose} = require('../db/mongoose')

var KidneySchema = mongoose.Schema({
    patientID : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        minlength:1
    },
    parameters : [{
        sugar : {
            type: Number,
            required: true
        }, 
        red_cell : {
            type: Number,
            required: true
        }, 
        white_cell : {
            type : Number, 
            required: true
        },
        diabetis : {
            type : Boolean,
            required: true
        }
    }]
})

var Kidney = mongoose.Schema('Kidney', KidneySchema)

module.exports = {Kidney}
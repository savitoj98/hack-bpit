const {mongoose} = require('../db/mongoose')

var HeartSchema = mongoose.Schema({
    patientID : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        minlength:1
    },
    parameters : [{
        chol : {
            type: Number,
            required: true
        }, 
        sugar : {
            type: Number,
            required: true
        }, 
        blood_pres : {
            type : Number, 
            required: true
        },
        family_his : {
            type : Boolean,
            required: true
        }
    }]
})

var Heart = mongoose.Schema('Heart', HeartSchema)

module.exports = {Heart}
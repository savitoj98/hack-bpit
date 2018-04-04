const express = require('express')
const body_parser = require('body-parser')
const {Patient} = require('./models/patient')
const {Donor} = require('./models/donor')

var app = express()

app.use(body_parser())



app.listen(3000, () => {
    console.log('listening on port 3000')
})
//import { resolve } from 'path';

const express = require('express')
const body_parser = require('body-parser')
const {Patient} = require('./models/patient')
const {Donor} = require('./models/donor')
const {shelf} = require('./locals/shelf')
var {potential} = require('./queries/queries')
var asyncLoop = require('node-async-loop')
const axios = require('axios')
var app = express()

app.use(body_parser.json())

app.post('/register_patient', (req,res,next) => {
    var body = req.body
    if (body.name && body.age && body.gender && body.address && body.organ && body.blood_group)
    {
        var newpatient  = new Patient({
            name : body.name,
            age: body.age,
            gender: body.gender,
            address: body.address,
            organ_needed: body.organ,
            blood_group: body.blood_group
        })

        newpatient.save().then((doc) => {
            res.status(200).send(doc)
        }).catch((e) => {
            res.status(400).send(e)
        })
    }
    else{
        res.status(400).send('parameters missing')
    }
})

app.post('/register_donor', (req,res,next) => {
    var body = req.body
    if (body.name && body.age && body.gender && body.address && body.organs && body.blood_group)
    {
        var newdonor  = new Donor({
            name : body.name,
            age: body.age,
            gender: body.gender,
            address: body.address,
            organs: body.organs,
            blood_group: body.blood_group
        })

        newdonor.save().then((doc) => {
            res.status(200).send(doc)
        }).catch((e) => {
            res.status(400).send(e)
        })
    }
    else{
        res.status(400).send('parameters missing')
    }
})

app.post("/search", potential, (req,res,next) => {

    var locationDist = []
    if(req.potential){
       
        Donor.findById('5ac522da5803514e0fe18d80').then((doc) => {
            return doc.address
        }).then((address) => {
            // asyncLoop(req.potential, function(item,next){
            //          axios({
            //              method: 'GET',
            //              url: "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+address+"&destinations="+"Inderpuri"+"&key="+" AIzaSyDh7EfaiJ1qcPph3TH8bTQTojBn6oiblFI",
            //              responseType: "json"
            //          }).then((response) => {
            //              var time = response.data.rows[0].elements[0].duration.value
            //              console.log(time/3600)
            //              locationDist.push(time/3600)

            //          })
                 
            //     })
            var prm = new Promise((res,rej) => {
                for(var i in req.potential){
                    console.log('in loop',req.potential[i])
                    axios({
                        method: 'GET',
                        url: "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+address+"&destinations="+"Inderpuri"+"&key="+" AIzaSyDh7EfaiJ1qcPph3TH8bTQTojBn6oiblFI",
                        responseType: "json"
                    }).then((response) => {
                        var time = response.data.rows[0].elements[0].duration.value
                        console.log(time/3600)
                        locationDist.push(time/3600)
                        if(locationDist.length == req.potential.length){
                            res();
                        }
                    })
                }
            }).then(() => {
                var bestMatches = []
            var promise = new Promise((resolve, reject) => {
                console.log('in then', req.potential, 'loca', locationDist)
                var r = 0
                for(var i=0; i< req.potential.length; i++){
                    var organ  = req.potential[i].organ_needed
                    console.log('shelf organ',shelf[organ])
                    if(locationDist[i] <= shelf[organ])
                    {
                        bestMatches.push(req.potential[i])
                        r++;
                    }
                }
                if(bestMatches.length == r){
                    resolve();
                }
            }).then(() => {
                console.log('bestmatches', bestMatches)
                res.status(200).send(bestMatches)               
            });
            
         });
            
              
        }).catch((e) => {
            res.status(400).send(e)
        })
        
    }else{
        res.status(400).send('no objects found')
    }
});

var util = require("util");

app.get('/name',(req,res) => {
    var send_test = [[35, 0, 1.6, 0.7, 157, 15, 44, 5.2, 2.5, 0.9]]
    var {spawn} = require("child_process");
    // console.log('sa')
    var process = spawn('python', ["./liver_model_script.py"]);
    // console.log(process.stdout)
    util.log('readingin')
    process.stdout.on('data', function(data) {
        //console.log('qs')
        res.send(data.toString());
        console.log(data.toString());
        //res.end('end');
    } )
    process.stderr.on('err', function(err){
        console.log(err)
    })
});
// var PythonShell = require('python-shell');

// PythonShell.run('liver_model_script.py', function (err) {
//   if (err) throw err;
//   console.log('finished');
// });

app.listen(3000, () => {
    console.log('listening on port 3000')
})
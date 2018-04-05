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
app.use(body_parser.urlencoded({extended:true}))

app.use(express.static('../Public'))

app.get('/' , (req,res,next) => {
    res.sendFile('index.html')
})

// function updateSeverity(id){
//     var send_test = [[35, 0, 1.6, 0.7, 157, 15, 44, 5.2, 2.5, 0.9]]
//     var {spawn} = require("child_process");
//     // console.log('sa')
//     var process = spawn('python3', ["./liver_model_script.py"]);
//     // console.log(process.stdout)
//     util.log('readingin')
//     process.stdout.on('data', function(data) {
//         //console.log('qs')
//         res.send(data.toString());
//         console.log(data.toString());
//         //res.end('end');
//     } )
//     process.stderr.on('err', function(err){
//         console.log(err)
//     })

    
// }

var pid

app.post('/register_patient', (req,res,next) => {
    var body = req.body
    console.log(body)
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
            pid = doc._id
            if(doc.organ_needed == 'kidney')
            {
                res.redirect('/kidney')
            }
            else if(doc.organ_needed == 'liver')
            {
                res.redirect('/liver')
            }
            else{
                
                res.redirect('/heart')
            }
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
    {   var array = []
        for(var i=0 ; i<body.organs.length; i++){
            array.push({organ_name: body.organs[i]})
        }
        var newdonor  = new Donor({
            name : body.name,
            age: body.age,
            gender: body.gender,
            address: body.address,
            organs: array,
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

app.get('/liver',(req,res) => {
    var send_test = [[35, 0, 1.6, 0.7, 157, 15, 44, 5.2, 2.5, 0.9]]
    var {spawn} = require("child_process");
    // console.log('sa')
    var process = spawn('python3', ["./liver_model_script.py"]);
    // console.log(process.stdout)
    util.log('readingin')
    process.stdout.on('data', function(data) {
        //console.log('qs')

        res.send({data: data.toString(), pid :pid});
        console.log(data.toString());
        //res.end('end');
    } )
    process.stderr.on('err', function(err){
        console.log(err)
    })


});

app.get('/kidney',(req,res) => {
    //var send_test = [[35, 0, 1.6, 0.7, 157, 15, 44, 5.2, 2.5, 0.9]]
    var {spawn} = require("child_process");
    // console.log('sa')
    var process = spawn('python3', ["./kidney_model_script.py"]);
    // console.log(process.stdout)
    util.log('readingin')
    process.stdout.on('data', function(data) {
        //console.log('qs')
        res.send({data: data.toString(), pid :pid});
        console.log(data.toString());
        //res.end('end');
    } )
    process.stderr.on('err', function(err){
        console.log(err)
    })
});

app.post("/update_severity", (req,res,next) => {
    Patient.findByIdAndUpdate(req.body.pid,{severity : req.body.data*100}, {new : true}).then((doc) => {
        if(doc){
            res.status(200).send("data added successfuly")
        }
    }).catch((e) => {
        res.status(400).send(e)
    })
})
app.get('/heart',(req,res) => {
    // var send_test = [[35, 0, 1.6, 0.7, 157, 15, 44, 5.2, 2.5, 0.9]]
    var {spawn} = require("child_process");
    // console.log('sa')
    var process = spawn('python3', ["./heart_model_script.py"]);
    // console.log(process.stdout)
    util.log('readingin')
    process.stdout.on('data', function(data) {
        //console.log('qs')
        res.send({data: data.toString(), pid :pid});
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
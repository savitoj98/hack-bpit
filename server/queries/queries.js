const {mongoose} = require('../db/mongoose')

const {Patient} = require('../models/patient')
const {Donor} = require('../models/donor')


function bloodGroup(bg) {
    if(bg == 'O'){
        return ['O', 'A', 'B', 'AB']
    }
    if(bg == 'A'){
        return ['A', 'AB']
    }
    if(bg == 'B'){
        return ['B','AB']
    }
    if(bg == 'AB'){
        return ['AB']
    }
    
}




Donor.findOne({
    _id: '5ac509a38a8fb13804a59a8a'
}).then((organInfo) => {
    return organInfo;
}).then((organInfo) => {
    Patient.find({
        organ_needed: organInfo.organs[0].organ_name,
        blood_group: {
            $in: bloodGroup(organInfo.blood_group)
        }
    }).then((data) => {
            var sorted_severity = data.sort((a,b) => {
                return b.severity - a.severity
            });
             console.log(sorted_severity)
         });
});


// Patient.find({
//     organ_needed: donor_organ
// }).then((data) => {
//     console.log(data)
// });
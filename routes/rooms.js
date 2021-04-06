const express = require('express');
const _ = require('lodash');
const router = express.Router();

var {Patient} = require('../models/patient.js');
var {rooms, Room} = require('../models/rooms.js');
const {ObjectID} = require('mongodb');

router.get('/getrooms', (req, res) => {
    Room.find({}, null, {sort: {name: 1}}).then((rooms) => {
        var roomsJSON = {};
        
        for (var i = 0; i < rooms.length; ++i) {
            roomsJSON[rooms[i].name] = rooms[i].availability;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(roomsJSON));
    }).catch((err) => {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({noroom: false}));
    });
});


router.get('/updateroom/:email/:futureRoom', (req, res) => {
    var email = req.params.email;
    var futureRoom = req.params.futureRoom;

  
   
    Promise.all([Room.find({}), Room.findOne({name: futureRoom}), Patient.findOne({email:email})])
        .then((data) => {
            var rooms = data[0];
            var futureRoomObject = data[1];
            var patient = data[2];


                
            if (rooms && patient && futureRoomObject && futureRoomObject["availability"] === false) { 
                
                if (patient.room !== 'noroom') {
                    for (var i = 0; i < rooms.length; ++i) {
                        if (rooms[i].name === patient.room) {
                            rooms[i].availability = false;
                            rooms[i].save();
                            break;
                        }
                    }
                }

                patient.room = futureRoomObject.name;
                patient.save();

                
                if (futureRoomObject.name !== 'noroom') {
                    
                    for (var i = 0; i < rooms.length; ++i) {
                        if (rooms[i].name === futureRoomObject.name) {
                            rooms[i].availability = true;
                            rooms[i].save();
                            break;
                        }
                    }
                }
                res.redirect('/');
            } else {
                throw Error("Bad request to change the room. Check the parameters.");
            }
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});


router.get('/swappatients/:patientWithRoom/:patientWithoutRoom', (req, res) => {
    var patientWithRoom = req.params.patientWithRoom;
    var patientWithoutRoom = req.params.patientWithoutRoom;

  
    Promise.all([Patient.findOne({hospitalNumber: patientWithRoom}), Patient.findOne({hospitalNumber: patientWithoutRoom})])
        .then((data) => {
            var patientWithRoom = data[0];
            var patientWithoutRoom = data[1];

        if (patientWithRoom && patientWithoutRoom && patientWithRoom["room"] !== 'noroom' && patientWithoutRoom["room"] === 'noroom') {  
                var roomOfPatient = patientWithRoom["room"];

                patientWithRoom.room = "noroom";
                patientWithRoom.save();

                patientWithoutRoom.room = roomOfPatient;
                patientWithoutRoom.save();

                res.redirect('/');
            } else {
                throw Error("Bad request to change the room. Check the parameters.");
            }
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});


router.post('/addroom', (req, res) => {
    var roomName = req.body.roomName;

    
    if (_.isString(roomName) && !_.isNaN(roomName)) {
        var room = Room({
            name: roomName,
            availability: false
        });

        room.save().then((room) => {
            console.log('Room added');
            res.status(200).redirect('/systemsettings');
        }).catch((err) => {
            console.log(err);
            res.status(400).redirect('/systemsettings');
        });
    } else {
        res.status(400).redirect('/systemsettings', {messages: req.flash('success_msg', 'Room added succesfully.') });
    }
});

router.post('/deleterooms', (req, res) => {
    var roomsToDelete = req.body.RD;

    if (_.isArray(roomsToDelete)) {
        for (var i = 0; i < roomsToDelete.length; ++i) {
            Room.find({
                name: roomsToDelete[i]
            }).remove().catch((err) => {
                console.log(err);
            });

            Patient.findOneAndUpdate({
                 room: roomsToDelete[i]
            }, {
                 "$set": {
                   "room": "noroom",
               }
          }).catch((err) => {
                 console.log(err);
            });
        }
        res.status(200).redirect('/systemsettings');
    } else {
        res.status(400).redirect('/systemsettings');
    }
});


module.exports = router;
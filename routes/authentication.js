const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  router = require("express").Router(),
  DocController = require("../controllers/DocController"),
  PatientController = require("../controllers/PatientController");

router.post("/registerDoctor", DocController.registerDoc);
router.post("/loginDoctor", DocController.loginDoc);
router.post("/registerPatient", PatientController.registerPat);
router.post("/loginPatient", PatientController.loginPat);

router.post("/changepassword", (req, res) => {
  const user = req.body.token.split(" ")[0],
    token = req.body.token.split(" ")[1],
    password = req.body.password,
    newpassword = req.body.newpassword;
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      if (user === "patient") {
        Patient.findById(payload._id, (err, patient) => {
          if (err || !patient) {
            res.send({ err: "Something went wrong!" });
          } else {
            bcrypt.compare(password, patient.password, (err, match) => {
              if (err) {
                res.send({ err: "Something went wrong!" });
              } else if (!match) {
                res.send({ err: "Please Enter correct old password!" });
              } else {
                bcrypt.hash(newpassword, 10, (err, hashedPass) => {
                  if (err || !hashedPass) {
                    res.send({ err: "Something went wrong!" });
                  } else {
                    Patient.findByIdAndUpdate(
                      payload._id,
                      {
                        password: hashedPass,
                        date: Math.round(Date.now() / 1000),
                      },
                      (err, patient) => {
                        if (err || !patient) {
                          res.send({ err: "Something went wrong!" });
                        } else {
                          jwt.sign(
                            { _id: patient._id },
                            process.env.JWT_SECRET,
                            (err, newtoken) => {
                              if (err || !newtoken) {
                                res.send({ err: "Something went wrong!" });
                              } else {
                                res.send({ token: newtoken, patient: true });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      } else if (user === "doctor") {
        Doctor.findById(payload._id, (err, doctor) => {
          if (err || !doctor) {
            res.send({ err: "Something went wrong!" });
          } else {
            bcrypt.compare(password, doctor.password, (err, match) => {
              if (err) {
                res.send({ err: "Something went wrong!" });
              } else if (!match) {
                res.send({ err: "Please Enter correct old password!" });
              } else {
                bcrypt.hash(newpassword, 10, (err, hashedPass) => {
                  if (err || !hashedPass) {
                    res.send({ err: "Something went wrong!" });
                  } else {
                    Doctor.findByIdAndUpdate(
                      payload._id,
                      {
                        password: hashedPass,
                        date: Math.round(Date.now() / 1000),
                      },
                      (err, doctor) => {
                        if (err || !doctor) {
                          res.send({ err: "Something went wrong!" });
                        } else {
                          jwt.sign(
                            { _id: doctor._id },
                            process.env.JWT_SECRET,
                            (err, newtoken) => {
                              if (err || !newtoken) {
                                res.send({ err: "Something went wrong!" });
                              } else {
                                res.send({ token: newtoken, doctor: true });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      } else {
        res.send({ err: "Something went wrong!" });
      }
    }
  });
});

router.post("/updatepatientaccount", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      const email = req.body.email;
      const phone = req.body.phone;
      // const sex = req.body.sex;
      const customaddress = req.body.customaddress;
      const allergies = req.body.allergies;
      const blood_group = req.body.bloodgroup;
      const zip = req.body.zip;
      const city = req.body.city;
      const state = req.body.state;

      // GET form attributes
      // var PD = req.body.PD;
      // if (_.isEmpty(PD)) {
      //   PD = [];
      // }

      Patient.findByIdAndUpdate(
        payload._id,
        {
          email: email,
          phone: phone,
          address: {
            custom: customaddress,
            city: city,
            zip: zip,
            state: state,
          },
          allergies: allergies,
          blood_group: blood_group,
        }
        // {
        //   $set: {
        //     diseases: PD,
        //     lastUpdate: new Date().getTime(),
        //   },
        // },
        // {
        //   new: true,
        // }
      )
        .then((patient) => {
          // patient.updateScore();
          res.send({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.send({ success: false });
        });
    }
  });
});
//
// router.get("/deletepatient", (req, res) => {
//   var email = req.params.email;

//   Promise.all([Room.find({}), Patient.findOne({ email: email })])
//     .then((data) => {
//       var rooms = data[0];
//       var patient = data[1];

//       // if the patient is in a room, make the room empty
//       if (patient.room !== "noroom") {
//         for (var i = 0; i < rooms.length; ++i) {
//           if (rooms[i].name === patient.room) {
//             rooms[i].availability = false;
//             rooms[i].save();
//             break;
//           }
//         }
//       }

//       patient.remove().then((patients) => {
//         res.status(200).redirect("/api");
//       });
//     })
//     .catch((err) => {
//       res.status(400).redirect("/api");
//     });
// });



router.post("/updatedoctoraccount", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      const name= req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
      // const sex = req.body.sex;
      const degree = req.body.degree;
      const speciality = req.body.speciality;
      const avgDiagnosisTime  = req.body.avgDiagnosisTime
      

      // GET form attributes
      // var PD = req.body.PD;
      // if (_.isEmpty(PD)) {
      //   PD = [];
      // }

      Doctor.findByIdAndUpdate(
        payload._id,
        { name:name,
          email: email,
          phone: phone,
          avgDiagnosisTime:avgDiagnosisTime,
          speciality:speciality,
          degree:degree,


        }
        // {
        //   $set: {
        //     diseases: PD,
        //     lastUpdate: new Date().getTime(),
        //   },
        // },
        // {
        //   new: true,
        // }
      )
        .then((doctor) => {
          // patient.updateScore();
          res.send({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.send({ success: false });
        });
    }
  });
});











module.exports = router;

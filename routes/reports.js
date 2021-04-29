const Reception = require("../models/Reception");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Ward = require("../models/Ward");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get("/patientreport", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!", success: false });
    } else {
      var Repo = {};

      Reception.findOne({ patient: payload._id }).exec((err, reception) => {
        if (reception) {
          Repo.consultantWord = reception.consultantWord;
          Repo.complications = reception.complications;

          Repo.medicines = reception.medicines;
          Repo.dateCreated = reception.dateCreated;
          Repo.lastModified = reception.lastModified;
          Repo.bedAllocated = reception.bedAllocated;
          Doctor.findById(reception.consultant).exec((err, doctor) => {
            if (doctor) {
              Repo.consultant = doctor.name;
              Patient.findById(payload._id).exec((err, patient) => {
                if (patient) {
                  Repo.name = patient.name;
                  Repo.blood_group = patient.blood_group;
                  Repo.dateofbirth = patient.dateofbirth;
                  Repo.sex = patient.sex;
                  Repo.allergies = patient.allergies;
                  res.send({
                    success: true,
                    report: Repo,
                  });
                } else {
                  res.send({ success: false });
                }
              });
            } else {
              res.send({ success: false });
            }
          });
        } else {
          res.send({ success: false });
        }
      });
    }
  });
});

router.post("/doctorreport", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!", success: false });
    } else {
      var Repo = {};

      Reception.findOne({ patient: req.body.patientId }).exec(
        (err, reception) => {
          if (err || !reception) {
            res.send({ success: false });
          } else {
            Repo.consultantWord = reception.consultantWord;
            Repo.complications = reception.complications;

            Repo.medicines = reception.medicines;
            Repo.dateCreated = reception.dateCreated;
            Repo.lastModified = reception.lastModified;
            Repo.bedAllocated = reception.bedAllocated;
            Repo.allocateBed = reception.bedAllocated ? true : false;
            Doctor.findById(payload._id).exec((err, doctor) => {
              if (err || !doctor) {
                res.send({ success: false });
              } else {
                Repo.consultant = doctor.name;
                Patient.findById(req.body.patientId).exec((err, patient) => {
                  if (err || !patient) {
                    res.send({ success: false });
                  } else {
                    Repo.name = patient.name;
                    Repo.blood_group = patient.blood_group;
                    Repo.dateofbirth = patient.dateofbirth;
                    Repo.sex = patient.sex;
                    Repo.allergies = patient.allergies;
                    res.send({
                      success: true,
                      report: Repo,
                    });
                  }
                });
              }
            });
          }
        }
      );
    }
  });
});

router.post("/editdoctorreport", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      var consultantWord = req.body.consultantWord;
      var medicines = req.body.medicines;
      var Allocatedbed = req.body.bedAllocated;
      var patient = req.body.patientId;
      Reception.findOneAndUpdate(
        { patient },
        {
          consultantWord: consultantWord,
          medicines: medicines,
        }
      )
        .then((reception) => {
          Doctor.findByIdAndUpdate(payload._id, {
            $inc: { patientsInQueue: 1 },
          })

            .then((doctor) => {
              if (Allocatedbed) {
                Reception.findOne({ patient }).then((reception) => {
                  if (reception.bedAllocated === 0) {
                    Ward.findOne({ speciality: reception.speciality }).exec(
                      (err, ward) => {
                        if (ward.total_occupied.length > 0) {
                          Reception.findByIdAndUpdate(reception._id, {
                            bedAllocated: ward.total_occupied[0],
                          })
                            .then((reception) => {
                              Ward.findByIdAndUpdate(ward._id, {
                                total_occupied: ward.total_occupied.slice(1),
                                $inc: { maxCapacity: -1 },
                              })
                                .then((ward) => {
                                  res.send({ success: true });
                                })
                                .catch((err) => {
                                  console.log(err);
                                  res.send({ success: false });
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                              res.send({ success: false });
                            });
                        } else {
                          res.send({
                            success: false,
                            msg:
                              "No Beds Available! Please search it in other hospitals",
                          });
                        }
                      }
                    );
                  } else {
                    res.send({ success: true });
                  }
                });
              } else {
                Reception.findOne({ patient })
                  .then((reception) => {
                    if (reception.bedAllocated != 0) {
                      Ward.findOne({ speciality: reception.speciality }).exec(
                        (err, ward) => {
                          ward.total_occupied.push(reception.bedAllocated);
                          ward.total_occupied.sort(function (a, b) {
                            return a - b;
                          });
                          Ward.findByIdAndUpdate(ward._id, {
                            total_occupied: ward.total_occupied,
                            $inc: { maxCapacity: 1 },
                          })
                            .then((ward) => {
                              Reception.findByIdAndUpdate(reception._id, {
                                bedAllocated: 0,
                              })
                                .then((reception) => {
                                  res.send({ success: true });
                                })
                                .catch((err) => {
                                  console.log(err);
                                  res.send({ success: false });
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                              res.send({ success: false });
                            });
                        }
                      );
                    } else {
                      res.send({ success: true });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send({ success: false });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.send({ success: false });
            });
        })
        .catch((err) => {
          console.log(err);
          res.send({ success: false });
        });
    }
  });
});
module.exports = router;
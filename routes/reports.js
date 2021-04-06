const Reception = require("../models/Reception");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get("/report", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!", success: false });
    }

    var Repo = {};

    Reception.findOne({ patient: payload._id }).exec((err, reception) => {
      if (reception) {
        
            Repo.consultantWord = reception.consultantWord;
            Repo.complications = reception.complications;
            
            Repo.medicines = reception.medicines;
            Repo.dateCreated = reception.dateCreated;
            Repo.lastModified = reception.lastModified;
        Doctor.findById(reception.consultant).exec((err, doctor) => {
          if (doctor) {
            Repo.consultant = doctor.name;
          } else {
            res.send({ success: false });
          }
        });
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
  });
});

module.exports = router;
 
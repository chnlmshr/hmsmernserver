const Reception = require("../models/Reception");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
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
      Reception.findOneAndUpdate(
        { patient: req.body.patientId },
        {
          consultantWord: consultantWord,
          medicines: medicines,
        }
      )
        .then((reception) => {
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

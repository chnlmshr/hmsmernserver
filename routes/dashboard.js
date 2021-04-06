const router = require("express").Router(),
  jwt = require("jsonwebtoken"),
  Patient = require("../models/Patient"),
  Doctor = require("../models/Doctor");

router.get("/patient", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, patient) => {
    if (err) {
      res.send({
        err: true,
      });
    }
    const iat = parseInt(patient.iat);
    Patient.findById(patient._id)
      .select(["-password", "-_id"])
      //.populate('')
      .exec((err, patient) => {
        if (err)
          res.send({
            err: true,
          });
        else if (parseInt(patient.date) > iat)
          res.send({
            err: true,
          });
        else {
          res.send({
            patient: patient,
          });
        }
      });
  });
});

router.get("/doctor", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, doctor) => {
    if (err) {
      res.send({
        err: true,
      });
    }
    const iat = parseInt(doctor.iat);
    Doctor.findById(doctor._id)
      .select(["-password", "-_id"])
      //.populate('')
      .exec((err, doctor) => {
        if (err)
          res.send({
            err: true,
          });
        else if (parseInt(doctor.date) > iat)
          res.send({
            err: true,
          });
        else {
          res.send({
            doctor: doctor,
          });
        }
      });
  });
});

module.exports = router;

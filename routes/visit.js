const Doctor = require("../models/Doctor");
const Reception = require("../models/Reception");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/visit", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ success: false, err: "Something went wrong!" });
    } else {
      Reception.findOne({ patient: payload._id })
        .then((reception) => {
          Reception.findByIdAndUpdate(reception._id, {
            lastModified: Date.now(),
            consultant: req.body.consultant,
          })
            .then((reception) => {
              Doctor.findById(req.body.consultant).then((doctor) => {
                res.send({
                  success: true,
                  waitingTime: doctor.avgDiagnosisTime * doctor.patientsInQueue,
                  patientsInQueue: doctor.patientsInQueue,
                });
              });
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

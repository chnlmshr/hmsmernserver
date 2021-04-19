const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Patient = require("../models/Patient");
const Reception = require("../models/Reception");

router.get("/choosepatient", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      var list = [];
      var patlist = [];

      Reception.find({ consultant: payload._id })
        .then((reception) => {
          if (!reception) {
            res.send({
              success: false,
            });
          } else {
            let idlist = [];
            reception.forEach((element) => {
              idlist.push(element.patient);
            });
            Patient.find({
              _id: { $in: idlist },
            }).then((patients) => {
              patients.forEach((element) => {
                patlist.push({
                  _id: element._id,
                  name: element.name,
                  phone: element.phone,
                  DOB: element.dateofbirth,
                });
              });
              res.send({
                success: true,
                patients: patlist,
              });
            });
          }
        })
        .catch((err) => {
          res.send({
            success: false,
          });
        });
    }
  });
});
module.exports = router;

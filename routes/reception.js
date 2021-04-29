const Reception = require("../models/Reception");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

router.post("/reception", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      var complications = req.body.complications;
      var speciality = req.body.department;
      Reception.findOne({ patient: payload._id }, (err, reception) => {
        if (err) res.send({ success: false });
        else if (!reception) {
          Reception.create({
            complications: complications,
            speciality: speciality,
            patient: payload._id,
          })
            .then((reception) => {
              res.send({ success: true });
            })
            .catch((err) => {
              console.log(err);
              res.send({ success: false });
            });
        } else {
          Reception.findOneAndUpdate(
            { patient: payload._id },
            {
              complications: complications,
              speciality: speciality,
              dateCreated: Date.now(),
              lastModified: Date.now(),
              //consultant: " ",
              consultantWord: "",
              medicines: "",
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
    }
  });
});
module.exports = router;

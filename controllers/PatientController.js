const Patient = require("../models/Patient"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken");

function registerPat(req, res) {
  if (req.body.password !== req.body.confirmpassword) {
    res.send({
      err: "Password and Confirm Password doesn't match!",
    });
  } else {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
      if (err) {
        res.send({
          err: "Something went wrong!",
        });
      } else {
        let patient = new Patient({
          name: req.body.name,
          email: req.body.email,
          password: hashedPass,
          phone: req.body.phone,
          dateofbirth: req.body.dateofbirth,
          sex: req.body.sex,
        });
        patient
          .save()
          .then((patient) => {
            let token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET);
            if (token)
              res.send({
                token: token,
                patient: true,
              });
            else
              res.send({
                err: "Something went wrong!",
              });
          })
          .catch((error) => {
            res.send({
              err: "Something went wrong!",
            });
          });
      }
    });
  }
}

const loginPat = (req, res) => {
  Patient.findOne({ email: req.body.email }).then((patient) => {
    if (patient) {
      bcrypt.compare(
        req.body.password,
        patient.password,
        function (err, result) {
          if (err) {
            res.send({
              err: "Something went wrong!",
            });
          } else if (result) {
            let token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET);
            if (token)
              res.send({
                token: token,
                patient: true,
              });
            else
              res.send({
                err: "Something went wrong!",
              });
          } else {
            res.send({
              err: "Email or passwoord is Wrong!",
            });
          }
        }
      );
    } else {
      res.send({
        err: "Email or passwoord is Wrong!",
      });
    }
  });
};

module.exports = {
  registerPat,
  loginPat,
};

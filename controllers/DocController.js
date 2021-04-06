const Doctor = require("../models/Doctor"),
  Admin = require("../models/Admin"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken");

function registerDoc(req, res) {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      Admin.findById(payload._id, (err, admin) => {
        if (err || !admin) {
          res.send({ err: "Something went wrong!" });
        } else {
          bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
            if (err) {
              res.send({
                err: "Something went wrong!",
              });
            } else {
              let doctor = new Doctor({
                email: req.body.email,
                password: hashedPass,
              });
              doctor
                .save()
                .then((doctor) => {
                  if (doctor)
                    res.send({
                      doctor: true,
                    });
                  else
                    res.send({
                      err: "Something went wrong!",
                    });
                })
                .catch((error) => {
                  res.send({
                    err: error._message,
                  });
                });
            }
          });
        }
      });
    }
  });
}

const loginDoc = (req, res) => {
  Doctor.findOne({ email: req.body.email }).then((doctor) => {
    if (doctor) {
      bcrypt.compare(
        req.body.password,
        doctor.password,
        function (err, result) {
          if (err) {
            res.send({
              err: "Something went wrong!",
            });
          } else if (result) {
            let token = jwt.sign({ _id: doctor._id }, process.env.JWT_SECRET);
            if (token)
              res.send({
                token: token,
                doctor: true,
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
  registerDoc,
  loginDoc,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const Ward = require("../models/Ward");
const router = require("express").Router();

router.post("/loginAdmin", (req, res) => {
  Admin.findOne({ adminId: req.body.adminId }).then((admin) => {
    if (admin) {
      bcrypt.compare(req.body.password, admin.password, function (err, result) {
        if (err) {
          res.send({
            err: "Something went wrong!",
          });
        } else if (result) {
          let token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
          if (token)
            res.send({
              token: token,
              admin: true,
            });
          else
            res.send({
              err: "Something went wrong!",
            });
        } else {
          res.send({
            err: "id or passwoord is Wrong!",
          });
        }
      });
    } else {
      res.send({
        err: "id or passwoord is Wrong!",
      });
    }
  });
});

router.post("/changepasswordadmin", (req, res) => {
  const admin = req.body.token.split(" ")[0],
    token = req.body.token.split(" ")[1],
    password = req.body.password,
    newpassword = req.body.newpassword;
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      if (admin) {
        Admin.findById(payload._id, (err, admin) => {
          if (err || !admin) {
            res.send({ err: "Something went wrong!" });
          } else {
            bcrypt.compare(password, admin.password, (err, match) => {
              if (err) {
                res.send({ err: "Something went wrong!" });
              } else if (!match) {
                res.send({ err: "Please Enter correct old password!" });
              } else {
                bcrypt.hash(newpassword, 10, (err, hashedPass) => {
                  if (err || !hashedPass) {
                    res.send({ err: "Something went wrong!" });
                  } else {
                    Admin.findByIdAndUpdate(
                      payload._id,
                      {
                        password: hashedPass,
                      },
                      (err, admin) => {
                        if (err || !admin) {
                          res.send({ err: "Something went wrong!" });
                        } else {
                          jwt.sign(
                            { _id: admin._id },
                            process.env.JWT_SECRET,
                            (err, newtoken) => {
                              if (err || !newtoken) {
                                res.send({ err: "Something went wrong!" });
                              } else {
                                res.send({ token: newtoken, admin: true });
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
      }
    }
  });
});

router.post("/bedUpdate", (req, res) => {
  const token = req.body.token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload) {
      res.send({ err: "Something went wrong!" });
    } else {
      const speciality = req.body.speciality;
      const maxCapacity = req.body.maxcapacity;

      Ward.findOne({ speciality }).exec((err, ward) => {
        if (err) {
          res.send({ success: false });
        } else if (!ward) {
          let total_occupied = [];
          for (var i = 1; i <= maxCapacity; i++) {
            total_occupied.push(i);
          }
          Ward.create({ speciality, maxCapacity, total_occupied })
            .then((ward) => {
              res.send({ success: true });
            })
            .catch((err) => {
              console.log(err);
              res.send({ success: false });
            });
        } else {
          if (ward.maxCapacity < maxCapacity) {
            let total_occupied = ward.total_occupied;
            for (var i = ward.maxCapacity + 1; i <= maxCapacity; i++) {
              total_occupied.push(i);
            }
            Ward.findByIdAndUpdate(ward._id, { total_occupied, maxCapacity })
              .then((ward) => {
                res.send({ success: true });
              })
              .catch((err) => {
                console.log(err);
                res.send({ success: false });
              });
          } else if (ward.maxCapacity > maxCapacity) {
            if (ward.total_occupied.length >= ward.maxCapacity - maxCapacity) {
              let total_occupied = ward.total_occupied.slice(
                0,
                ward.total_occupied.length - ward.maxCapacity + maxCapacity
              );
              Ward.findByIdAndUpdate(ward._id, { total_occupied, maxCapacity })
                .then((ward) => {
                  res.send({ success: true });
                })
                .catch((err) => {
                  console.log(err);
                  res.send({ success: false });
                });
            } else {
              res.send({ success: false });
            }
          } else {
            res.send({ success: true });
          }
        }
      });
    }
  });
});

module.exports = router;

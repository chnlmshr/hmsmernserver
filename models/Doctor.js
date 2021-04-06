const mongoose = require("mongoose");

const DoctorSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  degree: {
    type: String,
  },
  date: {
    type: Number,
    default: Math.round(Date.now() / 1000),
  },
  speciality: {
    type: String,
  },
  avgDiagnosisTime: {
    type: Number,
    default: 0,
  },
  patientsInQueue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Doctor", DoctorSchema);

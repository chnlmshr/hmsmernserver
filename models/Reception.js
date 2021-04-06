const mongoose = require("mongoose");

var ReceptionSchema = mongoose.Schema({
  complications: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
  consultant: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  consultantWord: {
    type: String,
    required: false,
  },
  medicines: {
    type: String,
    required: false,
  },
});
var Reception = mongoose.model("Reception", ReceptionSchema);
module.exports = Reception;

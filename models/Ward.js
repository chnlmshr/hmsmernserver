const mongoose = require("mongoose");

var WardSchema = mongoose.Schema({
  speciality: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  total_occupied: {
    type: [Number],
    required: true,
  },
});

var Ward = mongoose.model("Ward", WardSchema);

module.exports = Ward;

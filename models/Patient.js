const mongoose = require("mongoose");
const { scoreOfDisease, Disease } = require("./Disease");

const PatientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    required: true,
  },
  dateofbirth: {
    type: Date,
    required: true,
  },
  address: {
    custom: String,
    city: String,
    state: String,
    zip: Number,
  },
  blood_group: {
    type: String,
  },
  allergies: [
    {
      type: String,
    },
  ],
  diseases: {
    type: Array,
    default: [],
  },
  sex: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  room: {
    type: String,
    required: true,
    default: "noroom",
  },
  lastUpdate: {
    type: Number,
  },
  date: {
    type: Number,
    default: Math.round(Date.now() / 1000),
  },
});

// PatientSchema.methods.updateScore = function () {
//   var patient = this;

//   // promise to get the patient object inside the diseases callback
//   var promise = new Promise(function (resolve, reject) {
//     resolve(patient);
//     reject(patient);
//   });

//   Promise.all([
//     promise.then(function (patient) {
//       return patient;
//     }),
//     Disease.find({})
//   ])
//     .then((data) => {
//       var patient = data[0];
//       var diseases = data[1];

//       var scoreOfDisease = {};
//       var score = 0;

//       if (!_.isEmpty(diseases) && _.isArray(diseases)) {
//         // create a hashmap with the diseases and their scores
//         for (var i = 0; i < diseases.length; ++i) {
//           scoreOfDisease[diseases[i].name] = diseases[i].score;
//         }

//         for (var i = 0; i < patient.diseases.length; ++i) {
//           if (scoreOfDisease[patient.diseases[i]] > score) {
//             score = scoreOfDisease[patient.diseases[i]];
//           }
//         }
//       }

//       patient.score = score;
//       patient.save().catch((err) => {
//         console.log(err);
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

module.exports = mongoose.model("Patient", PatientSchema);

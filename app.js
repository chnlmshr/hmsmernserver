const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express();

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB is up"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 9999, () => {
  console.log("Server is up");
});
const auth=require("./routes/authentication")
const dashboard=require("./routes/dashboard")
const disease=require("./routes/disease")
const reception=require("./routes/reception")
const settings=require("./routes/settings")
const choosedoctor=require('./routes/choosedoctor')
const report=require('./routes/reports')
const visit=require('./routes/visit')
const admin=require('./routes/admin')

app.use("/api", auth);
app.use("/api", dashboard);
app.use("/api", disease);
app.use("/api", settings);
//app.use("/api", require("./routes/rooms"));
app.use("/api",reception);
app.use("/api",choosedoctor);
app.use("/api",report);
app.use("/api",visit);
app.use("/api",admin);
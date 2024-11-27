const express = require("express");
const mongoose = require("mongoose");
const conn = require("./db");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const cors = require("cors");
const app = express();

app.options("*", cors());

const allowedOrigins = ["https://job-portal-backend-rhaq.onrender.com/"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        console.log("Cor successfull");
        callback(null, true);
      } else {
        console.log("Cor Failed");
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(bodyParser.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello from server side!");
});

// app.use("", authRoutes);
// app.use("/api/menu", require("./routes/menu"));
// app.use("/api/permission", require("./routes/permission"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/usr", require("./routes/user"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/hiringManager", require("./routes/hiringManager"));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

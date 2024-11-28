const express = require("express");
const mongoose = require("mongoose");
const conn = require("./db");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const cors = require("cors");
const app = express();

app.use(cors());

// const allowedOrigins = ["https://job-portal-backend-rhaq.onrender.com/"];
// const allowedOrigins = ["https://localhost:5173/"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin) || !origin) {
//         console.log("Cor successfull");
//         callback(null, true);
//       } else {
//         console.log("Cor Failed");
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
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

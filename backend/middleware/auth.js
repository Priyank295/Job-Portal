// const jwt = require("jsonwebtoken");

// function auth(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     console.log("No token provided");
//     return res.status(401).send("Access Denied: No token provided.");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//     if (err) {
//       console.error("Token verification failed:", err.message);
//       return res.status(403).send("Invalid Token");
//     }

//     req.user = {
//       id: decodedToken.user?.id,
//       username: decodedToken.user?.username,
//       role: decodedToken.user?.role,
//     };

//     next();
//   });
// }

// module.exports = auth;

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("====================================");
    // console.log(decoded);
    // console.log("====================================");
    const user = await User.findById(decoded.payload.user.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = auth;

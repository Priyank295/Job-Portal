const mongoose = require("mongoose");

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles == req.user?.role) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
}

module.exports = authorizeRole;

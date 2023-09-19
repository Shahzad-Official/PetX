var jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  if (req.headers.authorization == null) {
    res.status(400).json({ success: false, message: "Token is required!" });
  } else {
    var token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(400).json({ success: false, message: "Invalid token!" });
      } else {
        next();
      }
    });
  }
}

module.exports = {
  verifyToken,
};

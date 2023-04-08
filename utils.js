const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secretToken");

exports.createHashedPassword = (payload, time) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
};

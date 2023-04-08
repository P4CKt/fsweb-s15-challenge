const { getAll, getByUser, insertUser } = require("./auth-model");
const bcrypt = require("bcryptjs");

const payloadValidation = async function (req, res, next) {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ message: "username ve şifre gereklidir" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const usernameValidation = async function (req, res, next) {
  try {
    const { username } = req.body;
    let isValid = await getByUser({ username, username });
    if (isValid) {
      req.profile = isValid;
      next();
    } else {
      next({
        status: 401,
        message: "username alınmış",
      });
    }
  } catch (error) {
    next(error);
  }
};
const passwordValidation = async function (req, res, next) {
  try {
    const { password } = req.body;
    let validPassword = bcrypt.compareSync(password, req.profile.password);
    if (!validPassword) {
      res.status(401).json({ message: "Geçersiz şifre" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  usernameValidation,
  passwordValidation,
  payloadValidation,
};

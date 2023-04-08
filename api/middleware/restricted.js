const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../secretToken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      jwt.verify(token, JWT_SECRET, (error, decodedJWT) => {
        if (error) {
          res.status(401).json({ message: "token gereklidir" });
        } else {
          req.decodedToken = decodedJWT;
          next();
        }
      });
    } else {
      res.status(401).json({
        message: "token gereklidir",
      });
    }
  } catch (error) {
    next(error);
  }

  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
};

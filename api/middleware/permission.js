module.exports = (req, res, next) => {
  try {
    if (req.decodedToken.role_name == "admin") {
      next();
    } else {
      res.status(401).json({
        message: "bu alan Mugglelar için uygun değildir.",
      });
    }
  } catch (error) {
    next(error);
  }
};

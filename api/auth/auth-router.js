const router = require("express").Router();
const bcrypt = require("bcryptjs");
const utils = require("../../utils");
const {
  usernameValidation,
  passwordValidation,
  payloadValidation,
} = require("./auth-middleware");
const { getAll, getByUser, insertUser } = require("./auth-model");
router.post(
  "/register",

  payloadValidation,
  async (req, res, next) => {
    try {
      const model = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        role_name: req.body.role_name == "admin" ? "admin" : "user",
      };
      let inserted = await insertUser(model);
      res.status(201).json(inserted);
    } catch (error) {
      next(error);
    }

    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
  }
);

router.post(
  "/login",
  payloadValidation,
  usernameValidation,
  passwordValidation,

  async (req, res, next) => {
    try {
      const model = {
        username: req.body.username,
        role_name: req.profile.role_name,
      };

      const token = utils.createHashedPassword(model, "1d");
      res.json({
        message: `welcome, ${model.username}`,
        token: token,
      });
    } catch (error) {
      next(error);
    }

    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
  }
);

module.exports = router;

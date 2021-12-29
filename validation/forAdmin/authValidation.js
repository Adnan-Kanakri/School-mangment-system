const { body } = require("express-validator");
const accountService = require("../../service/account.service");
const adminService = require("../../service/admin.service");
const signup = [
  body("username")
    .trim()
    .isLowercase()
    .isLength({ max: 8, min: 3 })
    .custom((value, { req }) => {
      return accountService.findByUsername(value).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("User Name already exists");
        }
      });
    }),
  body("password")
    .isLength({ max: 8, min: 3 })
    .trim()
    .withMessage("Enter A Vailad Password")
    .custom((value, { req }) => {
      let confirm = req.body.confirm;
      if (value !== confirm) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  // body("email")
  //   .isEmail()
  //   .withMessage("Please enter a valid email address")
  //   .custom((value, { req }) => {
  //     return accountService.findByEmail(value).then((userDoc) => {
  //       if (userDoc) {
  //         return Promise.reject("E-mail address already exists");
  //       }
  //     });
  //   })
  //   .normalizeEmail(),
  // body("phone")
  //   .isMobilePhone()
  //   .withMessage("Enter A Vailad Phone Number")
  //   .trim()
  //   .custom((value, { req }) => {
  //     return adminService.findByPhoneNumber(value).then((userDoc) => {
  //       if (userDoc) {
  //         return Promise.reject("Mobile Phone already exists");
  //       }
  //     });
  //   }),
];
const login = [
  body("password")
    .isAlphanumeric()
    .trim()
    .withMessage("Enter A Vailad Passwoed"),
  // body("email")
  //   .isEmail()
  //   .withMessage("Please enter a valid email address")
  //   .normalizeEmail(),
  body("username")
    .isLowercase()
    .isLength({ max: 8, min: 3 })
    .withMessage("Enter A Vailad User name")
    .trim(),
];

module.exports = {
  login: login,
  signup: signup,
};

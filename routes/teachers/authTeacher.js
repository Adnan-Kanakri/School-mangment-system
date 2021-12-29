const express = require("express");
const route = express.Router();

const adminAuthController = require("../../controllers/auth/adminAuthController");

const teacherAuthController = require("../../controllers/auth/teacherAuthController");
const adminValidation = require("../../validation/forAdmin/authValidation");
const is_auth = require("../../middleware/is-auth");
const is_admin = require("../../middleware/is-admin");
const noticController = require("../../controllers/teachers/noticController");

route.post("/login", teacherAuthController.login);
route.post(
  "/create",
  adminValidation.signup,
  adminAuthController.createNewAccount
);
route.post("/notic", is_auth, noticController.addteacherNotic);
route.get("/last", is_auth, noticController.showNotic);


module.exports = route;

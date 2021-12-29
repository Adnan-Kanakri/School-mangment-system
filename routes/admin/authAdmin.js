const express = require("express");
const route = express.Router();

const adminAuthController = require("../../controllers/auth/adminAuthController");
const adminValidation = require("../../validation/forAdmin/authValidation");
const is_auth = require("../../middleware/is-auth");
const is_admin = require("../../middleware/is-admin");
const noticController = require("../../controllers/admin/noticController");

route.post("/login", adminAuthController.login);
// route.post("/signup",adminValidation.signup,adminAuthController.signUp);
route.post(
  "/create",
  adminValidation.signup,
  adminAuthController.createNewAccount
);

route.post("/activeAccount/:id", is_auth, adminAuthController.activeAccount);
route.post("/deleteAccount/:id", is_auth, adminAuthController.deleteAccount);
route.post("/updateAccount/:id", is_auth, adminAuthController.updateAccount);

route.get("/getAdminInfo/:id", is_auth, adminAuthController.getAdminInfo);
route.get("/getAllUsers", is_auth, is_admin, adminAuthController.getAdminsInfo);
route.post(
  "/add-photo",
  is_auth,
  is_admin,
  adminAuthController.addImageToProfile
);
route.post(
  "/remove-photo",
  is_auth,
  is_admin,
  adminAuthController.removeImageFormProfile
);

route.post("/notic", is_auth, noticController.addAdminNotic);
route.get("/last", is_auth, noticController.showNotic);
route.post("/deleteAllnotic", is_auth, noticController.deleteAllNotic);

module.exports = route;

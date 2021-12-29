const admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult, body } = require("express-validator");
const roleService = require("../../service/role.service");
const createError = require("http-errors");
const accountService = require("../../service/account.service");
const adminService = require("../../service/admin.service");
const teacherService = require("../../service/teacher.service");
const studentService = require("../../service/student.service");
const server_constant = require("../../config/server_constant");
const account = require("../../models/account");
const uploadService = require("../../service/upload.service");

exports.createNewAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          param: err.param,
          message: err.msg,
          location: err.location,
        })
      );

      throw createError.NotAcceptable({
        array_error: extractedErrors,
        code: 406,
      });
    }
    let { email, password, username, role_id, image, phone } = req.body;
    const role = await roleService.findById(role_id);
    if (!role) {
      throw createError.NotFound(`role with id ${role_id} not found`);
    }
    let sub_user = null;
    let account = null;
    switch (role.key) {
      case "admin":
      case "mini_admin": {
        sub_user = await adminService.create(image, phone);
        account = await accountService.create(
          password,
          email,
          username,
          sub_user.id,
          role
        );
        await adminService.setAccountId(sub_user, account.id);
        await adminService.save(sub_user);
        break;
      }
      case "teacher": {
        sub_user = await teacherService.create(image, phone);
        account = await accountService.create(
          password,
          email,
          username,
          sub_user.id,
          role
        );
        console.log(sub_user);
        await teacherService.setAccountId(sub_user, account.id);
        await teacherService.save(sub_user);
        break;
      }
      case "student": {
        sub_user = await studentService.create(image, phone);
        account = await accountService.create(
          password,
          email,
          username,
          sub_user.id,
          role
        );
        await studentService.setAccountId(sub_user, account.id);
        await studentService.save(sub_user);
        break;
      }
      default:
        break;
    }
    const saved_account = await accountService.save(account);
    res.send(saved_account);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// exports.signUp = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed.");
//     error.statusCode = 422;
//     error.data = errors.array();
//     return res.status(422).send({
//       message: errors.array(),
//     });
//   }
//   const username = req.body.username;
//   const password = req.body.password;
//   const email = req.body.email;
//   const phone = req.body.phone;
//   try {
//     const hashpassword = await bcrypt.hash(password, 12);
//     const Admin = new admin();
//     const Account = new account({
//       username: username,
//       password: hashpassword,
//       email: email,
//       adminId: Admin.id,
//     });
//     Admin.phone = phone;
//     Admin.accountId = Account.id;
//     const adminAccount = await Account.save();
//     const adminUser = await Admin.save();
//     res.status(200).json({
//       message: "sign up successfully",
//       adminId: adminUser.id,
//     });
//   } catch (error) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

exports.login = async (req, res, next) => {
  const value = req.body.username || req.body.email;
  const password = req.body.password;
  let loadUser;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          param: err.param,
          message: err.msg,
          location: err.location,
        })
      );
      throw createError.NotAcceptable({
        array_error: extractedErrors,
        code: 406,
      });
    }
    const user =
      (await accountService.findByUsername(value)) ||
      (await accountService.findByEmail(value));
    if (!user) {
      const error = new Error(
        "A user with this email or user name could not be found."
      );
      error.data = errors.array();
      throw createError.NotFound({
        array_error: error.message,
        code: 401,
      });
    }
    if (!user.is_active) {
      const error = new Error("your account is disable plaease active it");
      error.data = errors.array();
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    loadUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    const token = jwt.sign(
      {
        adminId: user.id,
        type: user.Role.key,
        permission: user.Role.permissions,
      },
      process.env.TOKEN_SECRT_KEY
    );
    res.status(200).json({
      token: token,
      userId: user.id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    console.log(error);
    next(error);
  }
};

exports.activeAccount = async (req, res, next) => {
  const id = req.params.id;
  console.log(req.payload);
  try {
    let adminUser = await accountService.findById(id);
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_ACTIVE_USERS_INDEX)) {
      const error = new Error(
        "you dont have the permission to active this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    if (adminUser.is_active) {
      const error = new Error("this account already active!");
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 401,
      });
    }
    accountService.setActive(adminUser);
    res.status(201).json({
      message: "activeition successfully",
      user: adminUser,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.deleteAccount = async (req, res, next) => {
  const accountId = req.params.id;
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_DELETE_USER_INDEX)) {
      const error = new Error(
        "you dont have the permission to active this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let adminUser = await accountService.findById(accountId);
    if (!adminUser) {
      const error = new Error("No User Found!");
      throw createError.NotFound({
        array_error: error.message,
        code: 404,
      });
    }
    accountService.checKAccountTypeAndDelete(adminUser);
    accountService.deleteAccount(accountId);
    res.status(201).json({
      message: "delete successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // console.log(err);
    next(err);
  }
};

exports.getAdminInfo = async (req, res, next) => {
  console.log(req.payload);
  const adminId = req.params.id;
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_SHOW_USER_INDEX)) {
      const error = new Error(
        "you dont have the permission to active this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let user = await adminService.findById(adminId);
    if (!user) {
      const error = new Error("couldn't find a user.");
      throw createError.NotFound({
        array_error: error.message,
        code: 404,
      });
    }
    let account = await accountService.findById(user.accountId);
    res.status(200).json({
      message: "fetch successfully",
      user: user,
      account: account,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // console.log(err)
    next(err);
  }
};

exports.getAdminsInfo = async (req, res, next) => {
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_SHOW_USERS_INDEX)) {
      const error = new Error(
        "you dont have the permission to show all accounts!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let adminsArray = [];
    let user = await admin.find();
    for (let index = 0; index < user.length; index++) {
      let accountt = await account.findOne({ _id: user[index].accountId });
      let user1 = user[index];
      let user3 = {
        user1,
        accountt,
      };
      adminsArray.push(user3);
    }
    if (!user) {
      const err = new Error("couldn't find a user.");
      throw createError.NotFound({
        array_error: err.message,
        code: 404,
      });
    }
    res.status(200).json({
      message: "fetch successfully",
      admins: adminsArray,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    // console.log(perm)
    if (!perm.includes(server_constant.Permessions.CAN_EDIT_USER_INDEX)) {
      const error = new Error(
        "you dont have the permission to Edit this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let user = await accountService.findById(req.params.id);
    if (!user) {
      const error = new Error(
        "A user with this email or user name could not be found."
      );
      error.data = errors.array();
      throw createError.NotFound({
        array_error: error.message,
        code: 401,
      });
    }
    let { email, password, username, phone } = req.body;
    const findAdmin = await adminService.findById(user.adminId);
    let user1 = await accountService.updateAccount(
      user,
      email,
      password,
      username
    );
    let user2 = await adminService.updatePhone(findAdmin, phone);
    await accountService.save(user1);
    let userUpdate = {
      user1,
      user2,
    };
    res.status(200).json({
      message: "update it successfully",
      user: userUpdate,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.showProfile = async (req, res, next) => {};

exports.addImageToProfile = async (req, res, next) => {
  const imageUrl = req.file;
  const profileId = req.payload.adminId;
  try {
    if (!imageUrl) {
      const error = new Error("No image provided");
      // error.statusCode = 422;
      throw createError.NotFound({
        array_error: error.message,
        code: 401,
      });
    }
    // admin.updateOne
    const user = await adminService.findById(profileId);
    let userupdate = user.updateOne({
      image: "images/" + imageUrl.path,
    });
    await adminService.save(userupdate);
    res.status(200).json({
      message: "done",
    });
  } catch (error) {
    next(error);
  }
};

exports.removeImageFormProfile = async (req, res, next) => {
  const profileId = req.payload.adminId;
  try {
    const user = await adminService.findById(profileId);
    if (!user.image) {
      const error = new Error("NO Image Found");
      throw createError.NotFound({
        array_error: error.message,
        code: 401,
      });
    }
    await uploadService.deleteImage(user.image);
    let updateUser = await user.updateOne({
      image: null,
    });
    await adminService.save(updateUser);
    res.status(200).json({
      message: "done",
    });
  } catch (error) {
    next(error);
  }
};

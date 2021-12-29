const student = require("../../models/student");
const admin = require("../../models/admin");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const accountService = require("../../service/account.service");
const studentService = require("../../service/student.service");

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
        StudentId: user.id,
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

// exports.activeAccount = async (req, res, next) => {
//   // console.log(req);
//   const accountId = req.params.id;
//   const adminId = req.admin.adminId.toString();
//   // console.log(adminId);
//   try {
//     let adminUser = await admin.findById(adminId);
//     console.log(adminUser);
//     if (adminUser.permission != "9") {
//       const error = new Error(
//         "you dont have the permission to active this account!"
//       );
//       error.statusCode = 401;
//       return res.status(401).send({
//         message: error.message,
//       });
//     }
//     let activeUser = await student.findById(accountId);
//     // console.log(activeUser);
//     if (activeUser.status) {
//       const error = new Error("this account already active!");
//       error.statusCode = 401;
//       return res.status(401).send({
//         message: error.message,
//       });
//     }
//     activeUser.status = true;
//     await student.updateOne({
//       status: true,
//     });
//     res.status(201).json({
//       message: "activeition successfully",
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

exports.deleteMyStudentAccount = async (req, res, next) => {
  // console.log(req);
  // const accountId = req.params.id;
  const adminId = req.payload.adminId;
  // console.log(adminId);
  try {
    let adminUser = await accountService.findById(adminId);
    console.log(adminUser);
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
    let activeUser = await studentService.deleteStudentAccount(adminUser.studentId);
    res.status(201).json({
      message: "delete successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateMyAccount = async (req, res, next) => {
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
  const findAdmin = await studentService.findById(user.studentId);
    let user1 = await accountService.updateAccount(
      user,
      email,
      password,
      username
    );
    let user2 = await studentService.updatePhone(findAdmin, phone);
    await accountService.save(user1);
    let userUpdate = {
      user1,
      user2,
    };
    res.status(200).json({
      message: "update it successfully",
      user: userUpdate,
    });
  try {
    
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getStudentInfo = async (req, res, next) => {
  const studentId = req.params.id;
  const adminId = req.admin.adminId;
  try {
    let adminUser = await admin.findById(adminId);
    if (adminUser.permission != "9") {
      const error = new Error(
        "you dont have the permission to show this account!"
      );
      error.statusCode = 401;
      return res.status(401).send({
        message: error.message,
      });
    }
    let user = await student.findById(studentId);
    if (!user) {
      const err = new Error("couldn't find a user.");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "fetch successfully",
      student: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentsInfo = async (req, res, next) => {
  const adminId = req.admin.adminId;
  try {
    let adminUser = await admin.findById(adminId);
    if (adminUser.permission != "9") {
      const error = new Error(
        "you dont have the permission to show this account!"
      );
      error.statusCode = 401;
      return res.status(401).send({
        message: error.message,
      });
    }
    let user = await student.find();
    if (!user) {
      const err = new Error("couldn't find a user.");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "fetch successfully",
      students: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

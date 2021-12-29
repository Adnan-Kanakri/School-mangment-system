const noticServise = require("../../service/notic.service");
const { validationResult } = require("express-validator");
const createError = require("http-errors");
const server_constant = require("../../config/server_constant");

exports.addAdminNotic = async (req, res, next) => {
  const noticLine = req.body.notic;
  const payload = req.payload;
  // console.log(req)
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
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_ADD_NOTIC)) {
      const error = new Error(
        "you dont have the permission to add Notic this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    const savedNotic = await noticServise.save(noticLine,payload);
    res.status(201).json({
      message: "added successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.showNotic = async (req, res, next) => {
  try {
    let not = await noticServise.getLastOne();
    if (!not) {
      const error = new Error("there is no notic to show!");
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    res.status(200).json({
      notic: not,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteAllNotic = async (req, res, next) => {
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_DELETE_NOTIC)) {
      const error = new Error(
        "you dont have the permission to add Notic this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let not = await noticServise.deleteAllNotic();
    if (not.deletedCount == 0) {
      const error = new Error("there is no notic to delete!");
      throw createError.NotFound({
        array_error: error.message,
        code: 422,
      });
    }
    res.status(200).json({
      notic: "Done",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteOneNotic = async (req, res, next) => {
  const id = req.params.id
  try {
    let perm = [];
    req.payload.permission.forEach((element) => {
      perm.push(element.key);
    });
    if (!perm.includes(server_constant.Permessions.CAN_DELETE_NOTIC)) {
      const error = new Error(
        "you dont have the permission to add Notic this account!"
      );
      throw createError.NotAcceptable({
        array_error: error.message,
        code: 422,
      });
    }
    let not = await noticServise.deleteNotic(id);
    if (not.deletedCount == 0) {
      const error = new Error("there is no notic to delete!");
      throw createError.NotFound({
        array_error: error.message,
        code: 422,
      });
    }
    res.status(200).json({
      notic: "Done",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

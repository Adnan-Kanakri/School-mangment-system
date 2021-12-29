const { TEACHER_ROLE_KEY } = require("../config/server_constant");
module.exports = (req, res, next) => {
  const payload = req.payload
  if(payload.type == TEACHER_ROLE_KEY){
    next();
  }else{
    const error = new Error("Not A teacher");
    throw createError.MethodNotAllowed({
      array_error: error.message,
      code: 422,
    });
  }
};
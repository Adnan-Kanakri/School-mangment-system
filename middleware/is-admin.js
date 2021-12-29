const { ADMIN_ROLE_KEY } = require("../config/server_constant");
const createError = require('http-errors');
module.exports = (req, res, next) => {
  const payload = req.payload
  if(payload.type == ADMIN_ROLE_KEY){
    next();
  }else{
    const error = new Error("Not admin");
    throw createError.MethodNotAllowed({
      array_error: error.message,
      code: 422,
    });
  }
};

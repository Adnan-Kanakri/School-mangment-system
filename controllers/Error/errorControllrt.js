exports.geterror = (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    success: false,
    error: {
      err: error.message,
      code: "" + error.message.code || 500,
      elements: error.message.array_error,
    },
  });
};

exports.errorMessage = (msg, param, location) => {
  return {
    location: location,
    param: param,
    message: msg,
  };
};

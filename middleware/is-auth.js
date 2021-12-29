const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {         ///////////////////// no token found
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token,process.env.TOKEN_SECRT_KEY);

  } catch (error) {
    error.statusCode = 500;
    throw error
  }
  if (!decodedToken) {   //////////////////////////////////token is not correct
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }
    req.payload = decodedToken
    next();
};

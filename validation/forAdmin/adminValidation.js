const { body } = require("express-validator");
const valid = [body(notic).notEmpty().toLowerCase()];

exports.validNotic = valid;

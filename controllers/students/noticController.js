const noticServise = require("../../service/notic.service");

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

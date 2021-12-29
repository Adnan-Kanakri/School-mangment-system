const multer = require("multer");
const fs = require("fs");
const path = require("path");

const conf = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({
  storage: conf,
  fileFilter: fileFilter,
}).single("image");

const deleteImage = function (pathImage) {
  pathImage = path.join(__dirname, "..", pathImage);
  fs.unlink(pathImage, (err) => {
    console.log(err);
  });
};

exports.upload = upload;
exports.deleteImage = deleteImage;

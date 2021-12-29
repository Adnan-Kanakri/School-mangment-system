const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const route = require("./routes");
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

const accessStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("dev", { stream: accessStream }));

//  import route
route.allRoutes(app);
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    success: false,
    error: {
      err: error.message,
      // code: "" + error.message.code || 500,
      // elements: error.message.array_error,
    },
  });
})

module.exports = app;

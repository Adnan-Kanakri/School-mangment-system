const mongoose = require("mongoose");
require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD;
let url = "";
if (DB_USER != "" && DB_USER_PASSWORD != "") {
  url = `mongodb://${DB_USER}:${DB_USER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
} else {
  url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const dbConnect = mongoose
  .connect(url)
  .then(() => {
    console.log("mongodb connected.");
  })
  .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = {
  dbConnect,
  mongoose,
};

const dotenv = require("dotenv").config();
require("./config/dataBase");
const app = require("./config/express_app");
app.listen(process.env.HOST_PORT, () => {
  console.log(
    `Server running on url http://${process.env.HOST_PORT}:${process.env.HOST_NAME}`
  );
});

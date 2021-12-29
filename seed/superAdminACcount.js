require("dotenv").config({path:"../.env"});
// require("../")
require("../config/dataBase");
const Admin = require("../models/admin");
const Account = require("../models/account");
const roleService = require("../service/role.service");
const bcrypt = require("bcryptjs");

console.log(process.env.DB_NAME);


const main = async () => {
  const username = "adnan";
  const password = "123";
  const email = "knakru@gmail.com";
  const phone = "+963999955554";
  try {
    const role =await roleService.findByKey("admin");
    const hashpassword = await bcrypt.hash(password, 12);
    const admin = new Admin();
    const account = new Account({
      username: username,
      password: hashpassword,
      email: email,
      adminId: admin.id,
      Role: role,
    });
    admin.phone = phone;
    admin.accountId = account.id;
    const adminAccount = await account.save();
    const adminUser = await admin.save();
  } catch (error) {
    console.log(error);
  }
};
main();

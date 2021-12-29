const Role = require("../models/role");
module.exports = {
  findById: async (role_id) => {
    const role = await Role.findById(role_id);
    return role;
  },
  findByKey: async (role_key) => {
    const role = await Role.findOne({ key: role_key });
    console.log(role)
    return role;
  },
};

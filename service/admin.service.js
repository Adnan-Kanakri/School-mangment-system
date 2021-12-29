const Admin = require("../models/admin");

module.exports = {
  findByPhoneNumber: async (phone_number) => {
    const admin = await Admin.findOne({ phone: phone_number });
    return admin;
  },
  findById: async (admin_id) => {
    const admin = await Admin.findById(admin_id);
    return admin;
  },
  create: async (image, phone_number) => {
    const admin = new Admin({
      image,
      phone: phone_number,
    });
    return admin;
  },
  setAccountId: async (admin, accountId) => {
    admin.accountId = accountId;
    return admin;
  },
  deleteAdminAccount: async (id) => {
    const deleteIt = await Admin.findByIdAndRemove(id);
    return deleteIt;
  },
  save: async (admin) => {
    return await admin.save();
  },
  updatePhone:async (Admin,value)=>{
    const admin = await Admin.updateOne({phone:value});
    return admin;
  }
};

const Teacher = require("../models/teacher");

module.exports = {
  findByPhoneNumber: async (phone_number) => {
    const teacher = await Teacher.findOne({ phone: phone_number });
    return teacher;
  },
  create: async (image, phone_number) => {
    const teacher = new Teacher({
      image,
      phone: phone_number,
    });
    return teacher;
  },
  setAccountId: async (teacher, accountId) => {
    teacher.accountId = accountId;
    return teacher;
  },
  deleteTeacherAccount: async (id) => {
    console.log("teacher");
    const deleteIt = await Teacher.findByIdAndRemove(id);
    return deleteIt;
  },
  save: async (teacher) => {
    // console.log(teacher);

    return await teacher.save();
  },
  updatePhone: async (Teacher, value) => {
    const teacher = await Teacher.updateOne({ phone: value });
    return teacher;
  },
};

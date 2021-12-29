
  // create: async (image, phone_number) => {
  //   const teacher = new Teacher({
  //     image,
  //     phone: phone_number,
  //   });
  //   return teacher;
  // },

const Student = require("../models/student");
module.exports = {
  findByPhoneNumber: async (phone_number) => {
    const student = await Student.findOne({ phone: phone_number });
    return student;
  },
  create: async (image, phone_number) => {
    const student = new Student({
      image,
      phone: phone_number,
    });
    return student;
  },
  deleteStudentAccount: async (id) => {
    const deleteIt = await Student.findByIdAndRemove(id);
    return deleteIt;
  },
  setAccountId: async (student, accountId) => {
    student.accountId = accountId;
    return student;
  },
  save: async (student) => {
    // console.log(student);
    return  student.save();
  },
  updatePhone:async (Student,value)=>{
    const student = await Student.updateOne({phone:value});
    return student;
  }
};
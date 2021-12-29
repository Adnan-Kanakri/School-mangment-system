const Account = require("../models/account");
const bcrypt = require("bcryptjs");
const adminService = require("./admin.service");
const teacherService = require("./teacher.service");
const studentService = require("./student.service");
const  upload  = require("./upload.service");

module.exports = {
  findById: async (account_id) => {
    const account = await Account.findById(account_id);
    return account;
  },
  findByUsername: async (username) => {
    username = username.trim().toLowerCase();
    const account = await Account.findOne({ username: username });
    return account;
  },
  findByEmail: async (email) => {
    email = email.trim().toLowerCase();
    const account = await Account.findOne({ email: email });
    return account;
  },
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 12);
  },
  create: async (password, email, username, sub_id, role) => {
    let account = null;
    switch (role.key) {
      case "mini_admin":
      case "admin": {
        account = await module.exports.createAdminAccount(
          password,
          email,
          username,
          sub_id,
          role
        );
        break;
      }
      case "teacher": {
        account = await module.exports.createTeacherAccount(
          password,
          email,
          username,
          sub_id,
          role
        );
        break;
      }
      case "student": {
        account = await module.exports.createStudentAccount(
          password,
          email,
          username,
          sub_id,
          role
        );
        break;
      }
      default:
        break;
    }
    return account;
  },
  createAdminAccount: async (password, email, username, admin_id, role) => {
    const hased_password = await module.exports.hashPassword(password);
    const account = new Account({
      email,
      password: hased_password,
      username,
      adminId: admin_id,
      studentId: null,
      teacherId: null,
      Role: role,
    });

    return account;
  },
  createTeacherAccount: async (password, email, username, teacher_id, role) => {
    const hased_password = await module.exports.hashPassword(password);
    const account = new Account({
      email,
      password: hased_password,
      username,
      adminId: null,
      studentId: null,
      teacherId: teacher_id,
      Role: role,
    });

    return account;
  },
  createStudentAccount: async (password, email, username, student_id, role) => {
    const hased_password = await module.exports.hashPassword(password);
    const account = new Account({
      email,
      password: hased_password,
      username,
      adminId: null,
      studentId: student_id,
      teacherId: null,
      Role: role,
    });

    return account;
  },
  save: async (account) => {
    return await account.save();
  },
  checKAccountTypeAndDelete: async (account) => {
    if (account.teacherId) {
      await teacherService.deleteTeacherAccount(account.teacherId);
    } else if (account.adminId) {
      await adminService.deleteAdminAccount(account.adminId);
    } else if (account.studentId) {
      await studentService.deleteStudentAccount(account.studentId);
    }
  },
  setActive: async (account) => {
    const active = await account.updateOne({ is_active: true });
    console.log(active);
    return active;
  },
  deleteAccount: async (account_id) => {
    const deleteit = Account.findByIdAndRemove(account_id);
    return deleteit;
  },
  updateAccount: async (account, email, password, username) => {
    account.username = username;
    account.password = await module.exports.hashPassword(password);
    account.email = email;
    return account;
  },
};

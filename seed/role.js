require("dotenv").config({path:"../.env"});
require("../config/dataBase");
const Role = require("../models/role");
const Permission = require("../models/permissions");
const server_constant = require("../config/server_constant");

console.log(process.env.DB_HOST);

const permissions = [
  {
    key: server_constant.Permessions.CAN_ADD_USER_INDEX,
    description: "p1",
    roles: ["admin", "mini_admin", "teacher", "student"],
  },
  {
    key: server_constant.Permessions.CAN_DELETE_USER_INDEX,
    description: "p2",
    roles: ["admin", "mini_admin", "student"],
  },
  {
    key: server_constant.Permessions.CAN_EDIT_USER_INDEX,
    description: "p3",
    roles: ["admin", "mini_admin", "teacher"],
  },
  {
    key: server_constant.Permessions.CAN_SHOW_USER_INDEX,
    description: "p4",
    roles: ["admin", "mini_admin"],
  },
  {
    key: server_constant.Permessions.CAN_SHOW_USERS_INDEX,
    description: "p5",
    roles: ["admin"],
  },
  {
    key: server_constant.Permessions.CAN_ACTIVE_USERS_INDEX,
    description: "p6",
    roles: ["admin"],
  },
];

const main = async () => {
  const super_admin_role = new Role({
    key: "admin",
    title: "Super Admin",
    permissions: [],
  });
  const admin_role = new Role({
    key: "mini_admin",
    title: "Admin",
    permissions: [],
  });
  const teacher_role = new Role({
    key: "teacher",
    title: "Teacher",
    permissions: [],
  });
  const student_role = new Role({
    key: "student",
    title: "Student",
    permissions: [],
  });

  let i;
  for (i = 0; i < permissions.length; i++) {
    const permission = new Permission({
      key: permissions[i].key,
      description: permissions[i].description,
    });

    const saved_permission = await permission.save();

    if (permissions[i].roles.includes("admin")) {
      super_admin_role.permissions.push(saved_permission);
    }

    if (permissions[i].roles.includes("mini_admin")) {
      admin_role.permissions.push(saved_permission);
    }

    if (permissions[i].roles.includes("teacher")) {
      teacher_role.permissions.push(saved_permission);
    }

    if (permissions[i].roles.includes("student")) {
      student_role.permissions.push(saved_permission);
    }
  }

  console.log("super_admin_role\n", super_admin_role.permissions);
  console.log("admin_role\n", admin_role.permissions);
  console.log("teacher_role\n", teacher_role.permissions);
  console.log("student_role\n", student_role.permissions);
  try {
    await admin_role.save();
    await super_admin_role.save();
    await teacher_role.save();
    await student_role.save();
  } catch (error) {
    console.log("aaa\n", error);
  }
};

main();

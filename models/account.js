const mongoose = require("mongoose");
const permissions = require("./permissions");
const Role = require("./role");

const schema = mongoose.Schema;

const accountScheam = new schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    adminId: {
      type: schema.Types.ObjectId,
      _id: true,
      ref: "Admins",
      default: null,
    },
    studentId: {
      type: schema.Types.ObjectId,
      _id: true,
      ref: "Students",
      default: null,
    },
    teacherId: {
      type: schema.Types.ObjectId,
      _id: true,
      ref: "Teachers",
      default: null,
    },
    Role: {type:Role.schema},
  },
  {
    timestamps: true,
  }
);

accountScheam.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Accounts", accountScheam);

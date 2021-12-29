const mongoose = require("mongoose");

const schema = mongoose.Schema;

const permissionScheam = new schema(
  {
    key: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
permissionScheam.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.created_at;
    },
  });
  module.exports = mongoose.model("permissions", permissionScheam);
  
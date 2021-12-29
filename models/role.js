const mongoose = require("mongoose");
const Permission = require("./permissions");

const schema = mongoose.Schema;

const RoleSchema = new schema({
    key: {
      type: String,
    },
    title: {
      type: String,
    },
    permissions: [
      {
        type: Permission.schema,
      },
    ],
  },{timestamps:true});

RoleSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});

module.exports = mongoose.model("roles", RoleSchema);

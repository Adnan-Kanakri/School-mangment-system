const mongoose = require("mongoose");

const schema = mongoose.Schema;

const attendanceSchema = new schema({
  student: [{
    type: schema.Types.ObjectId,
    ref: "Students",
    required: true,
  }],
  teacher: {
    type: schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  date: {
    type: new Date().now(),
    required: true,
  },
},{timestamps:true});
aproveSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Attendances", attendanceSchema);

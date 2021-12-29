const mongoose = require("mongoose");

const schema = mongoose.Schema;

const noticeSchema = new schema(
  {
    noticLine: {
      type: String,
    },
    adminId: {
      type: schema.Types.ObjectId,
      ref: "Admins",
      default: null,
    },
    teacherId: {
      type: schema.Types.ObjectId,
      ref: "teacher",
      default: null,
    },
    creator:{
      type:String
    }
  },
  { timestamps: true }
);
noticeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Notices", noticeSchema);

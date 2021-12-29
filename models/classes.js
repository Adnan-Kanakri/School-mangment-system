const mongoose = require("mongoose");

const schema = mongoose.Schema;

const classSchema = new schema(
  {
    className: {
      type: String,
      required: true,
    },
    student: [
      {
        student: {
          type: Object,
          required: true,
        },
      },
    ],
    teacher: {
      type: schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
classSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Classes", classSchema);

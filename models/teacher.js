const mongoose = require("mongoose");

const schema = mongoose.Schema;

const teacherSchema = new schema({
  accountId:{
    type:schema.Types.ObjectId,
    ref:"Accounts",
    required: true,
  },
  image: {
    type:String,
    default:null
  },
  phone: {
    type: String,
    required: true,
  },
  salary: {
      type: Number,
      required: true,
      default:2000
  },
  type:{
      type:String,
      required: true,
      default: 'teacher'
  }
},{timestamps:true});
teacherSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Teachers", teacherSchema);

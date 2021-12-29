const mongoose = require("mongoose");

const schema = mongoose.Schema;

const studentSchema = new schema({
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
  fee: {
      type: Number,
      required: true,
      default:1000
  },
  type:{
      type:String,
      required: true,
      default: 'student'
  }
},{timestamps:true});
studentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Students", studentSchema);

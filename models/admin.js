const mongoose = require("mongoose");

const schema = mongoose.Schema;

const adminSchema = new schema({

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
  type:{
      type:String,
      required: true,
      default: 'admin'
  },
 
},{timestamps:true});
adminSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.created_at;
  },
});
module.exports = mongoose.model("Admins", adminSchema);

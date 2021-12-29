const mongoose = require('mongoose');

const schema = mongoose.Schema


const aproveSchema = new schema({
 

},{timestamps:true});
aproveSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.created_at;
    },
  });
  module.exports = mongoose.model("Aproves", aproveSchema);
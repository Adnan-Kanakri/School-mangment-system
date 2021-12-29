const mongoose = require('mongoose');

const schema = mongoose.Schema


const moneySchema = new schema({


},{timestamps:true});
moneySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.created_at;
    },
  });
  module.exports = mongoose.model("Moneies", moneySchema);